
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import Link from 'next/link'

interface College {
  id: string
  name: string
  location: string
  state: string
  fees: number
  rating: number
  description: string
}

interface SavedCollege {
  id: string
  createdAt: string
  college: College
}

export default function SavedPage() {
  const { user, token, isLoading } = useAuth()
  const router = useRouter()
  const [savedColleges, setSavedColleges] = useState<SavedCollege[]>([])
  const [loading, setLoading] = useState(true)
  const [removing, setRemoving] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (!token) return
    const fetchSaved = async () => {
      try {
        const res = await fetch('/api/saved', {
          headers: { 'Authorization': 'Bearer ' + token }
        })
        const data = await res.json()
        if (res.ok) setSavedColleges(data.savedColleges)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchSaved()
  }, [token])

  const handleRemove = async (savedId: string) => {
    setRemoving(savedId)
    try {
      const res = await fetch('/api/saved/' + savedId, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token }
      })
      if (res.ok) {
        setSavedColleges(prev => prev.filter(s => s.id !== savedId))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setRemoving(null)
    }
  }

  if (isLoading || loading) {
    return (
      <main style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <Navbar />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <div style={{ color: '#64748b' }}>Loading...</div>
        </div>
      </main>
    )
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '96px 24px 48px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#f1f5f9', marginBottom: '8px' }}>
            Saved Colleges
          </h1>
          <p style={{ color: '#64748b', fontSize: '15px' }}>
            {savedColleges.length} {savedColleges.length !== 1 ? 'colleges' : 'college'} saved
          </p>
        </div>

        {savedColleges.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px', background: '#1e293b', borderRadius: '20px', border: '1px solid #334155' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎓</div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#94a3b8', marginBottom: '8px' }}>
              No saved colleges yet
            </div>
            <p style={{ color: '#475569', fontSize: '14px', marginBottom: '24px' }}>
              Browse colleges and save the ones you like
            </p>
            <Link href="/colleges" style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: 'white', textDecoration: 'none', borderRadius: '10px', padding: '12px 24px', fontSize: '14px', fontWeight: 600 }}>
              Browse Colleges
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))', gap: '20px' }}>
            {savedColleges.map((saved) => (
              <div key={saved.id} style={{ background: '#1e293b', borderRadius: '16px', padding: '24px', border: '1px solid #334155' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ background: 'rgba(99,102,241,0.15)', borderRadius: '8px', padding: '4px 10px', fontSize: '13px', color: '#a5b4fc', fontWeight: 600 }}>
                    ⭐ {saved.college.rating}
                  </div>
                  <button
                    onClick={() => handleRemove(saved.id)}
                    disabled={removing === saved.id}
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5', borderRadius: '8px', padding: '4px 10px', fontSize: '12px', cursor: 'pointer', fontWeight: 500 }}
                  >
                    {removing === saved.id ? 'Removing...' : 'Remove'}
                  </button>
                </div>
                <Link href={'/colleges/' + saved.college.id} style={{ textDecoration: 'none' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9', marginBottom: '6px' }}>
                    {saved.college.name}
                  </h3>
                </Link>
                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>
                  📍 {saved.college.location}, {saved.college.state}
                </div>
                <div style={{ borderTop: '1px solid #334155', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#475569', marginBottom: '2px' }}>Annual Fees</div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#34d399' }}>
                      ₹{saved.college.fees.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', color: '#475569' }}>
                    Saved {new Date(saved.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}


