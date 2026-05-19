'use client'
import { useEffect, useRef, useState } from 'react'
import Metronome from '../../../src/utils/audio/metronome'

export default function MetronomePage() {
  const [bpm, setBpm] = useState(120)
  const [playing, setPlaying] = useState(false)
  const [perfMode, setPerfMode] = useState(false)
  const [beatsPerBar] = useState(4)
  const metronomeRef = useRef<Metronome | null>(null)

  useEffect(() => {
    metronomeRef.current = new Metronome()
    metronomeRef.current.setBpm(bpm)

    return () => metronomeRef.current?.dispose()
  }, [])

  useEffect(() => {
    metronomeRef.current?.setBpm(bpm)
  }, [bpm])

  function toggle() {
    if (playing) metronomeRef.current?.stop()
    else metronomeRef.current?.start({ performanceMode: perfMode, beatsPerBar })
    setPlaying(!playing)
  }

  return (
    <div>
      <h2>Metronome</h2>
      <div>
        <label>BPM: <input type="number" value={bpm} onChange={(e)=>setBpm(Number(e.target.value))} /></label>
      </div>
      <div>
        <label>Performance Mode (silent after 8 bars): <input type="checkbox" checked={perfMode} onChange={(e)=>setPerfMode(e.target.checked)} /></label>
      </div>
      <button onClick={toggle}>{playing ? 'Stop' : 'Start'}</button>
    </div>
  )
}
