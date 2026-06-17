'use client'

import { useState } from 'react'
import { PREDEFINED_ROLES } from '@/lib/roles'

const ROLE_CHIPS = ['No role', ...PREDEFINED_ROLES, 'Other'] as const
const OTHER_SENTINEL = '__other__'

function initialRoleState(jobRole: string | null | undefined): { selected: string | null; custom: string } {
  if (!jobRole) return { selected: null, custom: '' }
  if ((PREDEFINED_ROLES as readonly string[]).includes(jobRole)) return { selected: jobRole, custom: '' }
  return { selected: OTHER_SENTINEL, custom: jobRole }
}

type ProfileCompletionModalProps = {
  open: boolean
  saving: boolean
  error: string
  mode: 'prompt' | 'edit'
  initialFirstName?: string
  initialLastName?: string
  initialJobRole?: string | null
  onSubmit: (firstName: string, lastName: string, jobRole: string | null) => void
  onClose: () => void
}

export default function ProfileCompletionModal({
  open,
  saving,
  error,
  mode,
  initialFirstName = '',
  initialLastName = '',
  initialJobRole,
  onSubmit,
  onClose,
}: ProfileCompletionModalProps) {
  const [firstName, setFirstName] = useState(initialFirstName)
  const [lastName, setLastName] = useState(initialLastName)
  const init = initialRoleState(initialJobRole)
  const [selectedRole, setSelectedRole] = useState<string | null>(init.selected)
  const [customRole, setCustomRole] = useState(init.custom)

  if (!open) return null

  const resolvedJobRole: string | null =
    selectedRole === OTHER_SENTINEL ? customRole.trim() || null : selectedRole

  const sanitizedCustom = customRole.replace(/[^a-zA-Z0-9 -]/g, '').trim()
  const otherIsEmpty = selectedRole === OTHER_SENTINEL && !sanitizedCustom
  const nameEmpty = !firstName.trim() || !lastName.trim()
  const saveDisabled = saving || nameEmpty || otherIsEmpty

  const handleChipClick = (chip: string) => {
    if (chip === 'No role') {
      setSelectedRole(null)
    } else if (chip === 'Other') {
      setSelectedRole(OTHER_SENTINEL)
    } else {
      setSelectedRole(chip)
    }
  }

  const isChipActive = (chip: string) => {
    if (chip === 'No role') return selectedRole === null
    if (chip === 'Other') return selectedRole === OTHER_SENTINEL
    return selectedRole === chip
  }

  return (
    <div className="overlay">
      <div
        className="card fade-in"
        style={{ width: '100%', maxWidth: 480, padding: 32, background: '#0d1424', border: '1px solid rgba(255,255,255,0.12)' }}
      >
        <div style={{ fontFamily: 'var(--font-bebas-neue), sans-serif', fontSize: 30, letterSpacing: 2 }}>
          {mode === 'edit' ? 'Edit Your Profile' : 'Complete Your Profile'}
        </div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginTop: 6, marginBottom: 24 }}>
          {mode === 'edit'
            ? 'Update your name or job role. Changes appear on the leaderboard.'
            : 'Enter your name and optionally your job role. This appears on the leaderboard.'}
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
              onChange={e => setFirstName(e.target.value)}
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
              onChange={e => setLastName(e.target.value)}
              autoComplete="family-name"
            />
          </div>

          <div>
            <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 1.5, textTransform: 'uppercase', display: 'block', marginBottom: 10 }}>
              Job Role <span style={{ color: 'rgba(255,255,255,0.2)', textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {ROLE_CHIPS.map(chip => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleChipClick(chip)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 20,
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: 'pointer',
                    border: isChipActive(chip)
                      ? '1px solid #005EB8'
                      : '1px solid rgba(255,255,255,0.15)',
                    background: isChipActive(chip)
                      ? 'rgba(0,94,184,0.25)'
                      : 'rgba(255,255,255,0.04)',
                    color: isChipActive(chip) ? '#fff' : 'rgba(255,255,255,0.55)',
                    transition: 'all 0.15s',
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>

            {selectedRole === OTHER_SENTINEL && (
              <div style={{ marginTop: 12 }}>
                <input
                  className="field"
                  placeholder="e.g. Paramedic"
                  value={customRole}
                  maxLength={15}
                  onChange={e => setCustomRole(e.target.value)}
                  autoFocus
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  {otherIsEmpty ? (
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
                      Enter your role, or choose &ldquo;No role&rdquo; above
                    </span>
                  ) : (
                    <span />
                  )}
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
                    {customRole.length}/15
                  </span>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div style={{ fontSize: 13, color: '#ff6b6b', padding: '8px 12px', background: 'rgba(255,107,107,0.1)', borderRadius: 6 }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <button
              className="amber-btn"
              style={{ flex: 1, padding: 15 }}
              onClick={() => onSubmit(firstName, lastName, resolvedJobRole)}
              disabled={saveDisabled}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            {mode === 'prompt' ? (
              <button
                className="ghost-btn"
                style={{ padding: '15px 18px' }}
                onClick={() => onSubmit(firstName, lastName, null)}
                disabled={saving || nameEmpty}
              >
                Skip for now
              </button>
            ) : (
              <button
                className="ghost-btn"
                style={{ padding: '15px 18px' }}
                onClick={onClose}
                disabled={saving}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
