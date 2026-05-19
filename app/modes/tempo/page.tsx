'use client'
import { useState } from 'react'
import { detectTempo } from '../../../src/utils/audio/tempoDetector'

export default function TempoPage() {
  const [bpm, setBpm] = useState<number | null>(null)
  const [listening, setListening] = useState(false)

  async function start() {
    setListening(true)
    const estimated = await detectTempo((value) => setBpm(value))
    if (estimated) setBpm(estimated)
    setListening(false)
  }

  return (
    <div>
      <h2>Tempo Detection (High Precision)</h2>
      <p>Detected BPM: {bpm ?? '—'}</p>
      <button onClick={start} disabled={listening}>{listening ? 'Listening…' : 'Start Listening'}</button>
    </div>
  )
}
