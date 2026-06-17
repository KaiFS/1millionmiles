'use client'

import Image from 'next/image'

import DashboardMainGrid from '@/app/_components/dashboard-main-grid'
import DashboardNav from '@/app/_components/dashboard-nav'
import ProfileCompletionModal from '@/app/_components/profile-completion-modal'
import DashboardSummary from '@/app/_components/dashboard-summary'
import ProofGallery from '@/app/_components/proof-gallery'
import ProofModal from '@/app/_components/proof-modal'
import SubmitMilesModal from '@/app/_components/submit-miles-modal'
import PrivacyPolicyModal from '@/app/_components/privacy-policy-modal'
import TermsOfServiceModal from '@/app/_components/terms-of-service-modal'
import { useCountUp } from '@/app/_hooks/use-count-up'
import { useDashboardState } from '@/app/_hooks/use-dashboard-state'
import React from 'react'

export default function DashboardClient() {
  const dashboard = useDashboardState()
  const animatedMiles = useCountUp(dashboard.totalMiles, 2000)
  const signedIn = dashboard.isHydrated && Boolean(dashboard.user)
  const authBusy = dashboard.isHydrated ? dashboard.authBusy : false
  const authLoading = dashboard.isHydrated ? dashboard.authLoading : false
  const [showPrivacyModal, setShowPrivacyModal] = React.useState(false)
  const [showTermsModal, setShowTermsModal] = React.useState(false)

  return (
    <div style={{ fontFamily: 'var(--font-dm-sans), sans-serif', background: '#0a0f1e', minHeight: '100vh', color: '#fff' }}>
      <DashboardNav
        userLabel={dashboard.userLabel}
        signedIn={signedIn}
        authBusy={authBusy}
        authLoading={authLoading}
        onSignIn={() => { void dashboard.handleGoogleSignIn() }}
        onSignOut={() => { void dashboard.handleSignOut() }}
        onOpenForm={() => dashboard.setShowForm(true)}
      />

      <ProfileCompletionModal
        key={`profile-modal-${dashboard.user?.id ?? 'guest'}-${dashboard.showProfilePrompt ? 'open' : 'closed'}`}
        open={signedIn && dashboard.showProfilePrompt}
        saving={dashboard.profileSaving}
        error={dashboard.profileError}
        onSubmit={(firstName, lastName) => {
          void dashboard.handleProfileSave(firstName, lastName)
        }}
      />

      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '28px 20px' }}>
        {dashboard.authError && (
          <div style={{ marginBottom: 18, padding: '12px 14px', borderRadius: 10, background: 'rgba(255,107,107,0.12)', border: '1px solid rgba(255,107,107,0.18)', color: '#ff8e8e', fontSize: 14 }}>
            {dashboard.authError}
          </div>
        )}

        <DashboardSummary
          loading={dashboard.loading}
          statsError={dashboard.statsError}
          animatedMiles={animatedMiles}
          pct={dashboard.pct}
          totalMiles={dashboard.totalMiles}
          participantCount={dashboard.stats?.participantCount ?? 0}
          daysRemaining={dashboard.daysRemaining}
          signedIn={signedIn}
          personalStats={dashboard.personalStats}
          personalStatsLoading={dashboard.personalStatsLoading}
        />

        <DashboardMainGrid
          stats={dashboard.stats}
          loading={dashboard.loading}
          signedIn={signedIn}
          authBusy={authBusy}
          authLoading={authLoading}
          onSignIn={() => { void dashboard.handleGoogleSignIn() }}
          onOpenForm={() => dashboard.setShowForm(true)}
        />

        {signedIn && (
          <ProofGallery
            proofs={dashboard.proofs}
            proofsLoading={dashboard.proofsLoading}
            onSelectProof={proof => dashboard.setSelectedProof(proof)}
          />
        )}

        <div className="card fade-in" style={{ padding: '36px 32px', background: 'rgba(0,94,184,0.1)', borderColor: 'rgba(0,94,184,0.2)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(0,94,184,0.07)', pointerEvents: 'none' }} />
          <div className="mile-banner" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: 24, alignItems: 'center', position: 'relative' }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontFamily: 'var(--font-bebas-neue), sans-serif', fontSize: 34, letterSpacing: 3, marginBottom: 8 }}>Every Mile Counts</div>
              <div style={{ color: 'rgba(255,255,255,0.45)', marginBottom: 24, fontSize: 15, maxWidth: 520 }}>
                Whether it&apos;s a morning run, a cycling commute, or a weekend walk, every mile helps the NHS hit one million.
              </div>
              {signedIn && <button className="amber-btn" onClick={() => dashboard.setShowForm(true)}>Log Your Miles →</button>}
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', marginTop: 14 }}>Running · Cycling · Walking · Swimming · All activities welcome</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: 220 }}>
              <div style={{ padding: 18, borderRadius: 20, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 18px 45px rgba(0,0,0,0.18)' }}>
                <div style={{ position: 'relative', width: 'clamp(140px, 18vw, 180px)', aspectRatio: '1 / 1' }}>
                <Image
                  src="/logo1million.png"
                  alt="One Million Miles Challenge logo"
                  fill
                  loading="eager"
                  sizes="(max-width: 768px) 140px, 180px"
                  style={{ display: 'block', borderRadius: 16, objectFit: 'contain' }}
                />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>© 2026 One Million Miles Challenge</div>
        <div style={{ display: 'flex', gap: 18 }}>
          <a
            href="https://www.justgiving.com/page/onemillion-oneteam?utm_medium=FR&utm_source=CL"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 12, color: '#ED8B00', cursor: 'pointer' }}
          >
            Donate via JustGiving →
          </a>
          <span
            style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', cursor: 'pointer' }}
            onClick={() => setShowTermsModal(true)}
          >
            About
          </span>
          <span
            style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', cursor: 'pointer' }}
            onClick={() => setShowPrivacyModal(true)}
          >
            Privacy
          </span>
          <span
            style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', cursor: 'pointer' }}
            onClick={() => window.open('mailto:kai.fs1996@gmail.com', '_blank')}
          >
            Contact
          </span>
        </div>
      </div>

      <PrivacyPolicyModal open={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />
      <TermsOfServiceModal open={showTermsModal} onClose={() => setShowTermsModal(false)} />

      {dashboard.selectedProof && (
        <ProofModal proof={dashboard.selectedProof} onClose={() => dashboard.setSelectedProof(null)} />
      )}

      {dashboard.showForm && (
        <SubmitMilesModal
          form={dashboard.form}
          proofFile={dashboard.proofFile}
          convertedMiles={dashboard.convertedMiles}
          signedIn={signedIn}
          nameLocked={signedIn}
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
