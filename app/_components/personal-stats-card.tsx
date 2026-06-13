'use client'

type PersonalStatsCardProps = {
  loading: boolean
  totalMiles: number | null
  rank: number | null
  totalParticipants: number
}

export default function PersonalStatsCard({ loading, totalMiles, rank, totalParticipants }: PersonalStatsCardProps) {
  return (
    <div className="card fade-in" style={{ padding: '18px 24px', marginBottom: 24, background: 'rgba(0,94,184,0.08)', borderColor: 'rgba(0,94,184,0.2)' }}>
      <div style={{ fontSize: 12, letterSpacing: 2.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 10, fontWeight: 500 }}>Your Personal Contribution So Far</div>
      {loading ? (
        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Loading...</div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-bebas-neue), sans-serif', fontSize: 48, lineHeight: 1, letterSpacing: 1 }}>
              {totalMiles !== null ? totalMiles.toLocaleString() : '—'}
            </span>
            <span style={{ color: '#005EB8', fontSize: 18, marginLeft: 6 }}>mi</span>
          </div>
          {rank !== null && (
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>
              <span style={{ fontFamily: 'var(--font-bebas-neue), sans-serif', fontSize: 22, color: '#ED8B00' }}>#{rank}</span>
              {' '}out of{' '}
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>{totalParticipants.toLocaleString()}</span>
              {' '}challengers
            </div>
          )}
        </div>
      )}
    </div>
  )
}
