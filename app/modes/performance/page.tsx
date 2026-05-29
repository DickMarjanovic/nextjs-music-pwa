'use client'

import { useEffect, useMemo, useState } from 'react'
import useStore from '../../../src/stores/useStore'

export default function PerformancePage() {
  const songs = useStore((s) => s.songs)
  const setlists = useStore((s) => s.setlists)
  const [selectedSetlistId, setSelectedSetlistId] = useState('')
  const [currentSongIndex, setCurrentSongIndex] = useState(0)

  useEffect(() => {
    useStore.getState().load()
  }, [])

  useEffect(() => {
    setCurrentSongIndex(0)
  }, [selectedSetlistId])

  const activeSetlist = useMemo(
    () => setlists.find((setlist) => setlist.id === selectedSetlistId) ?? null,
    [selectedSetlistId, setlists]
  )

  const currentSong = useMemo(() => {
    if (!activeSetlist || activeSetlist.songIds.length === 0) return null
    const songId = activeSetlist.songIds[currentSongIndex]
    return songs.find((song) => song.id === songId) ?? null
  }, [activeSetlist, currentSongIndex, songs])

  const canGoBack = activeSetlist ? currentSongIndex > 0 : false
  const canGoNext = activeSetlist ? currentSongIndex < activeSetlist.songIds.length - 1 : false

  return (
    <div>
      <h2>Performance</h2>

      <section style={{ marginBottom: 24 }}>
        <label style={{ display: 'block', marginBottom: 10, fontWeight: 600 }}>
          Select a setlist
          <select
            value={selectedSetlistId}
            onChange={(e) => setSelectedSetlistId(e.target.value)}
            style={{ display: 'block', width: '100%', maxWidth: 420, marginTop: 8, padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc' }}
          >
            <option value="">Choose a setlist</option>
            {setlists.map((setlist) => (
              <option key={setlist.id} value={setlist.id}>
                {setlist.name} ({setlist.songIds.length} songs)
              </option>
            ))}
          </select>
        </label>
      </section>

      {selectedSetlistId === '' ? (
        <p>Please select a setlist to view performance details.</p>
      ) : !activeSetlist ? (
        <p>The selected setlist could not be found.</p>
      ) : activeSetlist.songIds.length === 0 ? (
        <p>This setlist has no songs. Add songs in the Setlist Manager first.</p>
      ) : (
        <section style={{ display: 'grid', gap: 20, alignItems: 'center' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr auto',
              gap: 12,
              alignItems: 'center',
              justifyItems: 'center'
            }}
          >
            <button
              type="button"
              disabled={!canGoBack}
              onClick={() => setCurrentSongIndex((index) => Math.max(0, index - 1))}
              style={{ padding: '12px 18px', borderRadius: 999, border: '1px solid #ccc', background: canGoBack ? '#1d4ed8' : '#f3f4f6', color: canGoBack ? '#fff' : '#9ca3af', cursor: canGoBack ? 'pointer' : 'not-allowed' }}
            >
              Previous
            </button>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.8rem', fontWeight: 800, lineHeight: 1.1, marginBottom: 12 }}>
                {currentSong?.name ?? 'Unknown song'}
              </div>
              <div style={{ fontSize: '2rem', color: '#1d4ed8', fontWeight: 700 }}>
                {currentSong ? `${currentSong.bpm} BPM` : ''}
              </div>
            </div>

            <button
              type="button"
              disabled={!canGoNext}
              onClick={() =>
                setCurrentSongIndex((index) =>
                  activeSetlist && index < activeSetlist.songIds.length - 1 ? index + 1 : index
                )
              }
              style={{ padding: '12px 18px', borderRadius: 999, border: '1px solid #ccc', background: canGoNext ? '#1d4ed8' : '#f3f4f6', color: canGoNext ? '#fff' : '#9ca3af', cursor: canGoNext ? 'pointer' : 'not-allowed' }}
            >
              Next
            </button>
          </div>

          <div style={{ textAlign: 'center', color: '#6b7280' }}>
            Song {currentSongIndex + 1} of {activeSetlist.songIds.length}
          </div>
        </section>
      )}
    </div>
  )
}
