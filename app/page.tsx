'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from './components/Navbar'
import IndiaMap from './components/IndiaMap'

export default function HomePage() {
  const [search, setSearch] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      router.push(`/colleges?search=${encodeURIComponent(search.trim())}`)
    } else {
      router.push('/colleges')
    }
  }

  const stats = [
    { label: 'Colleges', value: '1,000+' },
    { label: 'States', value: '28' },
    { label: 'Courses', value: '500+' },
    { label: 'Students Helped', value: '50K+' },
  ]

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        paddingTop: '64px',
      }}>
        {/* Map Background */}
        <div style={{
          position: 'absolute',
          right: '-5%',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '60%',
          height: '90vh',
          opacity: 0.6,
        }}>
          <IndiaMap />
        </div>

        {/* Gradient overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, var(--bg-primary) 45%, transparent 80%)',
          pointerEvents: 'none',
        }} />

        {/* Hero Content */}
        <div style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          width: '100%',
        }}>
          <div style={{ maxWidth: '580px' }}>
            {/* Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '100px',
              padding: '6px 14px',
              marginBottom: '24px',
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--accent)',
                animation: 'pulse 2s infinite',
              }} />
              <span style={{ fontSize: '12px', color: 'var(--accent-light)', fontWeight: 500 }}>
                India&apos;s College Discovery Platform
              </span>
            </div>

            {/* Headline */}
            <h1 style={{
              fontSize: 'clamp(36px, 5vw, 64px)',
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: '20px',
              letterSpacing: '-0.02em',
            }}>
              Find Your{' '}
              <span style={{
                background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Perfect College
              </span>
              <br />across India
            </h1>

            <p style={{
              fontSize: '16px',
              color: 'var(--text-muted)',
              marginBottom: '36px',
              lineHeight: 1.7,
              maxWidth: '460px',
            }}>
              Search, compare, and discover colleges across India.
              Filter by location, fees, and ratings to make the right decision.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch}>
              <div style={{
                display: 'flex',
                gap: '0',
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '6px',
                marginBottom: '16px',
              }}>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search colleges, cities, courses..."
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '15px',
                    padding: '12px 16px',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: 'var(--accent)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 28px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'opacity 0.2s',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  Search →
                </button>
              </div>
            </form>

            {/* Quick filters */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['IIT', 'Delhi', 'Mumbai', 'Bangalore', 'Under ₹2L'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => router.push(`/colleges?search=${tag}`)}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-muted)',
                    padding: '6px 14px',
                    borderRadius: '100px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--accent)'
                    e.currentTarget.style.color = 'var(--accent-light)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.color = 'var(--text-muted)'
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{
        borderTop: '1px solid var(--border)',
        padding: '48px 24px',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '24px',
        }}>
          {stats.map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '32px',
                fontWeight: 800,
                color: 'var(--accent-light)',
                marginBottom: '4px',
              }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </main>
  )
}