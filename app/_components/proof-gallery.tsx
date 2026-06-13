'use client'

/* eslint-disable @next/next/no-img-element */

import type { ProofItem } from '@/app/_lib/dashboard-types'
import { timeAgo } from '@/app/_lib/dashboard-utils'

type ProofGalleryProps = {
  proofs: ProofItem[]
  proofsLoading: boolean
  onSelectProof: (proof: ProofItem) => void
}

export default function ProofGallery({
  proofs,
  proofsLoading,
  onSelectProof,
}: ProofGalleryProps) {
  return (
    <div className="card fade-in" style={{ padding: 24, marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 18, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-bebas-neue), sans-serif', fontSize: 24, letterSpacing: 2 }}>Recent Submissions Gallery</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>
            Recent screenshot proofs shared by signed-in participants.
          </div>
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.28)', maxWidth: 320 }}>
          Screenshots are visible to signed-in users only. Please only upload images you are comfortable sharing inside the challenge.
        </div>
      </div>
      {proofsLoading ? (
        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Loading proof uploads...</div>
      ) : proofs.length === 0 ? (
        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>No proof screenshots uploaded yet.</div>
      ) : (
        <div className="proof-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16 }}>
          {proofs.map(proof => (
            <button
              key={proof.submission_id}
              className="card"
              type="button"
              onClick={() => onSelectProof(proof)}
              style={{ overflow: 'hidden', background: 'rgba(255,255,255,0.03)', padding: 0, textAlign: 'left', cursor: 'zoom-in' }}
            >
              <div style={{ aspectRatio: '16 / 10', background: '#08111f' }}>
                <img
                  src={proof.proof_url}
                  alt={`${proof.name} ${proof.activity_type} proof`}
                  loading="lazy"
                  decoding="async"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 8, marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{proof.name}</div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-dm-mono), monospace', fontSize: 13, color: '#ED8B00', whiteSpace: 'nowrap' }}>{proof.distance_miles} mi</div>
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>{proof.activity_type}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.24)' }}>Uploaded {timeAgo(proof.proof_uploaded_at)}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
