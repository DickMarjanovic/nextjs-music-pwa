// Firebase Firestore-based cloud sync implementation.
import { initializeApp, FirebaseOptions, getApps } from 'firebase/app'
import {
  getFirestore,
  collection,
  setDoc,
  doc,
  onSnapshot,
  getDocs,
  Firestore
} from 'firebase/firestore'

let db: Firestore | null = null

export async function initCloudSync(config: FirebaseOptions) {
  if (!getApps().length) {
    initializeApp(config)
  }
  db = getFirestore()
}

export async function syncSongsToCloud(songs: any[]) {
  if (!db) {
    console.warn('Cloud sync not initialized. Call initCloudSync(config) first.')
    return
  }
  const col = collection(db, 'songs')
  // Overwrite or create documents matching song.id
  await Promise.all(songs.map(async (s) => {
    const d = doc(col, s.id)
    await setDoc(d, s)
  }))
}

export function subscribeToCloudSongs(onUpdate: (songs: any[]) => void) {
  if (!db) {
    console.warn('Cloud sync not initialized. Call initCloudSync(config) first.')
    return () => {}
  }
  const col = collection(db, 'songs')
  const unsub = onSnapshot(col, (snap) => {
    const items: any[] = []
    snap.forEach(d => items.push(d.data()))
    onUpdate(items)
  })
  return unsub
}

export async function fetchCloudSongs() {
  if (!db) return []
  const col = collection(db, 'songs')
  const snap = await getDocs(col)
  return snap.docs.map(d => d.data())
}
