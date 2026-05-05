'use client'

import { useState } from 'react'

type ProfileCompletionModalProps = {
  open: boolean
  saving: boolean
  error: string
  initialFirstName?: string
  initialLastName?: string
  onSubmit: (firstName: string, lastName: string) => void
}

export default function ProfileCompletionModal({
  open,
  saving,
  error,
  initialFirstName = '',
  initialLastName = '',
  onSubmit,
}: ProfileCompletionModalProps) {
  const [firstName, setFirstName] = useState(initialFirstName)
  const [lastName, setLastName] = useState(initialLastName)

  if (!open) return null

  return (
    <div className="overlay">
      <div className="card fade-in" style={{ width: '100%', maxWidth: 460, padding: 32, background: '#0d1424', border: '1px solid rgba(255,255,255,0.12)' }}>
        <div style={{ fontFamily: 'var(--font-bebas-neue), sans-serif', fontSize: 30, letterSpacing: 2 }}>
          Complete Your Profile
        </div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginTop: 6, marginBottom: 24 }}>
          Enter your first and last name once. This will be used each time you sign in and when your miles appear on the challenge leaderboard.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 1.5, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
              First Name
            </label>
            <input
              className="field"
              placeholder="e.g. Kai"
              value={firstName}
              onChange={event => setFirstName(event.target.value)}
              autoComplete="given-name"
            />
          </div>
          <div>
            <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 1.5, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
              Last Name
            </label>
            <input
              className="field"
              placeholder="e.g. Smith"
              value={lastName}
              onChange={event => setLastName(event.target.value)}
              autoComplete="family-name"
            />
          </div>
          {error && (
            <div style={{ fontSize: 13, color: '#ff6b6b', padding: '8px 12px', background: 'rgba(255,107,107,0.1)', borderRadius: 6 }}>
              {error}
            </div>
          )}
          <button
            className="amber-btn"
            style={{ width: '100%', padding: 15, marginTop: 4 }}
            onClick={() => onSubmit(firstName, lastName)}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Name'}
          </button>
        </div>
      </div>
    </div>
  )
}
