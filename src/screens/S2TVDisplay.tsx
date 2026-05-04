import React, { useEffect, useRef, useState } from 'react'
import LandscapeMap from '../components/LandscapeMap'
import { homesites, Homesite } from '../data/homesites'
import { useSocket } from '../hooks/useSocket'

export default function S2TVDisplay() {
  const { connected, selectedId } = useSocket('s2')
  const selected = homesites.find(h => h.id === selectedId) ?? null
  const prevSelectedRef = useRef<string | null>(null)
  const [animating, setAnimating] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [scale, setScale] = useState(1)

  // Trigger 3D rotation animation when selection changes
  useEffect(() => {
    if (selectedId && selectedId !== prevSelectedRef.current) {
      setAnimating(true)
      setRotation(0)
      setScale(1)

      // Keyframe animation via RAF
      const start = performance.now()
      const duration = 1200

      function animate(now: number) {
        const t = Math.min((now - start) / duration, 1)
        // Ease in-out cubic
        const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
        setRotation(ease * 360)
        setScale(1 + Math.sin(t * Math.PI) * 0.35)
        if (t < 1) requestAnimationFrame(animate)
        else {
          setRotation(0)
          setScale(1.15)
          setAnimating(false)
        }
      }
      requestAnimationFrame(animate)
    }
    if (!selectedId) {
      setScale(1)
      setRotation(0)
    }
    prevSelectedRef.current = selectedId
  }, [selectedId])

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        background: '#060f0c',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Top bar */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 32px',
          background: 'rgba(0,0,0,0.6)',
          borderBottom: '1px solid rgba(0,212,170,0.15)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <svg width="36" height="36" viewBox="0 0 64 64">
            <polygon points="32,4 60,56 4,56" fill="none" stroke="#c9a84c" strokeWidth="3" />
            <polygon points="32,16 50,48 14,48" fill="rgba(201,168,76,0.15)" stroke="#c9a84c" strokeWidth="1.5" />
            <circle cx="32" cy="36" r="6" fill="#c9a84c" />
          </svg>
          <span style={{ color: 'white', fontWeight: 900, fontSize: '1.6rem', letterSpacing: '0.18em' }}>
            TRAILHEAD
          </span>
        </div>

        {/* Status / selected label */}
        <div style={{ textAlign: 'right' }}>
          {selected ? (
            <div>
              <div style={{ color: selected.color, fontWeight: 800, fontSize: '1.2rem', letterSpacing: '0.05em' }}>
                {selected.label}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
                {selected.price} · {selected.sqft} sq ft
              </div>
            </div>
          ) : (
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem', letterSpacing: '0.1em' }}>
              SELECT A HOMESITE
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%',
              background: connected ? '#a8ff3e' : '#ff4444',
              boxShadow: connected ? '0 0 10px #a8ff3e' : '0 0 10px #ff4444',
            }}
          />
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
            {connected ? 'LIVE' : 'OFFLINE'}
          </span>
        </div>
      </header>

      {/* Map — full screen, read-only, houses animate */}
      <div style={{ flex: 1, position: 'relative' }}>
        <LandscapeMap
          selectedId={selectedId}
          interactive={false}
          showLabels
        />

        {/* Animated 3D house overlay for selected homesite */}
        {selected && (() => {
          const pts = selected.points.split(' ').map(p => p.split(',').map(Number))
          const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length
          const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length
          // Convert SVG coords (0-640 x 0-480) to viewport percentage
          const xPct = (cx / 640) * 100
          const yPct = (cy / 480) * 100
          return (
            <div
              style={{
                position: 'absolute',
                left: `${xPct}%`,
                top: `${yPct}%`,
                transform: `translate(-50%, -50%) scale(${scale}) rotateY(${rotation}deg)`,
                transformStyle: 'preserve-3d',
                transition: animating ? 'none' : 'transform 0.5s ease',
                pointerEvents: 'none',
                zIndex: 20,
              }}
            >
              <svg width="60" height="60" viewBox="0 0 60 60" style={{ filter: `drop-shadow(0 0 16px ${selected.color})` }}>
                {/* House body */}
                <rect x="10" y="28" width="40" height="26" rx="2" fill={selected.color} opacity="0.9" />
                {/* Roof */}
                <polygon points="30,6 6,28 54,28" fill={selected.color} />
                {/* Door */}
                <rect x="24" y="40" width="12" height="14" rx="1" fill="rgba(0,0,0,0.4)" />
                {/* Windows */}
                <rect x="13" y="33" width="9" height="8" rx="1" fill="rgba(0,0,0,0.3)" />
                <rect x="38" y="33" width="9" height="8" rx="1" fill="rgba(0,0,0,0.3)" />
                {/* Chimney */}
                <rect x="38" y="12" width="7" height="14" fill={selected.color} />
                {/* Glow ring */}
                <circle cx="30" cy="38" r="26" fill="none" stroke={selected.color} strokeWidth="1.5" opacity="0.4" />
              </svg>
            </div>
          )
        })()}

        {/* Bottom info strip */}
        {selected && (
          <div
            style={{
              position: 'absolute',
              bottom: 0, left: 0, right: 0,
              padding: '16px 32px',
              background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
              display: 'flex',
              gap: '40px',
              alignItems: 'flex-end',
            }}
          >
            <div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', letterSpacing: '0.12em' }}>HOMESITE</div>
              <div style={{ color: selected.color, fontWeight: 800, fontSize: '1.8rem', lineHeight: 1 }}>{selected.label}</div>
            </div>
            {[
              { k: 'PRICE', v: selected.price },
              { k: 'SQ FT', v: selected.sqft },
              { k: 'BEDS', v: selected.beds },
              { k: 'BATHS', v: selected.baths },
            ].map(({ k, v }) => (
              <div key={k}>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.6rem', letterSpacing: '0.12em' }}>{k}</div>
                <div style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>{v}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
