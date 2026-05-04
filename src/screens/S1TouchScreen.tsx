import React, { useState } from 'react'
import LandscapeMap from '../components/LandscapeMap'
import { homesites } from '../data/homesites'
import { useSocket } from '../hooks/useSocket'
import { useFullscreen } from '../hooks/useFullscreen'

export default function S1TouchScreen() {
  const { connected, selectedId, emitSelection } = useSocket('s1')
  useFullscreen()
  const selected = homesites.find(h => h.id === selectedId) ?? null

  function handleSelect(id: string) {
    // Toggle off if already selected
    emitSelection(selectedId === id ? null : id)
  }

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        background: '#0d1f1a',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
          background: 'rgba(0,0,0,0.5)',
          borderBottom: '1px solid rgba(0,212,170,0.2)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="28" height="28" viewBox="0 0 64 64">
            <polygon points="32,4 60,56 4,56" fill="none" stroke="#c9a84c" strokeWidth="3" />
            <circle cx="32" cy="38" r="6" fill="#c9a84c" />
          </svg>
          <span style={{ color: 'white', fontWeight: 900, fontSize: '1.1rem', letterSpacing: '0.15em' }}>
            TRAILHEAD
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span
            style={{
              display: 'inline-block',
              width: '8px', height: '8px', borderRadius: '50%',
              background: connected ? '#a8ff3e' : '#ff4444',
              boxShadow: connected ? '0 0 8px #a8ff3e' : '0 0 8px #ff4444',
            }}
          />
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>
            {connected ? 'LIVE' : 'OFFLINE'}
          </span>
        </div>
      </header>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
        {/* Map */}
        <div style={{ flex: selected ? '0 0 55%' : '1 1 0', minHeight: 0, transition: 'flex 0.4s ease', position: 'relative', overflow: 'hidden' }}>
          <LandscapeMap
            selectedId={selectedId}
            onSelect={handleSelect}
            interactive
            showLabels
          />
          {/* Tap hint */}
          {!selectedId && (
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(0,0,0,0.6)',
                color: 'rgba(255,255,255,0.6)',
                fontSize: '0.7rem',
                padding: '6px 14px',
                borderRadius: '20px',
                border: '1px solid rgba(0,212,170,0.3)',
                letterSpacing: '0.1em',
                pointerEvents: 'none',
              }}
            >
              TAP A HOMESITE TO SELECT
            </div>
          )}
        </div>

        {/* Info panel */}
        {selected && (
          <div
            style={{
              flex: '0 0 45%',
              overflow: 'auto',
              padding: '16px',
              background: 'rgba(0,0,0,0.4)',
            }}
          >
            <div className="info-panel" style={{ background: `linear-gradient(135deg, ${selected.color}ee, ${selected.color}bb)` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: '#1a2600' }}>
                  {selected.label}
                </h2>
                <button
                  onClick={() => emitSelection(null)}
                  style={{
                    background: 'rgba(0,0,0,0.2)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    cursor: 'pointer',
                    color: '#1a2600',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  ✕
                </button>
              </div>

              <p style={{ margin: '0 0 12px', fontSize: '0.8rem', color: '#2a3800', lineHeight: 1.5 }}>
                {selected.description}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                {[
                  { label: 'SQ FT', value: selected.sqft },
                  { label: 'BEDS', value: selected.beds },
                  { label: 'BATHS', value: selected.baths },
                  { label: 'PRICE', value: selected.price },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    style={{
                      background: 'rgba(0,0,0,0.15)',
                      borderRadius: '8px',
                      padding: '8px',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#1a2600', letterSpacing: '0.1em' }}>{label}</div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0d1a00' }}>{value}</div>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: '0.65rem', color: '#2a3800', textAlign: 'center', opacity: 0.7 }}>
                Showing on TV &amp; LED Wall →
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom nav — homesites quick list */}
      <nav
        style={{
          display: 'flex',
          gap: '6px',
          padding: '10px 12px',
          overflowX: 'auto',
          background: 'rgba(0,0,0,0.6)',
          borderTop: '1px solid rgba(0,212,170,0.15)',
          flexShrink: 0,
        }}
      >
        {homesites.map(hs => (
          <button
            key={hs.id}
            onClick={() => handleSelect(hs.id)}
            style={{
              flexShrink: 0,
              padding: '6px 12px',
              borderRadius: '20px',
              border: `1.5px solid ${selectedId === hs.id ? hs.color : 'rgba(255,255,255,0.15)'}`,
              background: selectedId === hs.id ? `${hs.color}22` : 'transparent',
              color: selectedId === hs.id ? hs.color : 'rgba(255,255,255,0.5)',
              fontSize: '0.7rem',
              fontWeight: selectedId === hs.id ? 700 : 400,
              cursor: 'pointer',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
          >
            {hs.label}
          </button>
        ))}
      </nav>
    </div>
  )
}
