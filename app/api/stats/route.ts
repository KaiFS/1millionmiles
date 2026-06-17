import { createClient } from '@supabase/supabase-js'
import { unstable_cache } from 'next/cache'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
)

const STATS_CACHE_SECONDS = 300
const STATS_STALE_SECONDS = 900

type DashboardStats = {
  totalMiles: number
  participantCount: number
  leaderboard: { name: string; miles: number; trust: string }[]
  trusts: { name: string; miles: number }[]
  recent: { name: string; trust: string; activity_type: string; distance_miles: number; created_at: string }[]
}

const getStats = unstable_cache(
  async (): Promise<DashboardStats> => {
    const { data: rpcData, error: rpcError } = await supabase.rpc('get_dashboard_stats')

    if (!rpcError && rpcData) {
      return rpcData as DashboardStats
    }

    const { data: allSubmissions, error: fallbackError } = await supabase
      .from('miles_submissions')
      .select('user_id, name, trust, distance_miles')

    if (fallbackError) {
      throw new Error(`Database unavailable: ${fallbackError.message}`)
    }

    const totalMiles = allSubmissions?.reduce((sum, row) => sum + row.distance_miles, 0) ?? 0
    const uniqueParticipants = new Set(allSubmissions?.map(r => r.user_id).filter(Boolean) ?? []).size

    const byUser: Record<string, { miles: number; name: string; trust: string }> = {}
    allSubmissions?.forEach(row => {
      if (!row.user_id) return
      if (!byUser[row.user_id]) {
        byUser[row.user_id] = { miles: 0, name: row.name, trust: row.trust }
      }
      byUser[row.user_id].miles += row.distance_miles
    })
    const leaderboard = Object.values(byUser)
      .map(d => ({ name: d.name, miles: Math.round(d.miles * 10) / 10, trust: d.trust }))
      .sort((a, b) => b.miles - a.miles)
      .slice(0, 10)

    const byTrust: Record<string, number> = {}
    allSubmissions?.forEach(row => {
      byTrust[row.trust] = (byTrust[row.trust] ?? 0) + row.distance_miles
    })
    const trusts = Object.entries(byTrust)
      .map(([name, miles]) => ({ name, miles: Math.round(miles) }))
      .sort((a, b) => b.miles - a.miles)
      .slice(0, 5)

    const { data: recent } = await supabase
      .from('miles_submissions')
      .select('name, trust, activity_type, distance_miles, created_at')
      .order('created_at', { ascending: false })
      .limit(10)

    return {
      totalMiles: Math.round(totalMiles * 10) / 10,
      participantCount: uniqueParticipants,
      leaderboard,
      trusts,
      recent: recent ?? [],
    }
  },
  ['dashboard-stats'],
  { revalidate: STATS_CACHE_SECONDS, tags: ['dashboard-stats'] }
)

export async function GET() {
  try {
    return NextResponse.json(await getStats(), {
      headers: {
        'Cache-Control': `public, max-age=${STATS_CACHE_SECONDS}, s-maxage=${STATS_CACHE_SECONDS}, stale-while-revalidate=${STATS_STALE_SECONDS}`,
      },
    })
  } catch {
    return NextResponse.json(
      { error: 'Stats temporarily unavailable' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    )
  }
}
