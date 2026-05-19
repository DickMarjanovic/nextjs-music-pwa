import { Oscillator, Transport, start } from 'tone'

type StartOptions = { performanceMode?: boolean; beatsPerBar?: number }

export default class Metronome {
  private isPlaying = false
  private barsElapsed = 0
  private performanceMode = false
  private beatsPerBar = 4

  constructor() {
    start()
  }

  setBpm(bpm: number) {
    Transport.bpm.value = bpm
  }

  start(opts: StartOptions = {}) {
    this.performanceMode = !!opts.performanceMode
    this.beatsPerBar = opts.beatsPerBar || 4
    this.barsElapsed = 0

    Transport.scheduleRepeat((time) => {
      const beat = (Math.floor(Transport.ticks / Transport.PPQ) % this.beatsPerBar) + 1
      const shouldBeSilent = this.performanceMode && this.barsElapsed >= 8
      if (!shouldBeSilent) {
        const osc = new Oscillator({ frequency: 1000, type: 'sine' }).toDestination()
        osc.start(time).stop(time + 0.05)
      }
      if (beat === 1) this.barsElapsed++
    }, '4n')

    Transport.start()
    this.isPlaying = true
  }

  stop() {
    Transport.stop()
    Transport.cancel()
    this.isPlaying = false
    this.barsElapsed = 0
  }

  dispose() {
    this.stop()
  }
}
