import { useEffect, useState } from 'react'

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    function onChange() {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', onChange)

    // Attempt auto-fullscreen immediately
    document.documentElement.requestFullscreen?.().catch(() => {
      // Browser blocked it (no gesture) — silently ignore
    })

    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  return { isFullscreen }
}
