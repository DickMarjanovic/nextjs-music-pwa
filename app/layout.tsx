import { initCloudSync } from "../src/services/syncService";
import Header from '../src/components/Header'
import Footer from '../src/components/Footer'
import '../styles/globals.scss'
import { Metadata } from 'next'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

initCloudSync(firebaseConfig)

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
