'use client'

/* eslint-disable @next/next/no-img-element */

import type { ProofItem } from '@/app/_lib/dashboard-types'
import { formatTrustName } from '@/app/_lib/dashboard-utils'

type ProofModalProps = {
  proof: ProofItem
  onClose: () => void
}

export default function ProofModal({ proof, onClose }: ProofModalProps) {
  return (
    <div className="overlay" onClick={event => { if (event.target === event.currentTarget) onClose() }}>
      <div
        className="card fade-in"
        style={{
          width: 'min(1100px, calc(100vw - 24px))',
          maxHeight: 'calc(100vh - 24px)',
          padding: 16,
          background: '#0d1424',
          border: '1px solid rgba(255,255,255,0.12)',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 16, marginBottom: 14, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-bebas-neue), sans-serif', fontSize: 28, letterSpacing: 2 }}>{proof.name}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>
              {proof.activity_type} · {proof.distance_miles} mi · {formatTrustName(proof.trust)}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.45)', fontSize: 24, cursor: 'pointer', padding: 4, lineHeight: 1 }}
          >
            ✕
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', maxHeight: 'calc(100vh - 160px)', overflow: 'auto', borderRadius: 12, background: '#08111f' }}>
          <img
            src={proof.proof_url}
            alt={`${proof.name} ${proof.activity_type} proof full size`}
            loading="lazy"
            decoding="async"
            style={{ maxWidth: '100%', maxHeight: 'calc(100vh - 180px)', width: 'auto', height: 'auto', display: 'block', objectFit: 'contain' }}
          />
        </div>
      </div>
    </div>
  )
}
