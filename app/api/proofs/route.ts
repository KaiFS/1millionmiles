import { NextResponse } from 'next/server'
import { PROOF_BUCKET } from '@/lib/challenge'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import type { SupabaseClient } from '@supabase/supabase-js'

type ProofRow = {
  submission_id: string
  storage_path: string
  created_at: string
}

type SubmissionRow = {
  id: string
  name: string
  trust: string
  activity_type: string
  distance_miles: number
  created_at: string
}

const SIGNED_URL_TTL = 60 * 60 * 24 * 7 // 7 days
const CACHE_TTL_MS = 6 * 24 * 60 * 60 * 1000 // 6 days (refresh 1 day before expiry)

// Persists across requests within the same Node.js process instance
const urlCache = new Map<string, { url: string; expiresAt: number }>()

async function getCachedSignedUrl(supabase: SupabaseClient, path: string): Promise<string | null> {
  const cached = urlCache.get(path)
  if (cached && cached.expiresAt > Date.now()) {
    return cached.url
  }

  const { data } = await supabase.storage.from(PROOF_BUCKET).createSignedUrl(path, SIGNED_URL_TTL)
  if (!data?.signedUrl) return null

  urlCache.set(path, { url: data.signedUrl, expiresAt: Date.now() + CACHE_TTL_MS })
  return data.signedUrl
}

export async function GET() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: proofs, error: proofsError } = await supabase
    .from('submission_proofs')
    .select('submission_id, storage_path, created_at')
    .order('created_at', { ascending: false })
    .limit(6)

  if (proofsError) {
    return NextResponse.json({ error: proofsError.message }, { status: 500 })
  }

  const proofRows = (proofs ?? []) as ProofRow[]
  const submissionIds = proofRows.map(proof => proof.submission_id)

  if (submissionIds.length === 0) {
    return NextResponse.json({ proofs: [] }, {
      headers: { 'Cache-Control': 'private, max-age=86400' },
    })
  }

  const { data: submissions, error: submissionsError } = await supabase
    .from('miles_submissions')
    .select('id, name, trust, activity_type, distance_miles, created_at')
    .in('id', submissionIds)

  if (submissionsError) {
    return NextResponse.json({ error: submissionsError.message }, { status: 500 })
  }

  const submissionMap = new Map(
    ((submissions ?? []) as SubmissionRow[]).map(submission => [submission.id, submission])
  )

  const signedUrls = await Promise.all(
    proofRows.map(proof =>
      proof.storage_path.startsWith('https://')
        ? proof.storage_path
        : getCachedSignedUrl(supabase, proof.storage_path)
    )
  )

  const items = proofRows
    .map((proof, index) => {
      const submission = submissionMap.get(proof.submission_id)
      const signedUrl = signedUrls[index]

      if (!submission || !signedUrl) {
        return null
      }

      return {
        submission_id: proof.submission_id,
        proof_uploaded_at: proof.created_at,
        proof_url: signedUrl,
        ...submission,
      }
    })
    .filter(Boolean)

  return NextResponse.json({ proofs: items }, {
    headers: { 'Cache-Control': 'private, max-age=86400' },
  })
}
