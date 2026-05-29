'use client'
import { useEffect, useRef, useState } from 'react'
import Metronome from '../../../src/utils/audio/metronome'
import { detectTempo } from '../../../src/utils/audio/tempoDetector'

export default function TempoPage() {
  const [activeTab, setActiveTab] = useState<'detect' | 'metronome'>('detect')
  const [detectedBpm, setDetectedBpm] = useState<number | null>(null)
  const [listening, setListening] = useState(false)
  const [metronomeBpm, setMetronomeBpm] = useState(120)
  const [playing, setPlaying] = useState(false)
  const [perfMode, setPerfMode] = useState(false)
  const [beatsPerBar] = useState(4)
  const metronomeRef = useRef<Metronome | null>(null)

  useEffect(() => {
    metronomeRef.current = new Metronome()
    metronomeRef.current.setBpm(metronomeBpm)

    return () => metronomeRef.current?.dispose()
  }, [])

  useEffect(() => {
    metronomeRef.current?.setBpm(metronomeBpm)
  }, [metronomeBpm])

  async function startDetection() {
    setListening(true)
    const estimated = await detectTempo((value) => setDetectedBpm(value))
    if (estimated) setDetectedBpm(estimated)
    setListening(false)
  }

  function toggleMetronome() {
    if (playing) metronomeRef.current?.stop()
    else metronomeRef.current?.start({ performanceMode: perfMode, beatsPerBar })
    setPlaying(!playing)
  }

  return (
    <div>
      <h2>Tempo</h2>
      <nav style={{ marginBottom: '1rem' }}>
        <button type="button" onClick={() => setActiveTab('detect')} disabled={activeTab === 'detect'}>
          Tempo Detection
        </button>
        <button type="button" onClick={() => setActiveTab('metronome')} disabled={activeTab === 'metronome'}>
          Metronome
        </button>
      </nav>

      {activeTab === 'detect' ? (
        <section>
          <h3>Tempo Detection</h3>
          <p>Detected BPM: {detectedBpm ?? '—'}</p>
          <button onClick={startDetection} disabled={listening}>
            {listening ? 'Listening…' : 'Start Listening'}
          </button>
          {detectedBpm ? (
            <p>
              Use this tempo in the metronome: <button type="button" onClick={() => setMetronomeBpm(detectedBpm)}>Apply BPM</button>
            </p>
          ) : null}
        </section>
      ) : (
        <section>
          <h3>Metronome</h3>
          <div>
            <label>
              BPM:
              <input
                type="number"
                value={metronomeBpm}
                min={30}
                max={300}
                onChange={(e) => setMetronomeBpm(Number(e.target.value))}
              />
            </label>
          </div>
          <div>
            <label>
              Performance Mode (silent after 8 bars):
              <input type="checkbox" checked={perfMode} onChange={(e) => setPerfMode(e.target.checked)} />
            </label>
          </div>
          <button onClick={toggleMetronome}>{playing ? 'Stop' : 'Start'}</button>
        </section>
      )}
    </div>
  )
}
