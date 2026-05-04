import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white p-8">
      <div className="mb-10 text-center">
        {/* Trailhead logo mark */}
        <svg width="64" height="64" viewBox="0 0 64 64" className="mx-auto mb-4">
          <polygon points="32,4 60,56 4,56" fill="none" stroke="#c9a84c" strokeWidth="3" />
          <polygon points="32,16 50,48 14,48" fill="rgba(201,168,76,0.15)" stroke="#c9a84c" strokeWidth="1.5" />
          <circle cx="32" cy="36" r="6" fill="#c9a84c" />
        </svg>
        <h1 className="trailhead-logo text-4xl tracking-widest">TRAILHEAD</h1>
        <p className="mt-2 text-gray-400 text-sm tracking-widest uppercase">Interactive Projection System</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
        <Link to="/s1" className="group block rounded-xl border border-[#00d4aa44] bg-[#0d1f1a] hover:bg-[#1a3a2e] transition-all p-6 text-center">
          <div className="text-3xl mb-3">📱</div>
          <h2 className="text-lg font-bold text-[#00d4aa] mb-1">S1 — Touch Screen</h2>
          <p className="text-xs text-gray-400">iPad / Tablet<br />Interactive map selector</p>
        </Link>
        <Link to="/s2" className="group block rounded-xl border border-[#a8ff3e44] bg-[#111a00] hover:bg-[#1e3000] transition-all p-6 text-center">
          <div className="text-3xl mb-3">🖥️</div>
          <h2 className="text-lg font-bold text-[#a8ff3e] mb-1">S2 — 75" TV</h2>
          <p className="text-xs text-gray-400">LED Table Display<br />Animated landscape map</p>
        </Link>
        <Link to="/s3" className="group block rounded-xl border border-[#ffb80044] bg-[#1a1200] hover:bg-[#2a1e00] transition-all p-6 text-center">
          <div className="text-3xl mb-3">📽️</div>
          <h2 className="text-lg font-bold text-[#ffb800] mb-1">S3 — LED Wall</h2>
          <p className="text-xs text-gray-400">200" Projector Screen<br />Full-screen video display</p>
        </Link>
      </div>

      <div className="mt-10 text-center text-gray-600 text-xs">
        <p>WebSocket server required on port 3001 &bull; OBS Python controller for scene switching</p>
      </div>
    </div>
  )
}
