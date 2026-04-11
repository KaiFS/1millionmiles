'use client'

import { TRUST_COLORS } from '@/app/_lib/dashboard-constants'
import type { Stats } from '@/app/_lib/dashboard-types'
import { formatTrustName, initials, timeAgo } from '@/app/_lib/dashboard-utils'

type DashboardMainGridProps = {
  stats: Stats | null
  loading: boolean
}

export default function DashboardMainGrid({ stats, loading }: DashboardMainGridProps) {
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{participant.name}</span>
                      <span style={{ fontFamily: 'var(--font-dm-mono), monospace', fontSize: 13, color: '#ED8B00', flexShrink: 0, marginLeft: 8 }}>{participant.miles.toLocaleString()}</span>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 4, height: 4, overflow: 'hidden' }}>
                      <div className="bar" style={{ width: `${barPct}%`, height: '100%', background: index === 0 ? '#ED8B00' : '#005EB8', borderRadius: 4 }} />
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {formatTrustName(participant.trust)}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div className="card fade-in" style={{ padding: 24 }}>
          <div style={{ fontFamily: 'var(--font-bebas-neue), sans-serif', fontSize: 22, letterSpacing: 2, marginBottom: 4 }}>By NHS Trust</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 18 }}>Top contributing trusts</div>
          {loading ? (
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Loading...</div>
          ) : (stats?.trusts.length ?? 0) === 0 ? (
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>No data yet</div>
          ) : (
            stats?.trusts.map((trust, index) => {
              const barPct = stats.trusts[0]?.miles ? (trust.miles / stats.trusts[0].miles) * 100 : 0
              const color = TRUST_COLORS[trust.name] ?? `hsl(${index * 60 + 200},60%,45%)`

              return (
                <div key={trust.name} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{formatTrustName(trust.name)}</span>
                    <span style={{ fontFamily: 'var(--font-dm-mono), monospace', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{trust.miles.toLocaleString()} mi</span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                    <div className="bar" style={{ width: `${barPct}%`, height: '100%', background: color, borderRadius: 4, opacity: 0.9 }} />
                  </div>
                </div>
              )
            })
          )}
        </div>

        <div className="card fade-in" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <div style={{ fontFamily: 'var(--font-bebas-neue), sans-serif', fontSize: 22, letterSpacing: 2 }}>Live Feed</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div className="pulse" style={{ width: 6, height: 6, background: '#00c25a', borderRadius: '50%' }} />
              <span style={{ fontSize: 11, color: '#00c25a', fontWeight: 500, letterSpacing: 1 }}>LIVE</span>
            </div>
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
                    <div style={{ fontSize: 13, fontWeight: 500 }}>
                      {activity.name}
                      <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400, fontSize: 12 }}> · {formatTrustName(activity.trust)}</span>
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
