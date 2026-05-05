import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

function normalizeName(value: unknown) {
  return String(value ?? '').trim().replace(/\s+/g, ' ')
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
    .select('first_name, last_name')
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

  const { data, error } = await supabase
    .from('user_profiles')
    .upsert(
      {
        user_id: user.id,
        first_name: firstName,
        last_name: lastName,
      },
      { onConflict: 'user_id' }
    )
    .select('first_name, last_name')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    profile: {
      first_name: data.first_name,
      last_name: data.last_name,
    },
  })
}
