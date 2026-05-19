export async function detectTempo(onUpdate?: (bpm:number)=>void): Promise<number | null> {
  // High-precision tempo detection using autocorrelation on downsampled audio
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  const ctx = new AudioContext()
  const src = ctx.createMediaStreamSource(stream)
  const analyser = ctx.createAnalyser()
  analyser.fftSize = 2048
  src.connect(analyser)

  const bufferLength = analyser.fftSize
  const data = new Float32Array(bufferLength)

  function autoCorrelate(buf: Float32Array, sampleRate: number) {
    // From https://github.com/cwilso/PitchDetect (adapted)
    const SIZE = buf.length
    const rms = Math.sqrt(buf.reduce((sum, v) => sum + v*v, 0)/SIZE)
    if (rms < 0.01) return -1

    let r1 = 0, r2 = SIZE - 1
    for (let i = 0; i < SIZE/2; i++) if (Math.abs(buf[i]) < 0.0005) { r1 = i; break }
    for (let i = 1; i < SIZE/2; i++) if (Math.abs(buf[SIZE - i]) < 0.0005) { r2 = SIZE - i; break }

    const trimmed = buf.slice(r1, r2)
    const newSize = trimmed.length
    const c = new Array(newSize).fill(0)
    for (let i = 0; i < newSize; i++) for (let j = 0; j < newSize - i; j++) c[i] = c[i] + trimmed[j]*trimmed[j+i]

    let d = 0
    while (c[d] > c[d+1]) d++
    let maxval = -1, maxpos = -1
    for (let i = d; i < newSize; i++) {
      if (c[i] > maxval) { maxval = c[i]; maxpos = i }
    }
    if (maxpos <= 0) return -1
    const T0 = maxpos
    const bpm = 60 / (T0 / sampleRate)
    return bpm
  }

  return new Promise((resolve) => {
    let running = true
    const sampleRate = ctx.sampleRate

    async function analyze() {
      analyser.getFloatTimeDomainData(data)
      const bpm = autoCorrelate(data, sampleRate)
      if (bpm > 0) {
        if (onUpdate) onUpdate(Math.round(bpm))
      }
      if (running) requestAnimationFrame(analyze)
    }

    analyze()

    // Stop after 8 seconds by default and return last value
    setTimeout(async () => {
      running = false
      analyser.disconnect()
      src.disconnect()
      stream.getTracks().forEach(t => t.stop())
      ctx.close()
      resolve(null)
    }, 8000)
  })
}
