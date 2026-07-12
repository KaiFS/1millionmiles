import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'

type StaticPageShellProps = {
  title: string
  children: ReactNode
}

export default function StaticPageShell({ title, children }: StaticPageShellProps) {
  return (
    <div style={{ fontFamily: 'var(--font-dm-sans), sans-serif', background: '#0a0f1e', minHeight: '100vh', color: '#fff' }}>
      <nav
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 60,
        }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit' }}>
          <div style={{ position: 'relative', width: 34, height: 34, flexShrink: 0 }}>
            <Image
              src="/logo1million.png"
              alt="One Million Miles Challenge logo"
              fill
              sizes="34px"
              style={{ borderRadius: 8, objectFit: 'contain' }}
            />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-bebas-neue), sans-serif', fontSize: 18, letterSpacing: 2 }}>The One Million Miles Challenge</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: 1.5, textTransform: 'uppercase', marginTop: -2 }}>In Support Of Evelina London</div>
          </div>
        </Link>
        <Link href="/" className="ghost-btn" style={{ textDecoration: 'none' }}>
          ← Back to Dashboard
        </Link>
      </nav>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 20px' }}>
        <div className="card" style={{ padding: '36px 32px' }}>
          <h1 style={{ fontFamily: 'var(--font-bebas-neue), sans-serif', fontSize: 32, letterSpacing: 2, margin: '0 0 24px' }}>
            {title}
          </h1>
          <div style={{ fontSize: 14, lineHeight: 1.8, color: 'rgba(255,255,255,0.85)' }}>{children}</div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>© 2026 One Million Miles Challenge</div>
        <div style={{ display: 'flex', gap: 18 }}>
          <a
            href="https://www.justgiving.com/page/onemillion-oneteam?utm_medium=FR&utm_source=CL"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 12, color: '#ED8B00' }}
          >
            Donate via JustGiving →
          </a>
          <Link href="/about" style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>About</Link>
          <Link href="/privacy" style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>Privacy</Link>
          <Link href="/terms" style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>Terms</Link>
        </div>
      </div>
    </div>
  )
}
