import { initCloudSync } from "../src/services/syncService";
import Header from '../src/components/Header'
import Footer from '../src/components/Footer'
import '../styles/globals.scss'
import { Metadata } from 'next'

initCloudSync({
  apiKey: "AIzaSyBJNN0MquAuQ1XcDqYqnZ3boJKwk0VwXqQ",
  authDomain: "groovly-2a756.firebaseapp.com",
  projectId: "groovly-2a756",
  storageBucket: "groovly-2a756.firebasestorage.app",
  messagingSenderId: "75107342085",
  appId: "1:75107342085:web:d182977d6dcafdf61b096c",
  measurementId: "G-H5ZMDXHGQN"
});

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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="page-shell">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
