import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: allSubmissions, error } = await supabase
    .from('miles_submissions')
    .select('user_id, distance_miles')
    .not('user_id', 'is', null)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const byUser: Record<string, number> = {}
  for (const row of allSubmissions ?? []) {
    if (!row.user_id) continue
    byUser[row.user_id] = (byUser[row.user_id] ?? 0) + row.distance_miles
  }

  const userTotal = byUser[user.id] ?? 0
  const totalParticipants = Object.keys(byUser).length
  const rank = Object.values(byUser).filter(miles => miles > userTotal).length + 1

  return NextResponse.json({
    totalMiles: Math.round(userTotal * 10) / 10,
    rank,
    totalParticipants,
  })
}
