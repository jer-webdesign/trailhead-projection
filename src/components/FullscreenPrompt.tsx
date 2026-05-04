import React from 'react'
import { useFullscreen } from '../hooks/useFullscreen'

interface FullscreenPromptProps {
  /** accent color matching the screen */
  color?: string
}

export default function FullscreenPrompt({ color = '#00d4aa' }: FullscreenPromptProps) {
  const { isFullscreen, enter } = useFullscreen()

  if (isFullscreen) return null

  return (
    <div
      onClick={enter}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.92)',
        cursor: 'pointer',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      {/* Animated expand icon */}
      <svg
        width="72"
        height="72"
        viewBox="0 0 72 72"
        style={{ marginBottom: '24px', opacity: 0.9 }}
      >
        {/* Four corner arrows */}
        <polyline points="4,20 4,4 20,4" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
        </polyline>
        <polyline points="52,4 68,4 68,20" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="0.5s" repeatCount="indefinite" />
        </polyline>
        <polyline points="68,52 68,68 52,68" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="1s" repeatCount="indefinite" />
        </polyline>
        <polyline points="20,68 4,68 4,52" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="1.5s" repeatCount="indefinite" />
        </polyline>
        {/* Center dot */}
        <circle cx="36" cy="36" r="4" fill={color} opacity="0.7" />
      </svg>

      <div style={{ color: 'white', fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '8px' }}>
        TAP TO ENTER FULLSCREEN
      </div>
      <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', letterSpacing: '0.08em' }}>
        Tap anywhere to continue
      </div>
    </div>
  )
}
