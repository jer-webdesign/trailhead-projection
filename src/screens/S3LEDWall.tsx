import React, { useEffect, useRef, useState } from 'react'
import { homesites } from '../data/homesites'
import { useSocket } from '../hooks/useSocket'

type Phase = 'idle' | 'transition-in' | 'playing' | 'transition-out'

export default function S3LEDWall() {
  const { connected, selectedId } = useSocket('s3')
  const selected = homesites.find(h => h.id === selectedId) ?? null
  const videoRef = useRef<HTMLVideoElement>(null)
  const [phase, setPhase] = useState<Phase>('idle')
  const prevIdRef = useRef<string | null>(null)

  useEffect(() => {
    if (selectedId !== prevIdRef.current) {
      prevIdRef.current = selectedId
      if (selectedId) {
        setPhase('transition-in')
        const t = setTimeout(() => {
          setPhase('playing')
          videoRef.current?.play().catch(() => {/* autoplay blocked — user interaction needed */})
        }, 800)
        return () => clearTimeout(t)
      } else {
        setPhase('transition-out')
        videoRef.current?.pause()
        const t = setTimeout(() => setPhase('idle'), 600)
        return () => clearTimeout(t)
      }
    }
  }, [selectedId])

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        background: '#000',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Idle state — branded holding screen */}
      <div
        style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: 'radial-gradient(ellipse at center, #1a0a2e 0%, #0a0015 60%, #000 100%)',
          opacity: phase === 'idle' ? 1 : 0,
          transition: 'opacity 0.8s ease',
          zIndex: 1,
        }}
      >
        <svg width="120" height="120" viewBox="0 0 64 64" style={{ marginBottom: '24px' }}>
          <polygon points="32,4 60,56 4,56" fill="none" stroke="#c9a84c" strokeWidth="2.5">
            <animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="20s" repeatCount="indefinite" />
          </polygon>
          <polygon points="32,4 60,56 4,56" fill="none" stroke="#c9a84c" strokeWidth="1" opacity="0.4">
            <animateTransform attributeName="transform" type="rotate" from="0 32 32" to="-360 32 32" dur="30s" repeatCount="indefinite" />
          </polygon>
          <circle cx="32" cy="36" r="8" fill="#c9a84c">
            <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />
          </circle>
        </svg>
        <div
          style={{
            color: 'white',
            fontWeight: 900,
            fontSize: 'clamp(3rem, 8vw, 7rem)',
            letterSpacing: '0.2em',
            textShadow: '0 0 40px rgba(201,168,76,0.6)',
          }}
        >
          TRAILHEAD
        </div>
        <div
          style={{
            color: 'rgba(201,168,76,0.7)',
            fontSize: 'clamp(0.8rem, 1.5vw, 1.2rem)',
            letterSpacing: '0.4em',
            marginTop: '12px',
            textTransform: 'uppercase',
          }}
        >
          Select a homesite to explore
        </div>

        {/* Connection indicator */}
        <div style={{ position: 'absolute', bottom: '24px', right: '32px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            width: '10px', height: '10px', borderRadius: '50%',
            background: connected ? '#a8ff3e' : '#ff4444',
            boxShadow: connected ? '0 0 10px #a8ff3e' : 'none',
            display: 'inline-block',
          }} />
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
            {connected ? 'CONNECTED' : 'OFFLINE'}
          </span>
        </div>
      </div>

      {/* Video overlay */}
      <div
        style={{
          position: 'absolute', inset: 0,
          opacity: phase === 'playing' ? 1 : 0,
          transition: 'opacity 0.8s ease',
          zIndex: 2,
          background: '#000',
        }}
      >
        {selected && (
          <video
            ref={videoRef}
            key={selected.id}
            src={selected.videoSrc}
            loop
            muted
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}

        {/* Homesite name overlay on video */}
        {selected && (
          <div
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              padding: 'clamp(20px, 4vh, 60px) clamp(24px, 5vw, 80px)',
              background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
              display: 'flex',
              alignItems: 'flex-end',
              gap: '32px',
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: 'clamp(0.6rem, 1vw, 0.9rem)',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                marginBottom: '4px',
              }}>
                TRAILHEAD
              </div>
              <div style={{
                color: selected.color,
                fontWeight: 900,
                fontSize: 'clamp(2rem, 5vw, 4.5rem)',
                lineHeight: 1,
                textShadow: `0 0 30px ${selected.color}88`,
              }}>
                {selected.label}
              </div>
              <div style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: 'clamp(0.8rem, 1.5vw, 1.2rem)',
                marginTop: '8px',
                maxWidth: '600px',
              }}>
                {selected.description}
              </div>
            </div>

            {/* Key stats */}
            <div style={{ display: 'flex', gap: 'clamp(16px, 3vw, 40px)', alignItems: 'flex-end' }}>
              {[
                { k: 'PRICE', v: selected.price },
                { k: 'SQ FT', v: selected.sqft },
                { k: 'BEDS', v: selected.beds },
              ].map(({ k, v }) => (
                <div key={k} style={{ textAlign: 'center' }}>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 'clamp(0.5rem, 0.8vw, 0.75rem)', letterSpacing: '0.15em' }}>
                    {k}
                  </div>
                  <div style={{ color: 'white', fontWeight: 800, fontSize: 'clamp(1.2rem, 2.5vw, 2rem)' }}>
                    {v}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top logo watermark */}
        <div
          style={{
            position: 'absolute', top: 'clamp(16px, 3vh, 40px)', left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}
        >
          <svg width="32" height="32" viewBox="0 0 64 64">
            <polygon points="32,4 60,56 4,56" fill="none" stroke="#c9a84c" strokeWidth="3" />
            <circle cx="32" cy="38" r="6" fill="#c9a84c" />
          </svg>
          <span style={{ color: 'white', fontWeight: 900, fontSize: 'clamp(1rem, 2vw, 1.5rem)', letterSpacing: '0.2em' }}>
            TRAILHEAD
          </span>
        </div>
      </div>

      {/* Transition flash */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: selected ? `${selected.color}22` : 'rgba(255,255,255,0.05)',
          opacity: phase === 'transition-in' ? 1 : 0,
          transition: phase === 'transition-in' ? 'opacity 0.1s ease' : 'opacity 0.7s ease',
          zIndex: 3,
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
