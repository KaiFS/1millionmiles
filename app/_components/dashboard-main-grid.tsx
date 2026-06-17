'use client'

import type { Stats } from '@/app/_lib/dashboard-types'
import { initials, timeAgo } from '@/app/_lib/dashboard-utils'

type DashboardMainGridProps = {
  stats: Stats | null
  loading: boolean
  signedIn: boolean
  authBusy: boolean
  authLoading: boolean
  onSignIn: () => void
  onOpenForm: () => void
}

export default function DashboardMainGrid({ stats, loading, signedIn, authBusy, authLoading, onSignIn, onOpenForm }: DashboardMainGridProps) {
  return (
    <div className="main-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
      <div className="card fade-in" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 22 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-bebas-neue), sans-serif', fontSize: 22, letterSpacing: 2 }}>Top Contributors</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>Individual rankings</div>
          </div>
          <span style={{ fontSize: 22 }}>🏆</span>
        </div>
        {loading ? (
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Loading...</div>
        ) : (stats?.leaderboard.length ?? 0) === 0 ? (
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>No entries yet — be the first!</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {stats?.leaderboard.map((participant, index) => {
              const barPct = stats.leaderboard[0]?.miles ? (participant.miles / stats.leaderboard[0].miles) * 100 : 0
              const rankColor = index === 0 ? '#ED8B00' : index === 1 ? '#b0b8c8' : index === 2 ? '#c47500' : 'rgba(255,255,255,0.2)'

              return (
                <div key={participant.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 24, fontFamily: 'var(--font-bebas-neue), sans-serif', fontSize: 18, color: rankColor, textAlign: 'center', flexShrink: 0 }}>{index + 1}</div>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: `hsl(${index * 53 + 205},55%,38%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
                    {initials(participant.name)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4, gap: 8 }}>
                      <div style={{ minWidth: 0, display: 'flex', alignItems: 'baseline', gap: 6, overflow: 'hidden' }}>
                        <span style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{participant.name}</span>
                        {participant.job_role && participant.job_role.trim() && (
                          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap', flexShrink: 0 }}>{participant.job_role}</span>
                        )}
                      </div>
                      <span style={{ fontFamily: 'var(--font-dm-mono), monospace', fontSize: 13, color: '#ED8B00', flexShrink: 0, marginLeft: 8 }}>{participant.miles.toLocaleString()}</span>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 4, height: 4, overflow: 'hidden' }}>
                      <div className="bar" style={{ width: `${barPct}%`, height: '100%', background: index === 0 ? '#ED8B00' : '#005EB8', borderRadius: 4 }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div className="card fade-in" style={{ padding: '18px 22px', background: 'linear-gradient(135deg, rgba(0,94,184,0.16), rgba(237,139,0,0.08))', borderColor: 'rgba(255,255,255,0.12)' }}>
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

        <div className="card fade-in" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <div style={{ fontFamily: 'var(--font-bebas-neue), sans-serif', fontSize: 22, letterSpacing: 2 }}>Activity Feed</div>
          </div>
          {loading ? (
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Loading...</div>
          ) : (stats?.recent.length ?? 0) === 0 ? (
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>No activity yet</div>
          ) : (
            stats?.recent.slice(0, 6).map((activity, index) => (
              <div key={`${activity.name}-${activity.created_at}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, marginBottom: 12, borderBottom: index < 5 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,94,184,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, flexShrink: 0 }}>
                    {initials(activity.name)}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, overflow: 'hidden' }}>
                      <span style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{activity.name}</span>
                      {activity.job_role && activity.job_role.trim() && (
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap', flexShrink: 0 }}>{activity.job_role}</span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{activity.activity_type}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontFamily: 'var(--font-dm-mono), monospace', fontSize: 14, color: '#ED8B00' }}>+{activity.distance_miles}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>{timeAgo(activity.created_at)}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
