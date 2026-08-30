'use client'

import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      borderBottom: '1px solid var(--border)',
    }} className="glass">
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link href="/" style={{
          fontSize: '20px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <span style={{
            background: 'var(--accent)',
            color: 'white',
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: 800,
          }}>C</span>
          <span className="nav-brand-text">CollegeFinder</span>
        </Link>

        {/* Desktop Nav */}
        <div className="nav-desktop" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '32px',
        }}>
          <Link href="/colleges" style={{
            color: 'var(--text-muted)',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 500,
            transition: 'color 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            Colleges
          </Link>

          <Link href="/compare" style={{
            color: 'var(--text-muted)',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 500,
            transition: 'color 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            Compare
          </Link>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Link href="/saved" style={{
                color: 'var(--text-muted)',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 500,
              }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                Saved
              </Link>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  fontSize: '14px',
                  color: 'var(--text-muted)',
                }}>
                  {user.name.split(' ')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--border)',
                    color: 'var(--text-muted)',
                    padding: '6px 16px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--accent)'
                    e.currentTarget.style.color = 'var(--accent)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.color = 'var(--text-muted)'
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link href="/login" style={{
                color: 'var(--text-muted)',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 500,
                padding: '6px 16px',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--accent)'
                  e.currentTarget.style.color = 'var(--accent)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.color = 'var(--text-muted)'
                }}
              >
                Login
              </Link>
              <Link href="/register" style={{
                background: 'var(--accent)',
                color: 'white',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 500,
                padding: '6px 16px',
                borderRadius: '6px',
                transition: 'opacity 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        <button
          type="button"
          className="nav-hamburger"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen(o => !o)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {menuOpen && (
        <div className="nav-mobile-panel">
          <Link href="/colleges" onClick={() => setMenuOpen(false)} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '15px', padding: '10px 0' }}>
            Colleges
          </Link>
          <Link href="/compare" onClick={() => setMenuOpen(false)} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '15px', padding: '10px 0' }}>
            Compare
          </Link>
          {user ? (
            <>
              <Link href="/saved" onClick={() => setMenuOpen(false)} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '15px', padding: '10px 0' }}>
                Saved
              </Link>
              <button
                onClick={() => { setMenuOpen(false); handleLogout() }}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  color: 'var(--text-muted)',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: 'fit-content',
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '12px', padding: '8px 0 4px' }}>
              <Link href="/login" onClick={() => setMenuOpen(false)} style={{
                color: 'var(--text-muted)',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 500,
                padding: '8px 16px',
                border: '1px solid var(--border)',
                borderRadius: '6px',
              }}>
                Login
              </Link>
              <Link href="/register" onClick={() => setMenuOpen(false)} style={{
                background: 'var(--accent)',
                color: 'white',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 500,
                padding: '8px 16px',
                borderRadius: '6px',
              }}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}