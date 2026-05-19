'use client'
import { useEffect, useState } from 'react'
import useStore from '../../../src/stores/useStore'

export default function LibraryPage() {
  const songs = useStore((s) => s.songs)
  const addSong = useStore((s) => s.addSong)
  const [name, setName] = useState('')
  const [bpm, setBpm] = useState(120)

  useEffect(()=>{
    // load persisted songs
    useStore.getState().load()
  },[])

  return (
    <div>
      <h2>Song Library</h2>
      <div>
        <input placeholder="Song name" value={name} onChange={(e)=>setName(e.target.value)} />
        <input type="number" value={bpm} onChange={(e)=>setBpm(Number(e.target.value))} />
        <button onClick={()=>{ addSong({ id: Date.now().toString(), name, bpm }); setName('') }}>Add</button>
      </div>
      <ul>
        {songs.map(s => <li key={s.id}>{s.name} — {s.bpm} BPM</li>)}
      </ul>
    </div>
  )
}
