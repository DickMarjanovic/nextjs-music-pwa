import '../styles/globals.scss'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Music Tools PWA',
  description: 'A progressive web app for music tools including tempo detection, metronome, and library management',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'MusicTools'
  },
  icons: {
    icon: '/icon-192.png',
    apple: '/apple-touch-icon.png'
  }
}

export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#1d4ed8' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main style={{padding:20}}>{children}</main>
      </body>
    </html>
  )
}
