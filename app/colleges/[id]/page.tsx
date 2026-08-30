'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '../../components/Navbar'
import { useAuth } from '../../context/AuthContext'

interface Course {
  id: string
  name: string
  duration: string
  fees: number
}

interface Review {
  id: string
  rating: number
  comment: string
  createdAt: string
  user: { id: string; name: string }
}

interface College {
  id: string
  name: string
  location: string
  state: string
  fees: number
  rating: number
  description: string
  courses: Course[]
  reviews: Review[]
  _count: { savedBy: number }
}

export default function CollegeDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user, token } = useAuth()

  const [college, setCollege] = useState<College | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'reviews'>('overview')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  // Review form
  const [reviewComment, setReviewComment] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [submittingReview, setSubmittingReview] = useState(false)

  useEffect(() => {
    const fetchCollege = async () => {
      try {
        const res = await fetch(`/api/colleges/${id}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed to fetch')
        setCollege(data.college)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }
    fetchCollege()
  }, [id])

  const handleSave = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/saved', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ collegeId: id }),
      })
      const data = await res.json()

      if (res.status === 409) {
        setSaveMessage('Already saved')
        setSaved(true)
      } else if (res.ok) {
        setSaved(true)
        setSaveMessage('Saved!')
      } else {
        setSaveMessage(data.error || 'Failed to save')
      }
    } catch {
      setSaveMessage('Something went wrong')
    } finally {
      setSaving(false)
      setTimeout(() => setSaveMessage(''), 3000)
    }
  }

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      router.push('/login')
      return
    }

    if (!reviewComment.trim()) return

    setSubmittingReview(true)
    try {
      const res = await fetch(`/api/colleges/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ rating: reviewRating, comment: reviewComment }),
      })
      const data = await res.json()

      if (res.ok) {
        // Add review to local state
        setCollege(prev => prev ? {
          ...prev,
          reviews: [data.review, ...prev.reviews]
        } : prev)
        setReviewComment('')
        setReviewRating(5)
      }
    } catch {
      console.error('Failed to submit review')
    } finally {
      setSubmittingReview(false)
    }
  }

  if (loading) return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div style={{ color: '#64748b', fontSize: '16px' }}>Loading college details...</div>
      </div>
    </main>
  )

  if (error || !college) return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80vh', gap: '16px' }}>
        <div style={{ fontSize: '48px' }}>⚠️</div>
        <div style={{ color: '#ef4444', fontSize: '18px', fontWeight: 600 }}>{error || 'College not found'}</div>
        <button onClick={() => router.push('/colleges')} style={{
          background: '#6366f1', color: 'white', border: 'none',
          borderRadius: '8px', padding: '10px 20px', cursor: 'pointer'
        }}>
          Back to Colleges
        </button>
      </div>
    </main>
  )

  const tabs = ['overview', 'courses', 'reviews'] as const

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        borderBottom: '1px solid #334155',
        paddingTop: '80px',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
          <button
            onClick={() => router.back()}
            style={{
              background: 'none', border: 'none',
              color: '#64748b', cursor: 'pointer',
              fontSize: '14px', marginBottom: '20px',
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: 0,
            }}
          >
            ← Back
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h1 style={{
                fontSize: 'clamp(24px, 4vw, 40px)',
                fontWeight: 800,
                color: '#f1f5f9',
                letterSpacing: '-0.02em',
                marginBottom: '10px',
              }}>
                {college.name}
              </h1>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: '#64748b' }}>📍 {college.location}, {college.state}</span>
                <span style={{
                  background: 'rgba(99,102,241,0.15)',
                  border: '1px solid rgba(99,102,241,0.3)',
                  borderRadius: '8px',
                  padding: '3px 10px',
                  fontSize: '13px',
                  color: '#a5b4fc',
                  fontWeight: 600,
                }}>
                  ⭐ {college.rating} Rating
                </span>
                <span style={{ fontSize: '13px', color: '#475569' }}>
                  {college._count.savedBy} students saved this
                </span>
              </div>
            </div>

            {/* Save Button */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
              <button
                onClick={handleSave}
                disabled={saving || saved}
                style={{
                  background: saved ? 'rgba(52, 211, 153, 0.15)' : 'linear-gradient(135deg, #6366f1, #818cf8)',
                  color: saved ? '#34d399' : 'white',
                  border: saved ? '1px solid rgba(52,211,153,0.3)' : 'none',
                  borderRadius: '10px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: saving || saved ? 'default' : 'pointer',
                  transition: 'all 0.2s',
                  minWidth: '140px',
                }}
              >
                {saving ? 'Saving...' : saved ? '✓ Saved' : '+ Save College'}
              </button>
              {saveMessage && (
                <span style={{ fontSize: '12px', color: '#64748b' }}>{saveMessage}</span>
              )}
            </div>
          </div>

          {/* Key stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            marginTop: '32px',
            maxWidth: '500px',
          }}>
            {[
              { label: 'Annual Fees', value: `₹${college.fees.toLocaleString('en-IN')}` },
              { label: 'Courses', value: college.courses.length },
              { label: 'Reviews', value: college.reviews.length },
            ].map((stat) => (
              <div key={stat.label} style={{
                background: 'rgba(255,255,255,0.04)',
                borderRadius: '10px',
                padding: '14px 16px',
                border: '1px solid #334155',
              }}>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#f1f5f9', marginBottom: '4px' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid #1e293b', background: '#0f172a', position: 'sticky', top: '64px', zIndex: 10 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', gap: '0' }}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid #6366f1' : '2px solid transparent',
                color: activeTab === tab ? '#6366f1' : '#64748b',
                padding: '16px 24px',
                fontSize: '14px',
                fontWeight: activeTab === tab ? 600 : 400,
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.2s',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div style={{ maxWidth: '720px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#f1f5f9', marginBottom: '16px' }}>
              About {college.name}
            </h2>
            <p style={{ color: '#94a3b8', lineHeight: 1.8, fontSize: '15px' }}>
              {college.description}
            </p>

            <div style={{
              marginTop: '32px',
              background: '#1e293b',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #334155',
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9', marginBottom: '16px' }}>
                Quick Facts
              </h3>
              {[
                { label: 'Location', value: `${college.location}, ${college.state}` },
                { label: 'Annual Fees', value: `₹${college.fees.toLocaleString('en-IN')}` },
                { label: 'Rating', value: `${college.rating} / 5.0` },
                { label: 'Total Courses', value: college.courses.length },
                { label: 'Student Reviews', value: college.reviews.length },
              ].map((fact) => (
                <div key={fact.label} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  borderBottom: '1px solid #334155',
                }}>
                  <span style={{ fontSize: '14px', color: '#64748b' }}>{fact.label}</span>
                  <span style={{ fontSize: '14px', color: '#f1f5f9', fontWeight: 500 }}>{fact.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#f1f5f9', marginBottom: '20px' }}>
              Available Courses
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {college.courses.map((course) => (
                <div key={course.id} style={{
                  background: '#1e293b',
                  borderRadius: '14px',
                  padding: '20px',
                  border: '1px solid #334155',
                  transition: 'border-color 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#334155'}
                >
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f1f5f9', marginBottom: '8px' }}>
                    {course.name}
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>⏱ {course.duration}</span>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#34d399' }}>
                      ₹{course.fees.toLocaleString('en-IN')}/yr
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div style={{ maxWidth: '720px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#f1f5f9', marginBottom: '20px' }}>
              Student Reviews
            </h2>

            {/* Add Review Form */}
            {user ? (
              <form onSubmit={handleReviewSubmit} style={{
                background: '#1e293b',
                borderRadius: '14px',
                padding: '20px',
                border: '1px solid #334155',
                marginBottom: '24px',
              }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#f1f5f9', marginBottom: '14px' }}>
                  Write a Review
                </h3>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '22px',
                        cursor: 'pointer',
                        opacity: star <= reviewRating ? 1 : 0.3,
                        transition: 'opacity 0.15s',
                      }}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
                <textarea
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  placeholder="Share your experience..."
                  rows={3}
                  style={{
                    width: '100%',
                    background: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    padding: '12px',
                    color: '#f1f5f9',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                    marginBottom: '12px',
                    fontFamily: 'inherit',
                  }}
                />
                <button
                  type="submit"
                  disabled={submittingReview || !reviewComment.trim()}
                  style={{
                    background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: submittingReview ? 'wait' : 'pointer',
                    opacity: !reviewComment.trim() ? 0.5 : 1,
                  }}
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            ) : (
              <div style={{
                background: 'rgba(99,102,241,0.08)',
                border: '1px solid rgba(99,102,241,0.2)',
                borderRadius: '12px',
                padding: '16px 20px',
                marginBottom: '24px',
                fontSize: '14px',
                color: '#94a3b8',
              }}>
                <a href="/login" style={{ color: '#818cf8', fontWeight: 600 }}>Login</a> to write a review
              </div>
            )}

            {/* Reviews list */}
            {college.reviews.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px', color: '#475569' }}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>💬</div>
                <div>No reviews yet. Be the first to review!</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {college.reviews.map((review) => (
                  <div key={review.id} style={{
                    background: '#1e293b',
                    borderRadius: '14px',
                    padding: '20px',
                    border: '1px solid #334155',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '36px', height: '36px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '14px', fontWeight: 700, color: 'white',
                        }}>
                          {review.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: '#f1f5f9' }}>{review.user.name}</div>
                          <div style={{ fontSize: '12px', color: '#475569' }}>
                            {new Date(review.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                      </div>
                      <div style={{
                        background: 'rgba(99,102,241,0.15)',
                        borderRadius: '6px',
                        padding: '3px 8px',
                        fontSize: '13px',
                        color: '#a5b4fc',
                        fontWeight: 600,
                        alignSelf: 'flex-start',
                      }}>
                        ⭐ {review.rating}
                      </div>
                    </div>
                    <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.7 }}>{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}