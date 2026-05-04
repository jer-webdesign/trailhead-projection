import { useEffect, useCallback, useState } from 'react'

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    function onChange() {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const enter = useCallback(() => {
    const el = document.documentElement
    if (el.requestFullscreen) el.requestFullscreen()
  }, [])

  return { isFullscreen, enter }
}
