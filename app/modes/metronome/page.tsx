'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function MetronomePage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/modes/tempo')
  }, [router])

  return (
    <div>
      <h2>Redirecting...</h2>
      <p>If you are not redirected automatically, <a href="/modes/tempo">click here to go to Tempo</a>.</p>
    </div>
  )
}
