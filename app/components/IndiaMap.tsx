'use client'

import { useState } from 'react'

const states = [
  { id: 'delhi', name: 'Delhi', colleges: 45, d: 'M 380 198 L 388 192 L 396 198 L 392 210 L 382 208 Z' },
  { id: 'maharashtra', name: 'Maharashtra', colleges: 87, d: 'M 280 340 L 340 320 L 380 340 L 370 400 L 310 420 L 270 390 Z' },
  { id: 'tamilnadu', name: 'Tamil Nadu', colleges: 63, d: 'M 340 480 L 380 460 L 400 500 L 390 560 L 350 570 L 320 530 Z' },
  { id: 'karnataka', name: 'Karnataka', colleges: 71, d: 'M 290 430 L 350 410 L 380 440 L 360 490 L 300 500 L 270 470 Z' },
  { id: 'rajasthan', name: 'Rajasthan', colleges: 52, d: 'M 240 180 L 340 160 L 370 200 L 350 270 L 270 290 L 220 250 Z' },
  { id: 'up', name: 'Uttar Pradesh', colleges: 94, d: 'M 380 200 L 480 185 L 500 230 L 470 280 L 390 275 L 360 240 Z' },
  { id: 'wb', name: 'West Bengal', colleges: 58, d: 'M 500 250 L 540 240 L 555 290 L 530 340 L 495 320 L 485 275 Z' },
  { id: 'gujarat', name: 'Gujarat', colleges: 61, d: 'M 180 270 L 250 250 L 270 300 L 240 360 L 190 350 L 165 310 Z' },
  { id: 'mp', name: 'Madhya Pradesh', colleges: 48, d: 'M 290 260 L 400 245 L 420 300 L 390 350 L 300 360 L 265 315 Z' },
  { id: 'telangana', name: 'Telangana', colleges: 55, d: 'M 340 380 L 410 365 L 425 415 L 390 445 L 330 435 L 315 405 Z' },
]

export default function IndiaMap() {
  const [hoveredState, setHoveredState] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState({ x: 0, y: 0, state: '', colleges: 0 })

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg
        viewBox="0 0 700 650"
        style={{ width: '100%', height: '100%', opacity: 0.85 }}
      >
        <defs>
          <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <ellipse cx="350" cy="350" rx="300" ry="280" fill="url(#mapGlow)" />

        {states.map((state) => (
          <path
            key={state.id}
            d={state.d}
            fill={hoveredState === state.id ? '#6366f1' : '#1e293b'}
            stroke={hoveredState === state.id ? '#818cf8' : '#334155'}
            strokeWidth={hoveredState === state.id ? 2 : 1}
            style={{
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              filter: hoveredState === state.id ? 'url(#glow)' : 'none',
            }}
            onMouseEnter={(e) => {
              setHoveredState(state.id)
              const rect = e.currentTarget.getBoundingClientRect()
              setTooltip({
                x: rect.left + rect.width / 2,
                y: rect.top - 10,
                state: state.name,
                colleges: state.colleges,
              })
            }}
            onMouseLeave={() => setHoveredState(null)}
          />
        ))}
      </svg>

      {hoveredState && (
        <div style={{
          position: 'fixed',
          left: tooltip.x,
          top: tooltip.y,
          transform: 'translate(-50%, -100%)',
          background: 'rgba(30, 41, 59, 0.95)',
          border: '1px solid var(--accent)',
          borderRadius: '8px',
          padding: '8px 14px',
          pointerEvents: 'none',
          zIndex: 100,
          backdropFilter: 'blur(8px)',
        }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
            {tooltip.state}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--accent-light)' }}>
            {tooltip.colleges} colleges
          </div>
        </div>
      )}
    </div>
  )
}