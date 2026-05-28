'use client'

import { GOAL } from '@/app/_lib/dashboard-constants'
import ProgressRing from '@/app/_components/progress-ring'

type DashboardSummaryProps = {
  loading: boolean
  animatedMiles: number
  pct: number
  totalMiles: number
  participantCount: number
  daysRemaining: number
  signedIn: boolean
  authBusy: boolean
  authLoading: boolean
  onSignIn: () => void
  onOpenForm: () => void
}

export default function DashboardSummary({
  loading,
  animatedMiles,
  pct,
  totalMiles,
  participantCount,
  daysRemaining,
  signedIn,
  authBusy,
  authLoading,
  onSignIn,
  onOpenForm,
}: DashboardSummaryProps) {
  return (
    <>
      <div className="fade-in" style={{ marginBottom: 28 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'end', marginBottom: 6 }}>
          <div>
            <div style={{ fontSize: 12, letterSpacing: 2.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 10, fontWeight: 500 }}>Total Miles Logged</div>
            <div style={{ fontFamily: 'var(--font-bebas-neue), sans-serif', fontSize: 'clamp(56px,9vw,108px)', lineHeight: 0.88, letterSpacing: 2 }}>
              {loading ? '—' : animatedMiles.toLocaleString()}
              <span style={{ color: '#005EB8', fontSize: '0.38em', marginLeft: 10, verticalAlign: 'middle' }}>mi</span>
            </div>
            <div style={{ marginTop: 16, fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
              of <span style={{ color: '#ED8B00', fontWeight: 600 }}>{GOAL.toLocaleString()}</span> mile goal
            </div>
          </div>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ProgressRing percent={pct} size={140} stroke={12} />
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-bebas-neue), sans-serif', fontSize: 28, color: '#ED8B00', lineHeight: 1 }}>{pct.toFixed(2)}%</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: 1.5, textTransform: 'uppercase' }}>Done</div>
            </div>
          </div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 8, height: 10, marginTop: 20, overflow: 'hidden' }}>
          <div className="bar" style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #005EB8 0%, #ED8B00 100%)', borderRadius: 8 }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          {[250000, 500000, 750000, 1000000].map(milestone => (
            <div key={milestone} style={{ textAlign: 'center' }}>
              <div style={{ width: 1, height: 5, background: milestone <= totalMiles ? '#ED8B00' : 'rgba(255,255,255,0.15)', margin: '0 auto 3px' }} />
              <div style={{ fontFamily: 'var(--font-dm-mono), monospace', fontSize: 10, color: milestone <= totalMiles ? '#ED8B00' : 'rgba(255,255,255,0.2)' }}>
                {milestone === GOAL ? '1M' : `${milestone / 1000}k`}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="stats-grid fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { icon: '👥', label: 'Participants', value: loading ? '—' : participantCount.toLocaleString(), sub: 'challengers' },
          { icon: '🎯', label: 'Miles to Go', value: loading ? '—' : Math.max(0, GOAL - totalMiles).toLocaleString(), sub: 'remaining' },
          { icon: '📅', label: 'Days Left', value: daysRemaining.toString(), sub: 'until June 1st, 2027' },
          { icon: '📈', label: 'Miles Needed / Day', value: loading ? '—' : Math.ceil(Math.max(0, GOAL - totalMiles) / Math.max(daysRemaining, 1)).toLocaleString(), sub: 'to hit goal' },
        ].map((item, index) => (
          <div key={index} className="card" style={{ padding: '18px 20px' }}>
            <div style={{ fontSize: 20, marginBottom: 8 }}>{item.icon}</div>
            <div style={{ fontFamily: 'var(--font-bebas-neue), sans-serif', fontSize: 32, letterSpacing: 1, lineHeight: 1 }}>{item.value}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 }}>{item.label}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 1 }}>{item.sub}</div>
          </div>
        ))}
      </div>

      {!loading && totalMiles > 0 && (
        <div className="card fade-in" style={{ padding: '18px 24px', marginBottom: 24, background: 'rgba(0,94,184,0.1)', borderColor: 'rgba(0,94,184,0.25)' }}>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 500, whiteSpace: 'nowrap' }}>That&apos;s equivalent to</div>
            {[
              { val: Math.floor(totalMiles / 26.2).toLocaleString(), label: 'marathons' },
              { val: ((totalMiles / 24901) * 14).toFixed(1), label: 'laps of Earth' },
              { val: `${((totalMiles / 238855) * 100).toFixed(3)}%`, label: 'to the Moon' },
              { val: Math.floor(totalMiles / 303).toLocaleString(), label: "Land's End → John o'Groats" },
            ].map((equivalent, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                <span style={{ fontFamily: 'var(--font-bebas-neue), sans-serif', fontSize: 26, color: '#ED8B00' }}>{equivalent.val}</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{equivalent.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card fade-in" style={{ padding: '18px 22px', marginBottom: 24, background: 'linear-gradient(135deg, rgba(0,94,184,0.16), rgba(237,139,0,0.08))', borderColor: 'rgba(255,255,255,0.12)' }}>
        {signedIn ? (
          <div style={{ display: 'flex', gap: 18, justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-bebas-neue), sans-serif', fontSize: 24, letterSpacing: 2 }}>Log Your Miles</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>
                Signed-in users can attach an optional screenshot from Strava, Garmin, or another tracker and browse recent proof uploads.
              </div>
            </div>
            <button className="amber-btn" style={{ padding: '12px 22px' }} onClick={onOpenForm}>
              Log Your Miles
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 18, justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-bebas-neue), sans-serif', fontSize: 24, letterSpacing: 2 }}>Login To Share Miles</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>
                Please login with Google to unlock the ability to view other members submissions.
              </div>
            </div>
            <button className="amber-btn" onClick={onSignIn} disabled={authBusy || authLoading}>
              {authBusy || authLoading ? 'Connecting...' : 'Continue With Google'}
            </button>
          </div>
        )}
      </div>

      <div className="card fade-in" style={{ padding: '18px 22px', marginBottom: 24, background: 'rgba(237,139,0,0.08)', borderColor: 'rgba(237,139,0,0.25)' }}>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-bebas-neue), sans-serif', fontSize: 18, letterSpacing: 2 }}>Need to convert miles?</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>
              Use our quick calculator to convert between miles and kilometres.
            </div>
          </div>
          <button className="amber-btn" style={{ padding: '10px 18px' }} onClick={onOpenForm}>
            Open Calculator
          </button>
        </div>
      </div>
    </>
  )
}
