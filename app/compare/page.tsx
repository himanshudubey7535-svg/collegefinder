'use client'

import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Link from 'next/link'

interface Course {
  id: string
  name: string
  duration: string
  fees: number
}

interface Review {
  id: string
  rating: number
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
}

export default function ComparePage() {
  const [allColleges, setAllColleges] = useState<{ id: string; name: string; location: string }[]>([])
  const [selected, setSelected] = useState<string[]>(['', '', ''])
  const [colleges, setColleges] = useState<(College | null)[]>([null, null, null])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchList = async () => {
      const res = await fetch('/api/colleges?limit=50')
      const data = await res.json()
      if (res.ok) setAllColleges(data.colleges)
    }
    fetchList()
  }, [])

  const handleSelect = async (index: number, collegeId: string) => {
    const newSelected = [...selected]
    newSelected[index] = collegeId
    setSelected(newSelected)

    if (!collegeId) {
      const newColleges = [...colleges]
      newColleges[index] = null
      setColleges(newColleges)
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/colleges/' + collegeId)
      const data = await res.json()
      if (res.ok) {
        const newColleges = [...colleges]
        newColleges[index] = data.college
        setColleges(newColleges)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const activeColleges = colleges.filter(Boolean) as College[]

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '96px 24px 48px' }}>

        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em', marginBottom: '8px' }}>
            Compare Colleges
          </h1>
          <p style={{ color: '#64748b', fontSize: '15px' }}>
            Select up to 3 colleges to compare side by side
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '40px' }}>
          {[0, 1, 2].map((index) => (
            <div key={index}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                College {index + 1}
              </label>
              <select
                value={selected[index]}
                onChange={e => handleSelect(index, e.target.value)}
                style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '12px 14px', color: selected[index] ? '#f1f5f9' : '#475569', fontSize: '14px', outline: 'none', cursor: 'pointer', boxSizing: 'border-box' }}
              >
                <option value="">Select a college...</option>
                {allColleges.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} - {c.location}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
            Loading...
          </div>
        )}

        {!loading && activeColleges.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 24px', background: '#1e293b', borderRadius: '20px', border: '1px solid #334155' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚖️</div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#94a3b8', marginBottom: '8px' }}>
              Select colleges to compare
            </div>
            <p style={{ color: '#475569', fontSize: '14px' }}>
              Choose 2 or 3 colleges from the dropdowns above
            </p>
          </div>
        )}

        {!loading && activeColleges.length >= 2 && (
          <div>
            <div style={{ background: '#1e293b', borderRadius: '20px', border: '1px solid #334155', overflow: 'hidden', marginBottom: '32px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '180px ' + activeColleges.map(() => '1fr').join(' '), borderBottom: '1px solid #334155' }}>
                <div style={{ padding: '20px 24px', background: '#0f172a' }} />
                {activeColleges.map((college) => (
                  <div key={college.id} style={{ padding: '20px 24px', borderLeft: '1px solid #334155', background: '#0f172a' }}>
                    <Link href={'/colleges/' + college.id} style={{ textDecoration: 'none' }}>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#f1f5f9', marginBottom: '4px' }}>
                        {college.name}
                      </div>
                    </Link>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>📍 {college.location}</div>
                  </div>
                ))}
              </div>

              {[
                { label: 'State', values: activeColleges.map(c => c.state) },
                { label: 'Annual Fees', values: activeColleges.map(c => 'Rs ' + c.fees.toLocaleString('en-IN')) },
                { label: 'Rating', values: activeColleges.map(c => c.rating + ' / 5.0') },
                { label: 'Courses', values: activeColleges.map(c => c.courses.length + ' courses') },
                { label: 'Reviews', values: activeColleges.map(c => c.reviews.length + ' reviews') },
              ].map((row, i, arr) => (
                <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '180px ' + activeColleges.map(() => '1fr').join(' '), borderBottom: i < arr.length - 1 ? '1px solid #334155' : 'none' }}>
                  <div style={{ padding: '16px 24px', background: 'rgba(0,0,0,0.2)' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {row.label}
                    </span>
                  </div>
                  {row.values.map((val, ci) => (
                    <div key={ci} style={{ padding: '16px 24px', borderLeft: '1px solid #334155' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#f1f5f9' }}>{val}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#f1f5f9', marginBottom: '16px' }}>
              Courses Offered
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: activeColleges.map(() => '1fr').join(' '), gap: '16px' }}>
              {activeColleges.map((college) => (
                <div key={college.id} style={{ background: '#1e293b', borderRadius: '14px', padding: '20px', border: '1px solid #334155' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#a5b4fc', marginBottom: '12px' }}>
                    {college.name}
                  </h3>
                  {college.courses.map(course => (
                    <div key={course.id} style={{ fontSize: '13px', color: '#94a3b8', padding: '8px 12px', background: '#0f172a', borderRadius: '8px', marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{course.name}</span>
                      <span style={{ color: '#34d399', fontWeight: 600 }}>Rs {course.fees.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}