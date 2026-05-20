import { createRealtimeBpmAnalyzer } from 'realtime-bpm-analyzer'

export async function detectTempo(onUpdate?: (bpm: number) => void): Promise<number | null> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  const ctx = new AudioContext()
  const source = ctx.createMediaStreamSource(stream)
  const analyzer = await createRealtimeBpmAnalyzer(ctx)
  const silentGain = ctx.createGain()
  silentGain.gain.value = 0

  source.connect(analyzer.node)
  analyzer.node.connect(silentGain)
  silentGain.connect(ctx.destination)

  let lastBpm: number | null = null
  let resolved = false

  function cleanup() {
    try {
      source.disconnect()
    } catch {
      // ignore
    }
    try {
      analyzer.node.disconnect()
    } catch {
      // ignore
    }
    try {
      silentGain.disconnect()
    } catch {
      // ignore
    }
    stream.getTracks().forEach((track) => track.stop())
    ctx.close().catch(() => {
      // ignore closing failures
    })
  }

  analyzer.on('bpm', (event) => {
    const tempo = event.bpm?.[0]?.tempo ?? null
    if (tempo && tempo > 0) {
      const bpm = Math.round(tempo)
      lastBpm = bpm
      onUpdate?.(bpm)
    }
  })

  return new Promise((resolve) => {
    const timeout = window.setTimeout(() => {
      if (!resolved) {
        resolved = true
        cleanup()
        resolve(lastBpm)
      }
    }, 8000)

    analyzer.on('error', () => {
      if (!resolved) {
        resolved = true
        window.clearTimeout(timeout)
        cleanup()
        resolve(lastBpm)
      }
    })
  })
}
