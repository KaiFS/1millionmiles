'use client'

import DashboardMainGrid from '@/app/_components/dashboard-main-grid'
import DashboardNav from '@/app/_components/dashboard-nav'
import DashboardSummary from '@/app/_components/dashboard-summary'
import ProofGallery from '@/app/_components/proof-gallery'
import ProofModal from '@/app/_components/proof-modal'
import SubmitMilesModal from '@/app/_components/submit-miles-modal'
import { useCountUp } from '@/app/_hooks/use-count-up'
import { useDashboardState } from '@/app/_hooks/use-dashboard-state'

export default function DashboardClient() {
  const dashboard = useDashboardState()
  const animatedMiles = useCountUp(dashboard.totalMiles, 2000)

  return (
    <div style={{ fontFamily: 'var(--font-dm-sans), sans-serif', background: '#0a0f1e', minHeight: '100vh', color: '#fff' }}>
      <DashboardNav
        userLabel={dashboard.userLabel}
        signedIn={Boolean(dashboard.user)}
        authBusy={dashboard.authBusy}
        authLoading={dashboard.authLoading}
        onSignIn={() => { void dashboard.handleGoogleSignIn() }}
        onSignOut={() => { void dashboard.handleSignOut() }}
        onOpenForm={() => dashboard.setShowForm(true)}
      />

      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '28px 20px' }}>
        {dashboard.authError && (
          <div style={{ marginBottom: 18, padding: '12px 14px', borderRadius: 10, background: 'rgba(255,107,107,0.12)', border: '1px solid rgba(255,107,107,0.18)', color: '#ff8e8e', fontSize: 14 }}>
            {dashboard.authError}
          </div>
        )}

        <DashboardSummary
          loading={dashboard.loading}
          animatedMiles={animatedMiles}
          pct={dashboard.pct}
          totalMiles={dashboard.totalMiles}
          participantCount={dashboard.stats?.participantCount ?? 0}
          daysRemaining={dashboard.daysRemaining}
          signedIn={Boolean(dashboard.user)}
          authBusy={dashboard.authBusy}
          authLoading={dashboard.authLoading}
          onSignIn={() => { void dashboard.handleGoogleSignIn() }}
          onOpenForm={() => dashboard.setShowForm(true)}
        />

        <DashboardMainGrid stats={dashboard.stats} loading={dashboard.loading} />

        {dashboard.user && (
          <ProofGallery
            proofs={dashboard.proofs}
            proofsLoading={dashboard.proofsLoading}
            onSelectProof={proof => dashboard.setSelectedProof(proof)}
          />
        )}

        <div className="card fade-in" style={{ padding: '36px 32px', textAlign: 'center', background: 'rgba(0,94,184,0.1)', borderColor: 'rgba(0,94,184,0.2)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(0,94,184,0.07)', pointerEvents: 'none' }} />
          <div style={{ fontFamily: 'var(--font-bebas-neue), sans-serif', fontSize: 34, letterSpacing: 3, marginBottom: 8 }}>Every Mile Counts</div>
          <div style={{ color: 'rgba(255,255,255,0.45)', marginBottom: 24, fontSize: 15, maxWidth: 520, margin: '0 auto 24px' }}>
            Whether it&apos;s a morning run, a cycling commute, or a weekend walk, every mile helps the NHS hit one million.
          </div>
          {dashboard.user && <button className="amber-btn" onClick={() => dashboard.setShowForm(true)}>Log Your Miles →</button>}
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', marginTop: 14 }}>Running · Cycling · Walking · Swimming · All activities welcome</div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>© 2026 NHS Million Miles Challenge</div>
        <div style={{ display: 'flex', gap: 18 }}>
          {['About', 'Privacy', 'Contact'].map(linkLabel => (
            <span key={linkLabel} style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', cursor: 'pointer' }}>
              {linkLabel}
            </span>
          ))}
        </div>
      </div>

      {dashboard.selectedProof && (
        <ProofModal proof={dashboard.selectedProof} onClose={() => dashboard.setSelectedProof(null)} />
      )}

      {dashboard.showForm && (
        <SubmitMilesModal
          form={dashboard.form}
          proofFile={dashboard.proofFile}
          convertedMiles={dashboard.convertedMiles}
          signedIn={Boolean(dashboard.user)}
          submitting={dashboard.submitting}
          submitted={dashboard.submitted}
          submitWarning={dashboard.submitWarning}
          formError={dashboard.formError}
          onClose={() => dashboard.setShowForm(false)}
          onSubmit={() => { void dashboard.handleSubmit() }}
          onProofSelected={dashboard.handleProofSelected}
          onFieldChange={dashboard.setFormField}
        />
      )}
    </div>
  )
}
