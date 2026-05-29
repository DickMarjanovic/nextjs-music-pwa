import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <h1>Music Tools PWA</h1>
      <p>Modes: Tempo Detection, Metronome, Library, Setlist Manager, Performance</p>
      <ul>
        <li><Link href="/modes/tempo">Tempo Detection</Link></li>
        <li><Link href="/modes/metronome">Metronome</Link></li>
        <li><Link href="/modes/library">Song Library</Link></li>
        <li><Link href="/modes/setlist">Setlist Manager</Link></li>
        <li><Link href="/modes/performance">Performance</Link></li>
      </ul>
    </div>
  )
}
