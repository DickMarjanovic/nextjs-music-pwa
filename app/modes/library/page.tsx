'use client'
import { useEffect, useState } from 'react'
import useStore from '../../../src/stores/useStore'

export default function LibraryPage() {
  const songs = useStore((s) => s.songs)
  const addSong = useStore((s) => s.addSong)
  const updateSong = useStore((s) => s.updateSong)
  const [name, setName] = useState('')
  const [bpm, setBpm] = useState(120)
  const [sortBy, setSortBy] = useState<'name'|'bpm'>('name')
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('asc')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editBpm, setEditBpm] = useState<number>(120)

  useEffect(()=>{
    // load persisted songs
    useStore.getState().load()
  },[])

  function toggleSort(column: 'name'|'bpm'){
    if(sortBy === column) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortBy(column); setSortDir('asc') }
  }

  const sorted = [...songs].sort((a,b)=>{
    if(sortBy === 'name'){
      const res = a.name.localeCompare(b.name)
      return sortDir === 'asc' ? res : -res
    }
    const res = a.bpm - b.bpm
    return sortDir === 'asc' ? res : -res
  })

  async function handleSave(id: string){
    await updateSong(id, { name: editName, bpm: editBpm })
    setEditingId(null)
  }

  return (
    <div>
      <h2>Song Library</h2>
      <div>
        <input placeholder="Song name" value={name} onChange={(e)=>setName(e.target.value)} />
        <input type="number" value={bpm} onChange={(e)=>setBpm(Number(e.target.value))} />
        <button onClick={()=>{ if(!name) return; addSong({ id: Date.now().toString(), name, bpm }); setName('') }}>Add</button>
      </div>

      <table style={{width: '100%', borderCollapse: 'collapse', marginTop: 12}}>
        <thead>
          <tr>
            <th style={{textAlign:'left', cursor:'pointer'}} onClick={()=>toggleSort('name')}>Name {sortBy==='name'? (sortDir==='asc'? '▲':'▼') : ''}</th>
            <th style={{textAlign:'left', cursor:'pointer'}} onClick={()=>toggleSort('bpm')}>BPM {sortBy==='bpm'? (sortDir==='asc'? '▲':'▼') : ''}</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(s => (
            <tr key={s.id} style={{borderTop: '1px solid #eee'}}>
              <td style={{padding: '8px'}}>
                {editingId === s.id ? (
                  <input value={editName} onChange={(e)=>setEditName(e.target.value)} />
                ) : (
                  s.name
                )}
              </td>
              <td style={{padding: '8px'}}>
                {editingId === s.id ? (
                  <input type="number" value={editBpm} onChange={(e)=>setEditBpm(Number(e.target.value))} />
                ) : (
                  `${s.bpm} BPM`
                )}
              </td>
              <td style={{padding: '8px'}}>
                {editingId === s.id ? (
                  <>
                    <button onClick={()=>handleSave(s.id)}>Save</button>
                    <button onClick={()=>setEditingId(null)}>Cancel</button>
                  </>
                ) : (
                  <button onClick={()=>{ setEditingId(s.id); setEditName(s.name); setEditBpm(s.bpm) }}>Edit</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
