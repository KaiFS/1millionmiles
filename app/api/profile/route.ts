import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { PREDEFINED_ROLES } from '@/lib/roles'
import { getProfileDisplayName } from '@/lib/user-display'

function normalizeName(value: unknown) {
  return String(value ?? '').trim().replace(/\s+/g, ' ')
}

function resolveJobRole(raw: unknown): { role: string | null; error?: string } {
  // Branch 1: absent or null — dismiss path, role is optional
  if (raw === null || raw === undefined) return { role: null }

  const value = String(raw)

  // Branch 2: known predefined value — store as-is, skip sanitiser
  if ((PREDEFINED_ROLES as readonly string[]).includes(value)) return { role: value }

  // Branch 3: sentinel — client should never send the raw "other" string as a stored value
  if (value.toLowerCase() === 'other') {
    return { role: null, error: 'Invalid role value.' }
  }

  // Branch 4: custom free text — trim, collapse whitespace, strip non-[a-zA-Z0-9 -]
  const sanitized = value.trim().replace(/\s+/g, ' ').replace(/[^a-zA-Z0-9 -]/g, '').trim()
  if (!sanitized) {
    return { role: null, error: 'Role must contain at least one letter, number, space, or hyphen.' }
  }
  if (sanitized.length > 15) {
    return { role: null, error: 'Custom role must be 15 characters or fewer.' }
  }

  return { role: sanitized }
}

export async function GET() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('user_profiles')
    .select('first_name, last_name, job_role, role_prompted_at')
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    profile: data
      ? {
          first_name: data.first_name,
          last_name: data.last_name,
          job_role: data.job_role ?? null,
          role_prompted_at: data.role_prompted_at ?? null,
        }
      : null,
  })
}

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const firstName = normalizeName(body?.firstName)
  const lastName = normalizeName(body?.lastName)

  if (!firstName || !lastName) {
    return NextResponse.json({ error: 'Please enter your first and last name.' }, { status: 400 })
  }

  const { role, error: roleError } = resolveJobRole(body?.jobRole)
  if (roleError) {
    return NextResponse.json({ error: roleError }, { status: 400 })
  }

  // Read the prior name so the retroactive submission name-sync below only fires on a
  // genuine rename. existing is null on first-time creation → nameChanged false.
  const { data: existing } = await supabase
    .from('user_profiles')
    .select('first_name, last_name')
    .eq('user_id', user.id)
    .maybeSingle()

  const nameChanged = !!existing && (existing.first_name !== firstName || existing.last_name !== lastName)

  const { data, error } = await supabase
    .from('user_profiles')
    .upsert(
      { user_id: user.id, first_name: firstName, last_name: lastName, job_role: role },
      { onConflict: 'user_id' }
    )
    .select('first_name, last_name, job_role, role_prompted_at')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Set role_prompted_at exactly once. PostgreSQL row-locking makes this atomic:
  // a concurrent second POST re-evaluates WHERE after the first commits and finds
  // it non-null — the update becomes a no-op. The timestamp is never moved.
  await supabase
    .from('user_profiles')
    .update({ role_prompted_at: new Date().toISOString() })
    .eq('user_id', user.id)
    .is('role_prompted_at', null)

  if (nameChanged) {
    // Retroactive by design: rewrites the denormalised name on ALL of this user's past
    // submissions to their current name. Scoped to the authed user_id, so anonymous rows
    // (user_id is null) are never touched. The /api/stats 300s cache means the leaderboard
    // reflects this within minutes, not instantly — consistent with the rest of the board.
    await supabase
      .from('miles_submissions')
      .update({ name: getProfileDisplayName({ first_name: firstName, last_name: lastName }) })
      .eq('user_id', user.id)
  }

  // A profile save can change the name (synced above) or job_role (read live via the
  // leaderboard join). Bust the stats cache so the next fetch reflects it, mirroring submit.
  revalidateTag('dashboard-stats', { expire: 0 })

  // data.role_prompted_at is the pre-update value; if it was null we just set it.
  // Return a definite non-null value so needsRolePrompt() reads false immediately.
  return NextResponse.json({
    profile: {
      first_name: data.first_name,
      last_name: data.last_name,
      job_role: data.job_role ?? null,
      role_prompted_at: data.role_prompted_at ?? new Date().toISOString(),
    },
  })
}
