'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Navbar from '../components/Navbar'
import Link from 'next/link'

interface College {
  id: string
  name: string
  location: string
  state: string
  fees: number
  rating: number
  description: string
  imageUrl: string | null
}

interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

export default function CollegesPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [colleges, setColleges] = useState<College[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Filter state
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [state, setState] = useState(searchParams.get('state') || '')
  const [maxFees, setMaxFees] = useState(searchParams.get('maxFees') || '')
  const [minRating, setMinRating] = useState(searchParams.get('minRating') || '')
  const [page, setPage] = useState(1)

  const fetchColleges = useCallback(async () => {
    setLoading(true)
    setError('')

    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (state) params.set('state', state)
    if (maxFees) params.set('maxFees', maxFees)
    if (minRating) params.set('minRating', minRating)
    params.set('page', page.toString())
    params.set('limit', '9')

    try {
      const res = await fetch(`/api/colleges?${params.toString()}`)
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Failed to fetch')

      setColleges(data.colleges)
      setPagination(data.pagination)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [search, state, maxFees, minRating, page])

  useEffect(() => {
    fetchColleges()
  }, [fetchColleges])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchColleges()
  }

  const clearFilters = () => {
    setSearch('')
    setState('')
    setMaxFees('')
    setMinRating('')
    setPage(1)
  }

  const indianStates = [
    'Andhra Pradesh', 'Delhi', 'Gujarat', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Punjab',
    'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh',
    'West Bengal'
  ]

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '96px 24px 48px',
      }}>

        {/* Page header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 800,
            color: '#f1f5f9',
            marginBottom: '8px',
            letterSpacing: '-0.02em',
          }}>
            Explore Colleges
          </h1>
          <p style={{ color: '#64748b', fontSize: '15px' }}>
            {pagination ? `${pagination.total} colleges found` : 'Searching...'}
          </p>
        </div>

        <div className="colleges-layout">

          {/* Filter Sidebar */}
          <aside className="colleges-sidebar" style={{
            background: '#1e293b',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #334155',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}>
              <span style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '15px' }}>Filters</span>
              <button
                onClick={clearFilters}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6366f1',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                Clear all
              </button>
            </div>

            <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Search */}
              <div>
                <label style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '8px' }}>
                  Search
                </label>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="College name or city..."
                  style={{
                    width: '100%',
                    background: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    color: '#f1f5f9',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* State */}
              <div>
                <label style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '8px' }}>
                  State
                </label>
                <select
                  value={state}
                  onChange={e => setState(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    color: state ? '#f1f5f9' : '#475569',
                    fontSize: '14px',
                    outline: 'none',
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="">All States</option>
                  {indianStates.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Max Fees */}
              <div>
                <label style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '8px' }}>
                  Max Fees (₹/year)
                </label>
                <select
                  value={maxFees}
                  onChange={e => setMaxFees(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    color: maxFees ? '#f1f5f9' : '#475569',
                    fontSize: '14px',
                    outline: 'none',
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="">Any</option>
                  <option value="100000">Under ₹1 Lakh</option>
                  <option value="200000">Under ₹2 Lakhs</option>
                  <option value="300000">Under ₹3 Lakhs</option>
                  <option value="500000">Under ₹5 Lakhs</option>
                </select>
              </div>

              {/* Min Rating */}
              <div>
                <label style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '8px' }}>
                  Minimum Rating
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {['4.5', '4.0', '3.5', '3.0'].map(r => (
                    <label key={r} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="rating"
                        value={r}
                        checked={minRating === r}
                        onChange={() => setMinRating(r)}
                        style={{ accentColor: '#6366f1' }}
                      />
                      <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                        {r}+ ⭐
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                Apply Filters
              </button>
            </form>
          </aside>

          {/* College Grid */}
          <div>
            {loading ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '20px',
              }}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} style={{
                    background: '#1e293b',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '1px solid #334155',
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }}>
                    <div style={{ height: '160px', background: '#334155' }} />
                    <div style={{ padding: '24px' }}>
                      <div style={{ height: '20px', background: '#334155', borderRadius: '6px', marginBottom: '12px' }} />
                      <div style={{ height: '14px', background: '#334155', borderRadius: '6px', width: '60%', marginBottom: '8px' }} />
                      <div style={{ height: '14px', background: '#334155', borderRadius: '6px', width: '40%' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div style={{
                textAlign: 'center',
                padding: '80px 24px',
                color: '#ef4444',
              }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>⚠️</div>
                <div style={{ fontWeight: 600, marginBottom: '8px' }}>{error}</div>
                <button
                  onClick={fetchColleges}
                  style={{
                    background: '#6366f1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    cursor: 'pointer',
                    marginTop: '12px',
                  }}
                >
                  Try Again
                </button>
              </div>
            ) : colleges.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '80px 24px',
                color: '#64748b',
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎓</div>
                <div style={{ fontSize: '18px', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>
                  No colleges found
                </div>
                <div style={{ fontSize: '14px' }}>Try adjusting your filters</div>
                <button
                  onClick={clearFilters}
                  style={{
                    background: '#6366f1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    cursor: 'pointer',
                    marginTop: '16px',
                    fontSize: '14px',
                  }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
                  gap: '20px',
                  marginBottom: '32px',
                }}>
                  {colleges.map((college) => (
                    <Link
                      key={college.id}
                      href={`/colleges/${college.id}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <div
                        style={{
                          background: '#1e293b',
                          borderRadius: '16px',
                          overflow: 'hidden',
                          border: '1px solid #334155',
                          cursor: 'pointer',
                          transition: 'all 0.25s ease',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = '#6366f1'
                          e.currentTarget.style.transform = 'translateY(-4px)'
                          e.currentTarget.style.boxShadow = '0 12px 40px rgba(99,102,241,0.15)'
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = '#334155'
                          e.currentTarget.style.transform = 'translateY(0)'
                          e.currentTarget.style.boxShadow = 'none'
                        }}
                      >
                        {college.imageUrl ? (
                          <img
                            src={college.imageUrl}
                            alt={college.name}
                            style={{
                              width: '100%',
                              height: '160px',
                              objectFit: 'cover',
                              borderRadius: '16px 16px 0 0',
                              display: 'block',
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              height: '160px',
                              borderRadius: '16px 16px 0 0',
                              background: 'linear-gradient(135deg, #312e81 0%, #6366f1 50%, #1e293b 100%)',
                            }}
                          />
                        )}

                        <div style={{ padding: '20px 24px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        {/* Rating badge */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                          <div style={{
                            background: 'rgba(99,102,241,0.15)',
                            border: '1px solid rgba(99,102,241,0.3)',
                            borderRadius: '8px',
                            padding: '4px 10px',
                            fontSize: '13px',
                            color: '#a5b4fc',
                            fontWeight: 600,
                          }}>
                            ⭐ {college.rating}
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: '#475569',
                            background: '#0f172a',
                            borderRadius: '6px',
                            padding: '4px 8px',
                          }}>
                            {college.state}
                          </div>
                        </div>

                        {/* Name */}
                        <h3 style={{
                          fontSize: '16px',
                          fontWeight: 700,
                          color: '#f1f5f9',
                          marginBottom: '6px',
                          lineHeight: 1.3,
                        }}>
                          {college.name}
                        </h3>

                        {/* Location */}
                        <div style={{
                          fontSize: '13px',
                          color: '#64748b',
                          marginBottom: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}>
                          📍 {college.location}
                        </div>

                        {/* Description */}
                        <p style={{
                          fontSize: '13px',
                          color: '#475569',
                          lineHeight: 1.6,
                          marginBottom: '16px',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}>
                          {college.description}
                        </p>

                        {/* Fees */}
                        <div style={{
                          borderTop: '1px solid #334155',
                          paddingTop: '14px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                          <div>
                            <div style={{ fontSize: '11px', color: '#475569', marginBottom: '2px' }}>Annual Fees</div>
                            <div style={{ fontSize: '15px', fontWeight: 700, color: '#34d399' }}>
                              ₹{college.fees.toLocaleString('en-IN')}
                            </div>
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: '#6366f1',
                            fontWeight: 600,
                          }}>
                            View Details →
                          </div>
                        </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="pagination-wrap">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      style={{
                        background: page === 1 ? '#1e293b' : '#334155',
                        color: page === 1 ? '#475569' : '#f1f5f9',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        cursor: page === 1 ? 'not-allowed' : 'pointer',
                        fontSize: '14px',
                      }}
                    >
                      ← Prev
                    </button>

                    {[...Array(pagination.totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        style={{
                          background: page === i + 1 ? '#6366f1' : '#1e293b',
                          color: page === i + 1 ? 'white' : '#94a3b8',
                          border: `1px solid ${page === i + 1 ? '#6366f1' : '#334155'}`,
                          borderRadius: '8px',
                          padding: '8px 14px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: page === i + 1 ? 600 : 400,
                        }}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                      disabled={page === pagination.totalPages}
                      style={{
                        background: page === pagination.totalPages ? '#1e293b' : '#334155',
                        color: page === pagination.totalPages ? '#475569' : '#f1f5f9',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        cursor: page === pagination.totalPages ? 'not-allowed' : 'pointer',
                        fontSize: '14px',
                      }}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

    </main>
  )
}