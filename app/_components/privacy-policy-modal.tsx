'use client'

import { useEffect } from 'react'

interface PrivacyPolicyModalProps {
  open: boolean
  onClose: () => void
}

export default function PrivacyPolicyModal({ open, onClose }: PrivacyPolicyModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  if (!open) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#0a0f1e',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 12,
          maxWidth: 720,
          width: '100%',
          maxHeight: '80vh',
          overflow: 'auto',
          padding: 32,
          color: '#fff',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 24, fontFamily: 'var(--font-bebas-neue), sans-serif' }}>
            Privacy Policy
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.6)',
              fontSize: 28,
              cursor: 'pointer',
              padding: 0,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        <div style={{ fontSize: 14, lineHeight: 1.8, color: 'rgba(255,255,255,0.85)' }}>
          <p style={{ marginBottom: 16 }}>
            <strong>Last updated: May 28, 2026</strong>
          </p>

          <h3 style={{ fontSize: 16, marginTop: 24, marginBottom: 12, color: '#fff' }}>
            1. Introduction
          </h3>
          <p style={{ marginBottom: 12 }}>
            The One Million Miles Challenge (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, and safeguard your information when you
            use our fitness challenge application in support of Evelina London Children&apos;s Hospital.
          </p>

          <h3 style={{ fontSize: 16, marginTop: 24, marginBottom: 12, color: '#fff' }}>
            2. Information We Collect
          </h3>
          <p style={{ marginBottom: 12 }}>
            We collect the following types of information:
          </p>
          <ul style={{ marginBottom: 12, paddingLeft: 20 }}>
            <li style={{ marginBottom: 8 }}>
              <strong>Information you provide:</strong> Name (if signed in), miles/activities logged,
              optional screenshot proofs of your activities.
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Automatic collection:</strong> Device information, browser type, and usage
              data when you access the app.
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Third-party data:</strong> If you sign in with Google, we receive your name
              and email address (with your permission).
            </li>
          </ul>

          <h3 style={{ fontSize: 16, marginTop: 24, marginBottom: 12, color: '#fff' }}>
            3. How We Use Your Information
          </h3>
          <p style={{ marginBottom: 12 }}>
            We use the collected information to:
          </p>
          <ul style={{ marginBottom: 12, paddingLeft: 20 }}>
            <li style={{ marginBottom: 8 }}>
              Display your contributions on the public leaderboard and recent activity feed
            </li>
            <li style={{ marginBottom: 8 }}>Track your personal progress toward the one million mile goal</li>
            <li style={{ marginBottom: 8 }}>
              Verify activity submissions through optional screenshot proofs
            </li>
            <li style={{ marginBottom: 8 }}>Communicate important updates about the challenge</li>
            <li style={{ marginBottom: 8 }}>Improve our services and user experience</li>
          </ul>

          <h3 style={{ fontSize: 16, marginTop: 24, marginBottom: 12, color: '#fff' }}>
            4. Public Leaderboard
          </h3>
          <p style={{ marginBottom: 12 }}>
            Mileage submissions appear on a public leaderboard visible to all users. If you sign in
            with Google, your name will be displayed. Anonymous submissions show &quot;Anonymous
            Challenger&quot; as the display name.
          </p>

          <h3 style={{ fontSize: 16, marginTop: 24, marginBottom: 12, color: '#fff' }}>
            5. Data Sharing and Disclosure
          </h3>
          <p style={{ marginBottom: 12 }}>
            We do not sell your personal information. We may share data in the following
            circumstances:
          </p>
          <ul style={{ marginBottom: 12, paddingLeft: 20 }}>
            <li style={{ marginBottom: 8 }}>
              With Evelina London Children&apos;s Hospital as the beneficiary charity
            </li>
            <li style={{ marginBottom: 8 }}>
              With service providers (Supabase, Google) who help operate the app under strict
              data protection agreements
            </li>
            <li style={{ marginBottom: 8 }}>
              When required by law or to protect our rights and safety
            </li>
          </ul>

          <h3 style={{ fontSize: 16, marginTop: 24, marginBottom: 12, color: '#fff' }}>
            6. Data Security
          </h3>
          <p style={{ marginBottom: 12 }}>
            We implement appropriate technical and organizational measures to protect your
            information, including encryption, access controls, and secure cloud infrastructure
            through our service providers.
          </p>

          <h3 style={{ fontSize: 16, marginTop: 24, marginBottom: 12, color: '#fff' }}>
            7. Your Rights
          </h3>
          <p style={{ marginBottom: 12 }}>
            Under UK GDPR, you have the right to:
          </p>
          <ul style={{ marginBottom: 12, paddingLeft: 20 }}>
            <li style={{ marginBottom: 8 }}>Access your personal data</li>
            <li style={{ marginBottom: 8 }}>Request correction of inaccurate data</li>
            <li style={{ marginBottom: 8 }}>Request deletion of your data</li>
            <li style={{ marginBottom: 8 }}>Object to or restrict processing of your data</li>
            <li style={{ marginBottom: 8 }}>Data portability</li>
          </ul>

          <h3 style={{ fontSize: 16, marginTop: 24, marginBottom: 12, color: '#fff' }}>
            8. Data Retention
          </h3>
          <p style={{ marginBottom: 12 }}>
            We retain your information for as long as your account is active and for a reasonable
            period thereafter for legitimate business purposes, or as required by law.
          </p>

          <h3 style={{ fontSize: 16, marginTop: 24, marginBottom: 12, color: '#fff' }}>
            9. Children&apos;s Privacy
          </h3>
          <p style={{ marginBottom: 12 }}>
            Our services are not intended for children under 13. We do not knowingly collect
            personal information from children under 13.
          </p>

          <h3 style={{ fontSize: 16, marginTop: 24, marginBottom: 12, color: '#fff' }}>
            10. Changes to This Policy
          </h3>
          <p style={{ marginBottom: 12 }}>
            We may update this Privacy Policy from time to time. We will notify you of any changes
            by posting the new policy on this page and updating the &#34;Last updated&#34; date.
          </p>

          <h3 style={{ fontSize: 16, marginTop: 24, marginBottom: 12, color: '#fff' }}>
            11. Contact Us
          </h3>
          <p style={{ marginBottom: 12 }}>
            If you have questions about this Privacy Policy or your data, please contact us at:
            <br />
            <a
              href="mailto:kai.fs1996@gmail.com"
              style={{ color: '#00aaff', textDecoration: 'underline' }}
            >
              kai.fs1996@gmail.com
            </a>
          </p>

          <p style={{ marginTop: 32, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
            This policy is governed by the laws of England and Wales.
          </p>
        </div>
      </div>
    </div>
  )
}
