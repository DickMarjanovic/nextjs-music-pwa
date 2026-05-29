import { create } from 'zustand'
import { openDB, type IDBPDatabase } from 'idb'

type Song = { id: string; name: string; bpm: number }

type State = {
  songs: Song[]
  addSong: (song: Song) => void
  updateSong: (id: string, patch: Partial<Song>) => Promise<void>
  removeSong: (id: string) => Promise<void>
  load: () => Promise<void>
  syncToCloud: () => Promise<void>
}

let dbPromise: Promise<IDBPDatabase<unknown>> | null = null

function getDB() {
  if (dbPromise) return dbPromise
  if (typeof window === 'undefined' || typeof indexedDB === 'undefined') {
    throw new Error('IndexedDB is not available in this environment')
  }
  dbPromise = openDB('music-tools-db', 1, {
    upgrade(db) {
      db.createObjectStore('songs', { keyPath: 'id' })
    }
  })
  return dbPromise
}

const useStore = create<State>((set, get) => ({
  songs: [],
  addSong: async (song) => {
    set((s) => ({ songs: [...s.songs, song] }))
    const db = await getDB()
    await db.put('songs', song)
    try {
      // TypeScript with `moduleResolution: nodenext` requires explicit extensions,
      // but Next.js webpack resolver handles TS/TSX imports without extensions.
      // Silence the TS check here for the dynamic import.
      // @ts-ignore
      const { syncAddSong } = await import('../services/syncService')
      await syncAddSong(song).catch(() => {})
    } catch (e) {
      // ignore if sync service not available yet
    }
  },
  updateSong: async (id, patch) => {
    set((s) => ({ songs: s.songs.map((song) => song.id === id ? { ...song, ...patch } : song) }))
    const db = await getDB()
    const updated = (get().songs.find((s) => s.id === id) as Song | undefined)
    if (updated) await db.put('songs', updated)
    try {
      // sync to cloud if available
      // @ts-ignore
      const { syncUpdateSong } = await import('../services/syncService')
      await syncUpdateSong(id, patch).catch(() => {})
    } catch (e) {
      // ignore
    }
  },
  removeSong: async (id) => {
    set((s) => ({ songs: s.songs.filter((song) => song.id !== id) }))
    const db = await getDB()
    await db.delete('songs', id)
    try {
      // sync to cloud if available
      // @ts-ignore
      const { syncRemoveSong } = await import('../services/syncService')
      await syncRemoveSong(id).catch(() => {})
    } catch (e) {
      // ignore
    }
  },
  load: async () => {
    const db = await getDB()
    const all = await db.getAll('songs')
    set({ songs: all as Song[] })
  },
  syncToCloud: async () => {
    const all = get().songs
    try {
      // @ts-ignore
      const { syncSongsToCloud } = await import('../services/syncService')
      await syncSongsToCloud(all)
    } catch (e) {
      console.error('Failed to sync to cloud:', e)
    }
  }
}))

export default useStore
