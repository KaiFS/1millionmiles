import { NextRequest, NextResponse } from 'next/server'
import {
  convertToMiles,
  formatProofPath,
  isAllowedProofMimeType,
  MAX_DISTANCE_MILES,
  MAX_PROOF_FILE_BYTES,
  PROOF_BUCKET,
  type DistanceUnit,
} from '@/lib/challenge'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { getUserDisplayName } from '@/lib/user-display'

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const formData = await req.formData()
  const providedName = String(formData.get('name') ?? '').trim()
  const trust = String(formData.get('trust') ?? '').trim()
  const activity_type = String(formData.get('activity_type') ?? '').trim()
  const distance_miles = String(formData.get('distance_miles') ?? '')
  const distance_unit = String(formData.get('distance_unit') ?? 'MI')
  const proof = formData.get('proof')
  const unit: DistanceUnit = distance_unit === 'KM' ? 'KM' : 'MI'
  const rawDistance = Number(distance_miles)
  const distanceMiles = convertToMiles(rawDistance, unit)
  const {
    data: { user },
  } = await supabase.auth.getUser()
  let profile = null

  if (user) {
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select('first_name, last_name')
      .eq('user_id', user.id)
      .maybeSingle()

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    profile = profileData
  }

  const name = user ? getUserDisplayName(user, profile) : providedName

  if (!name || !trust || !activity_type || !Number.isFinite(rawDistance)) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  if (distanceMiles <= 0 || distanceMiles > MAX_DISTANCE_MILES) {
    return NextResponse.json({ error: 'Invalid distance' }, { status: 400 })
  }

  let proofPath: string | null = null
  let proofUploadWarning: string | null = null

  if (proof instanceof File) {
    if (!user) {
      return NextResponse.json({ error: 'Sign in with Google to upload proof screenshots.' }, { status: 401 })
    }

    if (!isAllowedProofMimeType(proof.type)) {
      return NextResponse.json({ error: 'Proof must be a PNG, JPG, or WEBP image.' }, { status: 400 })
    }

    if (proof.size > MAX_PROOF_FILE_BYTES) {
      return NextResponse.json({ error: 'Proof image must be 10MB or smaller.' }, { status: 400 })
    }

    proofPath = formatProofPath(user.id, proof.type)

    const { error: uploadError } = await supabase.storage
      .from(PROOF_BUCKET)
      .upload(proofPath, await proof.arrayBuffer(), {
        contentType: proof.type,
        upsert: false,
      })

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }
  }

  const submissionId = crypto.randomUUID()
  const { error } = await supabase
    .from('miles_submissions')
    .insert({
      id: submissionId,
      name,
      user_id: user?.id ?? null,
      trust,
      activity_type,
      distance_miles: Math.round(distanceMiles * 100) / 100,
    })

  if (error) {
    if (proofPath) {
      await supabase.storage.from(PROOF_BUCKET).remove([proofPath])
    }

    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (proof instanceof File && proofPath) {
    if (user) {
      const { error: proofError } = await supabase.from('submission_proofs').insert({
        submission_id: submissionId,
        user_id: user.id,
        storage_path: proofPath,
        mime_type: proof.type,
        size_bytes: proof.size,
      })

      if (proofError) {
        proofUploadWarning = 'Miles were logged, but the proof screenshot could not be attached.'
        await supabase.storage.from(PROOF_BUCKET).remove([proofPath])
      }
    }
  }

  return NextResponse.json({ success: true, warning: proofUploadWarning })
}
