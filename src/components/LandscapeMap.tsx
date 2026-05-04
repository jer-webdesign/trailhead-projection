import React from 'react'
import { homesites } from '../data/homesites'

interface LandscapeMapProps {
  selectedId: string | null
  onSelect?: (id: string) => void
  showLabels?: boolean
  interactive?: boolean
  className?: string
}

export default function LandscapeMap({
  selectedId,
  onSelect,
  showLabels = true,
  interactive = true,
  className = '',
}: LandscapeMapProps) {
  return (
    <div className={`map-container ${className}`} style={{ width: '100%', height: '100%' }}>
      <svg
        viewBox="0 0 640 480"
        preserveAspectRatio="xMidYMid meet"
        style={{ width: '100%', height: '100%' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="mapBg" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#1e4a38" />
            <stop offset="50%" stopColor="#133022" />
            <stop offset="100%" stopColor="#071810" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="strongGlow">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,212,170,0.08)" strokeWidth="0.5" />
          </pattern>
        </defs>

        {/* Background */}
        <rect width="640" height="480" fill="url(#mapBg)" />
        <rect width="640" height="480" fill="url(#grid)" />

        {/* Terrain contour lines */}
        <g className="contour-overlay" opacity="0.18">
          <ellipse cx="320" cy="240" rx="280" ry="200" fill="none" stroke="#00d4aa" strokeWidth="1" />
          <ellipse cx="320" cy="240" rx="230" ry="165" fill="none" stroke="#00d4aa" strokeWidth="0.8" />
          <ellipse cx="320" cy="240" rx="180" ry="130" fill="none" stroke="#00d4aa" strokeWidth="0.8" />
          <ellipse cx="320" cy="240" rx="130" ry="95" fill="none" stroke="#00d4aa" strokeWidth="0.6" />
          <ellipse cx="320" cy="240" rx="80" ry="60" fill="none" stroke="#00d4aa" strokeWidth="0.6" />
          {/* Creek/path */}
          <path
            d="M 50 300 Q 120 280 180 320 Q 240 360 320 350 Q 400 340 460 300 Q 520 265 590 280"
            fill="none" stroke="#00aacc" strokeWidth="3" opacity="0.4"
          />
          {/* Forest areas */}
          <circle cx="80" cy="150" r="45" fill="rgba(0,80,40,0.3)" />
          <circle cx="560" cy="160" r="55" fill="rgba(0,80,40,0.3)" />
          <circle cx="100" cy="380" r="35" fill="rgba(0,80,40,0.25)" />
          <circle cx="550" cy="390" r="40" fill="rgba(0,80,40,0.25)" />
        </g>

        {/* Roads / paths */}
        <g opacity="0.5">
          <path d="M 320 460 L 320 380 L 280 340 L 180 310 L 100 290" fill="none" stroke="#c9a84c" strokeWidth="2" strokeDasharray="6,3" />
          <path d="M 320 380 L 360 340 L 460 290 L 560 270" fill="none" stroke="#c9a84c" strokeWidth="2" strokeDasharray="6,3" />
          <path d="M 320 380 L 310 310 L 280 240 L 300 170" fill="none" stroke="#c9a84c" strokeWidth="1.5" strokeDasharray="4,3" />
        </g>

        {/* Homesite polygons */}
        {homesites.map((hs) => {
          const isSelected = selectedId === hs.id
          return (
            <g key={hs.id}>
              <polygon
                points={hs.points}
                className={`homesite-polygon ${isSelected ? 'selected' : ''}`}
                onClick={() => interactive && onSelect?.(hs.id)}
                style={{
                  cursor: interactive ? 'pointer' : 'default',
                  fill: isSelected ? `${hs.color}55` : 'rgba(0,212,170,0.12)',
                  stroke: isSelected ? hs.color : 'rgba(0,212,170,0.5)',
                  strokeWidth: isSelected ? 3 : 1.5,
                  filter: isSelected ? `drop-shadow(0 0 12px ${hs.color}99)` : 'none',
                  transition: 'all 0.3s ease',
                }}
              />
              {/* House icon */}
              {(() => {
                const pts = hs.points.split(' ').map(p => p.split(',').map(Number))
                const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length
                const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length
                return (
                  <g
                    transform={`translate(${cx}, ${cy})`}
                    style={{
                      transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',
                    }}
                  >
                    {/* Simple house shape */}
                    <rect x="-8" y="-4" width="16" height="12" fill={isSelected ? hs.color : '#00d4aa'} opacity={isSelected ? 0.9 : 0.5} />
                    <polygon points="0,-12 -10,-4 10,-4" fill={isSelected ? hs.color : '#00d4aa'} opacity={isSelected ? 0.9 : 0.5} />
                    {isSelected && (
                      <circle r="18" fill="none" stroke={hs.color} strokeWidth="1.5" opacity="0.6">
                        <animate attributeName="r" values="16;22;16" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2s" repeatCount="indefinite" />
                      </circle>
                    )}
                  </g>
                )
              })()}
              {/* Label */}
              {showLabels && (() => {
                const pts = hs.points.split(' ').map(p => p.split(',').map(Number))
                const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length
                const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length
                return (
                  <text
                    x={cx}
                    y={cy + 26}
                    textAnchor="middle"
                    fontSize="9"
                    fill={isSelected ? hs.color : 'rgba(255,255,255,0.7)'}
                    fontWeight={isSelected ? '700' : '400'}
                    style={{ pointerEvents: 'none', textShadow: '0 1px 3px #000' }}
                  >
                    {hs.label}
                  </text>
                )
              })()}
            </g>
          )
        })}

        {/* Legend */}
        <g transform="translate(12, 430)">
          <rect width="120" height="36" rx="4" fill="rgba(0,0,0,0.5)" />
          <rect x="8" y="8" width="10" height="10" fill="rgba(0,212,170,0.3)" stroke="#00d4aa" strokeWidth="1" />
          <text x="24" y="17" fontSize="8" fill="rgba(255,255,255,0.7)">Available</text>
          <rect x="8" y="22" width="10" height="10" fill="rgba(168,255,62,0.4)" stroke="#a8ff3e" strokeWidth="1" />
          <text x="24" y="31" fontSize="8" fill="rgba(255,255,255,0.7)">Selected</text>
        </g>

        {/* Compass */}
        <g transform="translate(600, 440)">
          <circle r="18" fill="rgba(0,0,0,0.5)" stroke="rgba(201,168,76,0.5)" strokeWidth="1" />
          <text textAnchor="middle" y="-6" fontSize="8" fill="#c9a84c" fontWeight="700">N</text>
          <path d="M 0,-14 L 3,-2 L 0,2 L -3,-2 Z" fill="#c9a84c" />
          <path d="M 0,14 L 3,2 L 0,-2 L -3,2 Z" fill="rgba(255,255,255,0.3)" />
        </g>
      </svg>
    </div>
  )
}
