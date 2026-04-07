import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
)

export async function GET() {
  // Total miles
  const { data: totalData } = await supabase
    .from('miles_submissions')
    .select('distance_miles')

  const totalMiles = totalData?.reduce((sum, row) => sum + row.distance_miles, 0) ?? 0

  // Participant count (distinct names as proxy — in prod use auth user ids)
  const { data: participantData } = await supabase
    .from('miles_submissions')
    .select('name')

  const uniqueParticipants = new Set(participantData?.map(r => r.name) ?? []).size

  // Top contributors
  const { data: allSubmissions } = await supabase
    .from('miles_submissions')
    .select('name, trust, distance_miles')

  const byPerson: Record<string, { miles: number; trust: string }> = {}
  allSubmissions?.forEach(row => {
    if (!byPerson[row.name]) byPerson[row.name] = { miles: 0, trust: row.trust }
    byPerson[row.name].miles += row.distance_miles
  })
  const leaderboard = Object.entries(byPerson)
    .map(([name, d]) => ({ name, miles: Math.round(d.miles * 10) / 10, trust: d.trust }))
    .sort((a, b) => b.miles - a.miles)
    .slice(0, 6)

  // By trust
  const byTrust: Record<string, number> = {}
  allSubmissions?.forEach(row => {
    byTrust[row.trust] = (byTrust[row.trust] ?? 0) + row.distance_miles
  })
  const trusts = Object.entries(byTrust)
    .map(([name, miles]) => ({ name, miles: Math.round(miles) }))
    .sort((a, b) => b.miles - a.miles)
    .slice(0, 5)

  // Recent activity (last 10)
  const { data: recent } = await supabase
    .from('miles_submissions')
    .select('name, trust, activity_type, distance_miles, created_at')
    .order('created_at', { ascending: false })
    .limit(10)

  return NextResponse.json({
    totalMiles: Math.round(totalMiles * 10) / 10,
    participantCount: uniqueParticipants,
    leaderboard,
    trusts,
    recent: recent ?? [],
  })
}
