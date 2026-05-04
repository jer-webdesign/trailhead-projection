import { useEffect, useRef, useState, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'

export interface SelectionEvent {
  homesiteId: string | null
  timestamp: number
  source: 's1' | 's2' | 's3'
}

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || ''

export function useSocket(screenId: 's1' | 's2' | 's3') {
  const socketRef = useRef<Socket | null>(null)
  const [connected, setConnected] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
    })
    socketRef.current = socket

    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))

    socket.on('selection', (event: SelectionEvent) => {
      if (event.source !== screenId) {
        setSelectedId(event.homesiteId)
      }
    })

    return () => {
      socket.disconnect()
    }
  }, [screenId])

  const emitSelection = useCallback((homesiteId: string | null) => {
    setSelectedId(homesiteId)
    socketRef.current?.emit('selection', {
      homesiteId,
      timestamp: Date.now(),
      source: screenId,
    } satisfies SelectionEvent)
  }, [screenId])

  return { connected, selectedId, setSelectedId, emitSelection }
}
