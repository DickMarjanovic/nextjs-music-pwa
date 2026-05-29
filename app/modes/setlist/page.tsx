'use client'

import { useEffect, useMemo, useState } from 'react'
import useStore from '../../../src/stores/useStore'

export default function SetlistManagerPage() {
  const songs = useStore((s) => s.songs)
  const setlists = useStore((s) => s.setlists)
  const addSetlist = useStore((s) => s.addSetlist)
  const updateSetlist = useStore((s) => s.updateSetlist)
  const removeSetlist = useStore((s) => s.removeSetlist)
  const [newSetlistName, setNewSetlistName] = useState('')
  const [activeSetlistId, setActiveSetlistId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [selectedSongIds, setSelectedSongIds] = useState<string[]>([])

  useEffect(() => {
    useStore.getState().load()
  }, [])

  useEffect(() => {
    if (!activeSetlistId) {
      setEditName('')
      setSelectedSongIds([])
      return
    }

    const setlist = setlists.find((item) => item.id === activeSetlistId)
    if (setlist) {
      setEditName(setlist.name)
      setSelectedSongIds(setlist.songIds)
    }
  }, [activeSetlistId, setlists])

  const selectedSongs = useMemo(
    () => selectedSongIds
      .map((id) => songs.find((song) => song.id === id))
      .filter((song): song is { id: string; name: string; bpm: number } => Boolean(song)),
    [selectedSongIds, songs]
  )

  function handleCreate() {
    const trimmedName = newSetlistName.trim()
    if (!trimmedName) return
    const id = Date.now().toString()
    addSetlist({ id, name: trimmedName, songIds: [] })
    setActiveSetlistId(id)
    setNewSetlistName('')
  }

  function handleSave() {
    if (!activeSetlistId) return
    updateSetlist(activeSetlistId, { name: editName.trim() || 'Untitled Setlist', songIds: selectedSongIds })
  }

  function handleDelete(id: string) {
    removeSetlist(id)
    if (activeSetlistId === id) {
      setActiveSetlistId(null)
    }
  }

  function toggleSongSelection(songId: string) {
    setSelectedSongIds((current) =>
      current.includes(songId) ? current.filter((id) => id !== songId) : [...current, songId]
    )
  }

  function moveSong(songId: string, direction: -1 | 1) {
    setSelectedSongIds((current) => {
      const index = current.indexOf(songId)
      if (index === -1) return current
      const next = index + direction
      if (next < 0 || next >= current.length) return current
      const updated = [...current]
      const temp = updated[index]
      updated[index] = updated[next]
      updated[next] = temp
      return updated
    })
  }

  return (
    <div>
      <h2>Setlist Manager</h2>

      <section style={{ marginBottom: 24 }}>
        <h3>Create a new setlist</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end' }}>
          <label style={{ flex: '1 1 220px' }}>
            Setlist name
            <input
              style={{ width: '100%', marginTop: 6, padding: '8px 10px', borderRadius: 8, border: '1px solid #ccc' }}
              placeholder="Enter a name"
              value={newSetlistName}
              onChange={(e) => setNewSetlistName(e.target.value)}
            />
          </label>
          <button onClick={handleCreate} style={{ padding: '10px 16px', borderRadius: 8 }}>
            Create Setlist
          </button>
        </div>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h3>Your setlists</h3>
        {setlists.length === 0 ? (
          <p>No setlists yet. Create one to start selecting songs.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10 }}>
            {setlists.map((setlist) => (
              <li
                key={setlist.id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: 12,
                  padding: 14,
                  background: activeSetlistId === setlist.id ? '#eef4ff' : '#fff',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 12
                }}
              >
                <button
                  type="button"
                  onClick={() => setActiveSetlistId(setlist.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#1d4ed8',
                    textAlign: 'left',
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  {setlist.name} ({setlist.songIds.length} song{setlist.songIds.length === 1 ? '' : 's'})
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(setlist.id)}
                  style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd', background: '#fff' }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {activeSetlistId && (
        <section style={{ marginBottom: 24 }}>
          <h3>Edit setlist</h3>
          <div style={{ marginBottom: 16, display: 'grid', gap: 12 }}>
            <label>
              Setlist title
              <input
                style={{ width: '100%', marginTop: 6, padding: '8px 10px', borderRadius: 8, border: '1px solid #ccc' }}
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </label>

            <div>
              <strong>Select songs</strong>
              {songs.length === 0 ? (
                <p style={{ marginTop: 8 }}>Add songs in the Song Library before selecting them here.</p>
              ) : (
                <div
                  style={{
                    marginTop: 8,
                    display: 'grid',
                    gap: 8,
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))'
                  }}
                >
                  {songs.map((song) => (
                    <label
                      key={song.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '10px 12px',
                        border: '1px solid #ececec',
                        borderRadius: 10,
                        background: selectedSongIds.includes(song.id) ? '#f0f8ff' : '#fff'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedSongIds.includes(song.id)}
                        onChange={() => toggleSongSelection(song.id)}
                      />
                      <span style={{ flex: 1 }}>
                        {song.name}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div>
              <strong>Selected songs</strong>
              {selectedSongIds.length === 0 ? (
                <p style={{ marginTop: 8 }}>No songs selected yet.</p>
              ) : (
                <div style={{ marginTop: 8, display: 'grid', gap: 10 }}>
                  {selectedSongs.map((song, index) => (
                    <div
                      key={song.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr auto auto auto',
                        gap: 8,
                        alignItems: 'center',
                        padding: '10px 12px',
                        border: '1px solid #ececec',
                        borderRadius: 10,
                        background: '#fff'
                      }}
                    >
                      <span>
                        {index + 1}. {song.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => moveSong(song.id, -1)}
                        disabled={index === 0}
                        style={{ padding: '8px 10px', borderRadius: 8 }}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSong(song.id, 1)}
                        disabled={index === selectedSongIds.length - 1}
                        style={{ padding: '8px 10px', borderRadius: 8 }}
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleSongSelection(song.id)}
                        style={{ padding: '8px 10px', borderRadius: 8 }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button onClick={handleSave} style={{ padding: '10px 16px', borderRadius: 8 }}>
              Save Setlist
            </button>
            <button
              onClick={() => setActiveSetlistId(null)}
              style={{ padding: '10px 16px', borderRadius: 8, background: '#f8fafc', border: '1px solid #ddd' }}
            >
              Close Editor
            </button>
          </div>
        </section>
      )}
    </div>
  )
}
