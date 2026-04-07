'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

const GOAL = 1_000_000
const TRUSTS = [
  'Leeds Teaching Hospitals NHS Trust',
  "Guy's and St Thomas' NHS Foundation Trust",
  'Manchester University NHS Foundation Trust',
  'Barts Health NHS Trust',
  'Oxford University Hospitals NHS Foundation Trust',
  'NHS Greater Glasgow and Clyde',
  'Imperial College Healthcare NHS Trust',
  'University Hospitals Birmingham NHS Foundation Trust',
  'Sheffield Teaching Hospitals NHS Foundation Trust',
  'Other NHS Trust',
]

const TRUST_COLORS: Record<string, string> = {
  'Leeds Teaching Hospitals NHS Trust': '#005EB8',
  "Guy's and St Thomas' NHS Foundation Trust": '#007F3B',
  'Manchester University NHS Foundation Trust': '#ED8B00',
  'Barts Health NHS Trust': '#AE2573',
  'Oxford University Hospitals NHS Foundation Trust': '#0072CE',
}

type Submission = {
  name: string
  trust: string
  activity_type: string
  distance_miles: number
  created_at: string
}

type Stats = {
  totalMiles: number
  participantCount: number
  leaderboard: { name: string; miles: number; trust: string }[]
  trusts: { name: string; miles: number }[]
  recent: Submission[]
}

function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0)
  const startRef = useRef<number | null>(null)
  const frameRef = useRef<number | null>(null)
  const prevTarget = useRef(0)

  useEffect(() => {
    if (target === 0) return
    const start = prevTarget.current
    startRef.current = null
    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts
      const progress = Math.min((ts - startRef.current) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(start + eased * (target - start)))
      if (progress < 1) frameRef.current = requestAnimationFrame(animate)
      else prevTarget.current = target
    }
    frameRef.current = requestAnimationFrame(animate)
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current) }
  }, [target, duration])

  return count
}

function ProgressRing({ percent, size = 140, stroke = 12 }: { percent: number; size?: number; stroke?: number }) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const [offset, setOffset] = useState(circumference)
  useEffect(() => {
    const t = setTimeout(() => setOffset(circumference - (percent / 100) * circumference), 300)
    return () => clearTimeout(t)
  }, [percent, circumference])
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#ED8B00" strokeWidth={stroke}
        strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1.8s cubic-bezier(0.4,0,0.2,1)' }} />
    </svg>
  )
}

function timeAgo(dateStr: string) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000
  if (diff < 60) return `${Math.floor(diff)}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', trust: '', activity_type: '', distance_miles: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formError, setFormError] = useState('')

  const fetchStats = useCallback(async () => {
    const res = await fetch('/api/stats')
    const data = await res.json()
    setStats(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchStats()
    const channel = supabase
      .channel('miles_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'miles_submissions' }, () => fetchStats())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [fetchStats])

  const handleSubmit = async () => {
    setFormError('')
    if (!form.name || !form.trust || !form.activity_type || !form.distance_miles) {
      setFormError('Please fill in all fields.')
      return
    }
    setSubmitting(true)
    const res = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, distance_miles: parseFloat(form.distance_miles) }),
    })
    setSubmitting(false)
    if (res.ok) {
      setSubmitted(true)
      setTimeout(() => {
        setShowForm(false)
        setSubmitted(false)
        setForm({ name: '', trust: '', activity_type: '', distance_miles: '' })
      }, 2500)
    } else {
      const d = await res.json()
      setFormError(d.error ?? 'Something went wrong.')
    }
  }

  const totalMiles = stats?.totalMiles ?? 0
  const pct = Math.min((totalMiles / GOAL) * 100, 100)
  const animatedMiles = useCountUp(totalMiles, 2000)
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  const daysRemaining = 365 - dayOfYear

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#0a0f1e', minHeight: '100vh', color: '#fff' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=Bebas+Neue&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; transition: border-color 0.2s; }
        .card:hover { border-color: rgba(255,255,255,0.14); }
        .fade-in { animation: fadeIn 0.5s ease forwards; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .bar { transition: width 1.6s cubic-bezier(0.4,0,0.2,1); }
        .nhs-btn { background: #005EB8; color: #fff; border: none; border-radius: 8px; padding: 10px 20px; font-family: inherit; font-weight: 600; font-size: 14px; cursor: pointer; transition: background 0.2s, transform 0.1s; }
        .nhs-btn:hover { background: #00448a; transform: translateY(-1px); }
        .amber-btn { background: #ED8B00; color: #fff; border: none; border-radius: 10px; padding: 14px 32px; font-family: inherit; font-weight: 600; font-size: 16px; cursor: pointer; transition: background 0.2s, transform 0.1s; }
        .amber-btn:hover { background: #c47500; transform: translateY(-1px); }
        .amber-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .field { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 12px 14px; color: #fff; font-family: inherit; font-size: 15px; width: 100%; outline: none; transition: border-color 0.2s, background 0.2s; }
        .field:focus { border-color: #005EB8; background: rgba(0,94,184,0.1); }
        .field::placeholder { color: rgba(255,255,255,0.25); }
        select.field option { background: #0f1629; }
        .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); backdrop-filter: blur(6px); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        @media (max-width: 768px) {
          .main-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      {/* Nav */}
      <nav style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60, position: 'sticky', top: 0, background: 'rgba(10,15,30,0.95)', backdropFilter: 'blur(12px)', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ background: '#005EB8', borderRadius: 8, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: "'Bebas Neue'", fontSize: 15, letterSpacing: 1 }}>NHS</span>
          </div>
          <div>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: 18, letterSpacing: 2 }}>MILLION MILES</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: 1.5, textTransform: 'uppercase', marginTop: -2 }}>Staff Challenge 2025</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', background: 'rgba(0,194,90,0.15)', border: '1px solid rgba(0,194,90,0.3)', borderRadius: 20 }}>
            <div className="pulse" style={{ width: 6, height: 6, background: '#00c25a', borderRadius: '50%' }} />
            <span style={{ fontSize: 12, color: '#00c25a', fontWeight: 500 }}>Live</span>
          </div>
          <button className="nhs-btn" onClick={() => setShowForm(true)}>Log Miles</button>
        </div>
      </nav>

      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '28px 20px' }}>

        {/* Hero */}
        <div className="fade-in" style={{ marginBottom: 28 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'end', marginBottom: 6 }}>
            <div>
              <div style={{ fontSize: 12, letterSpacing: 2.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 10, fontWeight: 500 }}>Total Miles Logged</div>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(56px,9vw,108px)', lineHeight: 0.88, letterSpacing: 2 }}>
                {loading ? '—' : animatedMiles.toLocaleString()}
                <span style={{ color: '#005EB8', fontSize: '0.38em', marginLeft: 10, verticalAlign: 'middle' }}>mi</span>
              </div>
              <div style={{ marginTop: 16, fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
                of <span style={{ color: '#ED8B00', fontWeight: 600 }}>1,000,000</span> mile goal
                {!loading && <span style={{ marginLeft: 10, color: '#fff', fontWeight: 500 }}>{pct.toFixed(2)}% complete</span>}
              </div>
            </div>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ProgressRing percent={pct} size={140} stroke={12} />
              <div style={{ position: 'absolute', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Bebas Neue'", fontSize: 28, color: '#ED8B00', lineHeight: 1 }}>{pct.toFixed(1)}%</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: 1.5, textTransform: 'uppercase' }}>Done</div>
              </div>
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 8, height: 10, marginTop: 20, overflow: 'hidden' }}>
            <div className="bar" style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #005EB8 0%, #ED8B00 100%)', borderRadius: 8 }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            {[250000, 500000, 750000, 1000000].map(m => (
              <div key={m} style={{ textAlign: 'center' }}>
                <div style={{ width: 1, height: 5, background: m <= totalMiles ? '#ED8B00' : 'rgba(255,255,255,0.15)', margin: '0 auto 3px' }} />
                <div style={{ fontFamily: "'DM Mono'", fontSize: 10, color: m <= totalMiles ? '#ED8B00' : 'rgba(255,255,255,0.2)' }}>{m === 1000000 ? '1M' : `${m/1000}k`}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
          {[
            { icon: '👥', label: 'Participants', value: loading ? '—' : (stats?.participantCount ?? 0).toLocaleString(), sub: 'NHS staff' },
            { icon: '🎯', label: 'Miles to Go', value: loading ? '—' : Math.max(0, GOAL - totalMiles).toLocaleString(), sub: 'remaining' },
            { icon: '📅', label: 'Days Left', value: daysRemaining.toString(), sub: 'in 2025' },
            { icon: '📈', label: 'Needed / Day', value: loading ? '—' : Math.ceil(Math.max(0, GOAL - totalMiles) / Math.max(daysRemaining, 1)).toLocaleString(), sub: 'to hit goal' },
          ].map((s, i) => (
            <div key={i} className="card" style={{ padding: '18px 20px' }}>
              <div style={{ fontSize: 20, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: 32, letterSpacing: 1, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 1 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Fun equivalents */}
        {!loading && totalMiles > 0 && (
          <div className="card fade-in" style={{ padding: '18px 24px', marginBottom: 24, background: 'rgba(0,94,184,0.1)', borderColor: 'rgba(0,94,184,0.25)' }}>
            <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 500, whiteSpace: 'nowrap' }}>That&apos;s equivalent to</div>
              {[
                { val: Math.round(totalMiles / 26.2).toLocaleString(), label: 'marathons' },
                { val: (totalMiles / 24901 * 14).toFixed(1), label: 'laps of Earth' },
                { val: (totalMiles / 238855 * 100).toFixed(3) + '%', label: 'to the Moon' },
                { val: Math.round(totalMiles / 303).toLocaleString(), label: "Land's End → John o'Groats" },
              ].map((e, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                  <span style={{ fontFamily: "'Bebas Neue'", fontSize: 26, color: '#ED8B00' }}>{e.val}</span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{e.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main grid */}
        <div className="main-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>

          {/* Leaderboard */}
          <div className="card fade-in" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 22 }}>
              <div>
                <div style={{ fontFamily: "'Bebas Neue'", fontSize: 22, letterSpacing: 2 }}>Top Contributors</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>Individual rankings</div>
              </div>
              <span style={{ fontSize: 22 }}>🏆</span>
            </div>
            {loading ? <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Loading...</div>
              : (stats?.leaderboard.length ?? 0) === 0 ? <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>No entries yet — be the first!</div>
              : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {stats?.leaderboard.map((p, i) => {
                    const barPct = stats.leaderboard[0]?.miles ? (p.miles / stats.leaderboard[0].miles) * 100 : 0
                    const rankColor = i === 0 ? '#ED8B00' : i === 1 ? '#b0b8c8' : i === 2 ? '#c47500' : 'rgba(255,255,255,0.2)'
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 24, fontFamily: "'Bebas Neue'", fontSize: 18, color: rankColor, textAlign: 'center', flexShrink: 0 }}>{i + 1}</div>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: `hsl(${i * 53 + 205},55%,38%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>{initials(p.name)}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                            <span style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
                            <span style={{ fontFamily: "'DM Mono'", fontSize: 13, color: '#ED8B00', flexShrink: 0, marginLeft: 8 }}>{p.miles.toLocaleString()}</span>
                          </div>
                          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 4, height: 4, overflow: 'hidden' }}>
                            <div className="bar" style={{ width: `${barPct}%`, height: '100%', background: i === 0 ? '#ED8B00' : '#005EB8', borderRadius: 4 }} />
                          </div>
                          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.trust.replace(' NHS Foundation Trust', '').replace(' NHS Trust', '')}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
          </div>

          {/* Right col */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* By Trust */}
            <div className="card fade-in" style={{ padding: 24 }}>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: 22, letterSpacing: 2, marginBottom: 4 }}>By NHS Trust</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 18 }}>Top contributing trusts</div>
              {loading ? <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Loading...</div>
                : (stats?.trusts.length ?? 0) === 0 ? <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>No data yet</div>
                : stats?.trusts.map((t, i) => {
                  const barPct = stats.trusts[0]?.miles ? (t.miles / stats.trusts[0].miles) * 100 : 0
                  const color = TRUST_COLORS[t.name] ?? `hsl(${i * 60 + 200},60%,45%)`
                  return (
                    <div key={i} style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{t.name.replace(' NHS Foundation Trust', '').replace(' NHS Trust', '')}</span>
                        <span style={{ fontFamily: "'DM Mono'", fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{t.miles.toLocaleString()} mi</span>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                        <div className="bar" style={{ width: `${barPct}%`, height: '100%', background: color, borderRadius: 4, opacity: 0.9 }} />
                      </div>
                    </div>
                  )
                })}
            </div>

            {/* Live feed */}
            <div className="card fade-in" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <div style={{ fontFamily: "'Bebas Neue'", fontSize: 22, letterSpacing: 2 }}>Live Feed</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div className="pulse" style={{ width: 6, height: 6, background: '#00c25a', borderRadius: '50%' }} />
                  <span style={{ fontSize: 11, color: '#00c25a', fontWeight: 500, letterSpacing: 1 }}>LIVE</span>
                </div>
              </div>
              {loading ? <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Loading...</div>
                : (stats?.recent.length ?? 0) === 0 ? <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>No activity yet</div>
                : stats?.recent.slice(0, 6).map((a, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, marginBottom: 12, borderBottom: i < 5 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,94,184,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, flexShrink: 0 }}>{initials(a.name)}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{a.name} <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400, fontSize: 12 }}>· {a.trust.replace(' NHS Foundation Trust', '').replace(' NHS Trust', '')}</span></div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{a.activity_type}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontFamily: "'DM Mono'", fontSize: 14, color: '#ED8B00' }}>+{a.distance_miles}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>{timeAgo(a.created_at)}</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="card fade-in" style={{ padding: '36px 32px', textAlign: 'center', background: 'rgba(0,94,184,0.1)', borderColor: 'rgba(0,94,184,0.2)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(0,94,184,0.07)', pointerEvents: 'none' }} />
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: 34, letterSpacing: 3, marginBottom: 8 }}>Every Mile Counts</div>
          <div style={{ color: 'rgba(255,255,255,0.45)', marginBottom: 24, fontSize: 15, maxWidth: 480, margin: '0 auto 24px' }}>
            Whether it&apos;s a morning run, a cycling commute, or a weekend walk — every mile helps the NHS hit one million.
          </div>
          <button className="amber-btn" onClick={() => setShowForm(true)}>Log Your Miles →</button>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', marginTop: 14 }}>Running · Cycling · Walking · Swimming · All activities welcome</div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>© 2025 NHS Million Miles Challenge</div>
        <div style={{ display: 'flex', gap: 18 }}>
          {['About', 'Privacy', 'Contact'].map(l => <span key={l} style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', cursor: 'pointer' }}>{l}</span>)}
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="overlay" onClick={e => { if (e.target === e.currentTarget) setShowForm(false) }}>
          <div className="card fade-in" style={{ width: '100%', maxWidth: 460, padding: 32, background: '#0d1424', border: '1px solid rgba(255,255,255,0.12)', maxHeight: '90vh', overflowY: 'auto' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
                <div style={{ fontFamily: "'Bebas Neue'", fontSize: 30, letterSpacing: 2, marginBottom: 8 }}>Miles Logged!</div>
                <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 15 }}>Thanks for contributing to the challenge.</div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 24 }}>
                  <div>
                    <div style={{ fontFamily: "'Bebas Neue'", fontSize: 26, letterSpacing: 2 }}>Log Your Miles</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>Add your activity to the collective total</div>
                  </div>
                  <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', fontSize: 20, cursor: 'pointer', padding: 4, lineHeight: 1 }}>✕</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 1.5, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Your Name</label>
                    <input className="field" placeholder="e.g. Sarah Mitchell" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 1.5, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>NHS Trust</label>
                    <select className="field" value={form.trust} onChange={e => setForm({ ...form, trust: e.target.value })}>
                      <option value="">Select your Trust...</option>
                      {TRUSTS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 1.5, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Activity</label>
                    <select className="field" value={form.activity_type} onChange={e => setForm({ ...form, activity_type: e.target.value })}>
                      <option value="">Select activity...</option>
                      {['Running', 'Walking', 'Cycling', 'Swimming', 'Hiking', 'Other'].map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 1.5, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Distance (miles)</label>
                    <input className="field" type="number" placeholder="e.g. 6.2" min="0.1" max="200" step="0.1" value={form.distance_miles} onChange={e => setForm({ ...form, distance_miles: e.target.value })} />
                  </div>
                  {formError && <div style={{ fontSize: 13, color: '#ff6b6b', padding: '8px 12px', background: 'rgba(255,107,107,0.1)', borderRadius: 6 }}>{formError}</div>}
                  <button className="amber-btn" style={{ width: '100%', padding: 15, marginTop: 4 }} onClick={handleSubmit} disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Miles →'}
                  </button>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', textAlign: 'center' }}>Auto-sync via Strava or Garmin Connect — coming soon</div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
