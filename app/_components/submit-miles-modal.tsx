'use client'

import { KM_TO_MILES, MAX_PROOF_FILE_BYTES } from '@/lib/challenge'
import type { DashboardFormState } from '@/app/_lib/dashboard-types'
import { formatFileSize } from '@/app/_lib/dashboard-utils'

type SubmitMilesModalProps = {
  form: DashboardFormState
  proofFile: File | null
  convertedMiles: number
  signedIn: boolean
  nameLocked: boolean
  submitting: boolean
  submitted: boolean
  submitWarning: string
  formError: string
  onClose: () => void
  onSubmit: () => void
  onProofSelected: (event: React.ChangeEvent<HTMLInputElement>) => void
  onFieldChange: <K extends keyof DashboardFormState>(field: K, value: DashboardFormState[K]) => void
}

export default function SubmitMilesModal({
  form,
  proofFile,
  convertedMiles,
  signedIn,
  nameLocked,
  submitting,
  submitted,
  submitWarning,
  formError,
  onClose,
  onSubmit,
  onProofSelected,
  onFieldChange,
}: SubmitMilesModalProps) {
  return (
    <div className="overlay" onClick={event => { if (event.target === event.currentTarget) onClose() }}>
      <div className="card fade-in" style={{ width: '100%', maxWidth: 460, padding: 32, background: '#0d1424', border: '1px solid rgba(255,255,255,0.12)', maxHeight: '90vh', overflowY: 'auto' }}>
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
            <div style={{ fontFamily: 'var(--font-bebas-neue), sans-serif', fontSize: 30, letterSpacing: 2, marginBottom: 8 }}>Miles Logged!</div>
            <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 15 }}>
              {submitWarning || 'Thanks for contributing to the challenge.'}
            </div>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 24 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-bebas-neue), sans-serif', fontSize: 26, letterSpacing: 2 }}>Log Your Miles</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>Add your activity to the collective total</div>
              </div>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', fontSize: 20, cursor: 'pointer', padding: 4, lineHeight: 1 }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 1.5, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Your Name</label>
                <input
                  className="field"
                  placeholder="e.g. Sarah Mitchell"
                  value={form.name}
                  onChange={event => onFieldChange('name', event.target.value)}
                  readOnly={nameLocked}
                />
                {nameLocked && (
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.28)', marginTop: 6 }}>
                    Your signed-in profile name is used automatically on every submission.
                  </div>
                )}
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 1.5, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Activity</label>
                <select className="field" value={form.activity_type} onChange={event => onFieldChange('activity_type', event.target.value)}>
                  <option value="">Select activity...</option>
                  {['Running', 'Walking', 'Cycling', 'Swimming', 'Hiking', 'Other'].map(activity => <option key={activity} value={activity}>{activity}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 1.5, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Distance</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 110px', gap: 10 }}>
                  <input
                    className="field"
                    type="number"
                    placeholder={form.distance_unit === 'KM' ? 'e.g. 10' : 'e.g. 6.2'}
                    min="0.1"
                    max={form.distance_unit === 'KM' ? '321.9' : '200'}
                    step="0.1"
                    value={form.distance_miles}
                    onChange={event => onFieldChange('distance_miles', event.target.value)}
                  />
                  <select
                    className="field"
                    value={form.distance_unit}
                    onChange={event => onFieldChange('distance_unit', event.target.value as DashboardFormState['distance_unit'])}
                  >
                    <option value="MI">MI</option>
                    <option value="KM">KM</option>
                  </select>
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.28)', marginTop: 6 }}>
                  {form.distance_unit === 'KM'
                    ? `Stored as ${convertedMiles > 0 ? convertedMiles.toFixed(2) : '0.00'} mi on the leaderboard.`
                    : `Leaderboard totals stay in miles. ${KM_TO_MILES} miles per kilometre is the conversion.`}
                </div>
              </div>
              {signedIn ? (
                <div>
                  <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 1.5, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Proof Screenshot (Optional)</label>
                  <input className="field" type="file" accept="image/jpeg,image/png,image/webp" onChange={onProofSelected} />
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.28)', marginTop: 6 }}>
                    Upload a screenshot from Strava, Garmin, Apple Fitness, or another tracker. PNG, JPG, or WEBP only, up to {formatFileSize(MAX_PROOF_FILE_BYTES)}.
                  </div>
                  {proofFile && (
                    <div style={{ marginTop: 8, padding: '10px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
                      {proofFile.name} · {formatFileSize(proofFile.size)}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>
                  Sign in with Google to attach an optional proof screenshot and browse the screenshot gallery.
                </div>
              )}
              {formError && <div style={{ fontSize: 13, color: '#ff6b6b', padding: '8px 12px', background: 'rgba(255,107,107,0.1)', borderRadius: 6 }}>{formError}</div>}
              <button className="amber-btn" style={{ width: '100%', padding: 15, marginTop: 4 }} onClick={onSubmit} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Miles →'}
              </button>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', textAlign: 'center' }}>
                Please sign in with Google to upload proof images. Strava integration coming soon.
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
