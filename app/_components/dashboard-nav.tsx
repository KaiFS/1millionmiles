'use client'

import Image from 'next/image'

type DashboardNavProps = {
  userLabel: string
  signedIn: boolean
  authBusy: boolean
  authLoading: boolean
  onSignIn: () => void
  onSignOut: () => void
  onOpenForm: () => void
  onEditProfile: () => void
}

export default function DashboardNav({
  userLabel,
  signedIn,
  authBusy,
  authLoading,
  onSignIn,
  onSignOut,
  onOpenForm,
  onEditProfile,
}: DashboardNavProps) {
  return (
    <nav
      style={{
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 60,
        position: 'sticky',
        top: 0,
        background: 'rgba(10,15,30,0.95)',
        backdropFilter: 'blur(12px)',
        zIndex: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ position: 'relative', width: 34, height: 34, flexShrink: 0 }}>
          <Image
            src="/logo1million.png"
            alt="One Million Miles Challenge logo"
            fill
            sizes="34px"
            loading="eager"
            style={{ borderRadius: 8, objectFit: 'contain' }}
          />
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-bebas-neue), sans-serif', fontSize: 18, letterSpacing: 2 }}>The One Million Miles Challenge</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: 1.5, textTransform: 'uppercase', marginTop: -2 }}>In Support Of Evelina London</div>
        </div>
      </div>
      <div className="nav-actions" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', background: 'rgba(0,194,90,0.15)', border: '1px solid rgba(0,194,90,0.3)', borderRadius: 20 }}>
          <div className="pulse" style={{ width: 6, height: 6, background: '#00c25a', borderRadius: '50%' }} />
          <span style={{ fontSize: 12, color: '#00c25a', fontWeight: 500 }}>Live</span>
        </div>
        {signedIn ? (
          <>
            <button
              onClick={onEditProfile}
              title="Edit profile"
              aria-label="Edit profile"
              style={{ padding: '8px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', maxWidth: 220, cursor: 'pointer', textAlign: 'left', font: 'inherit', color: 'inherit' }}
            >
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 1.2 }}>Edit Profile</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userLabel}</span>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, flexShrink: 0, lineHeight: 1 }}>✎</span>
              </div>
            </button>
            <button className="ghost-btn" onClick={onSignOut} disabled={authBusy}>
              {authBusy ? 'Working...' : 'Sign Out'}
            </button>
          </>
        ) : (
          <button className="google-btn" onClick={onSignIn} disabled={authBusy || authLoading}>
            {authBusy || authLoading ? 'Connecting...' : 'Sign In With Google'}
          </button>
        )}
        {signedIn && <button className="nhs-btn" onClick={onOpenForm}>Log Miles</button>}
      </div>
    </nav>
  )
}
