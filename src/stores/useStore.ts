import { create } from 'zustand'
import { openDB, type IDBPDatabase } from 'idb'

type Song = { id: string; name: string; bpm: number }
type Setlist = { id: string; name: string; songIds: string[] }

type State = {
  songs: Song[]
  setlists: Setlist[]
  addSong: (song: Song) => void
  updateSong: (id: string, patch: Partial<Song>) => Promise<void>
  removeSong: (id: string) => Promise<void>
  addSetlist: (setlist: Setlist) => void
  updateSetlist: (id: string, patch: Partial<Setlist>) => Promise<void>
  removeSetlist: (id: string) => Promise<void>
  load: () => Promise<void>
  syncToCloud: () => Promise<void>
}

let dbPromise: Promise<IDBPDatabase<unknown>> | null = null

function getDB() {
  if (dbPromise) return dbPromise
  if (typeof window === 'undefined' || typeof indexedDB === 'undefined') {
    throw new Error('IndexedDB is not available in this environment')
  }
  dbPromise = openDB('music-tools-db', 2, {
    upgrade(db, oldVersion) {
      if (oldVersion < 1) {
        db.createObjectStore('songs', { keyPath: 'id' })
      }
      if (oldVersion < 2) {
        if (!db.objectStoreNames.contains('setlists')) {
          db.createObjectStore('setlists', { keyPath: 'id' })
        }
      }
    }
  })
  return dbPromise
}

const useStore = create<State>((set, get) => ({
  songs: [],
  setlists: [],
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
  addSetlist: async (setlist) => {
    set((s) => ({ setlists: [...s.setlists, setlist] }))
    const db = await getDB()
    await db.put('setlists', setlist)
  },
  updateSetlist: async (id, patch) => {
    set((s) => ({ setlists: s.setlists.map((setlist) => setlist.id === id ? { ...setlist, ...patch } : setlist) }))
    const db = await getDB()
    const updated = get().setlists.find((s) => s.id === id)
    if (updated) await db.put('setlists', updated)
  },
  removeSetlist: async (id) => {
    set((s) => ({ setlists: s.setlists.filter((setlist) => setlist.id !== id) }))
    const db = await getDB()
    await db.delete('setlists', id)
  },
  load: async () => {
    const db = await getDB()
    const allSongs = await db.getAll('songs')
    const allSetlists = await db.getAll('setlists')
    set({ songs: allSongs as Song[], setlists: allSetlists as Setlist[] })
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
