'use client'

import { useEffect, useState } from 'react'

export default function PwaInstallPrompt() {
  const [deferred, setDeferred] = useState<any | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function handleBeforeInstall(e: any) {
      e.preventDefault()
      setDeferred(e)
      setVisible(true)
    }

    function handleAppInstalled() {
      setDeferred(null)
      setVisible(false)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall as any)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall as any)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  async function promptInstall() {
    if (!deferred) return
    try {
      deferred.prompt()
      const choice = await deferred.userChoice
      setVisible(false)
      setDeferred(null)
      // optional: handle choice.outcome
    } catch (err) {
      console.error('Install prompt failed', err)
    }
  }

  if (!visible) return null

  return (
    <div className="pwa-install">
      <button onClick={promptInstall} className="install-btn">Install App</button>
    </div>
  )
}
