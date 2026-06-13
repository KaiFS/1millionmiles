import { NextResponse } from 'next/server'
import { unstable_cache } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase-server'

async function getPersonalStats(userId: string) {
  const supabase = await createServerSupabaseClient()
  const { data: rpcData, error: rpcError } = await supabase.rpc('get_personal_stats', {
    target_user_id: userId,
  })

  if (!rpcError && rpcData) {
    return rpcData
  }

  const { data: allSubmissions, error: fetchError } = await supabase
    .from('miles_submissions')
    .select('user_id, distance_miles')

  if (fetchError) {
    throw new Error(fetchError.message)
  }

  const totalsByUser: Record<string, number> = {}
  allSubmissions?.forEach(row => {
    if (!row.user_id) return
    totalsByUser[row.user_id] = (totalsByUser[row.user_id] ?? 0) + row.distance_miles
  })

  const userTotal = totalsByUser[userId] ?? 0
  const sortedMiles = Object.values(totalsByUser).sort((a, b) => b - a)
  const rank = sortedMiles.findIndex(m => m === userTotal) + 1

  return {
    totalMiles: Math.round(userTotal * 10) / 10,
    rank: rank > 0 ? rank : null,
    totalParticipants: Object.keys(totalsByUser).length,
  }
}

export async function GET() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const personalStats = await unstable_cache(
      () => getPersonalStats(user.id),
      ['personal-stats', user.id],
      { revalidate: 60, tags: ['personal-stats', `personal-stats:${user.id}`] }
    )()

    return NextResponse.json(personalStats, {
      headers: {
        'Cache-Control': 'private, max-age=60',
      },
    })
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Could not load personal stats.',
    }, { status: 500 })
  }
}
