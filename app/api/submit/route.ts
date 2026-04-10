import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
)

const KM_TO_MILES = 0.621371
const MAX_DISTANCE_MILES = 200

type DistanceUnit = 'MI' | 'KM'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, trust, activity_type, distance_miles, distance_unit } = body
  const unit: DistanceUnit = distance_unit === 'KM' ? 'KM' : 'MI'
  const rawDistance = Number(distance_miles)
  const distanceMiles = unit === 'KM' ? rawDistance * KM_TO_MILES : rawDistance

  if (!name || !trust || !activity_type || !Number.isFinite(rawDistance)) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  if (distanceMiles <= 0 || distanceMiles > MAX_DISTANCE_MILES) {
    return NextResponse.json({ error: 'Invalid distance' }, { status: 400 })
  }

  const { error } = await supabase
    .from('miles_submissions')
    .insert({
      name: name.trim(),
      trust,
      activity_type,
      distance_miles: Math.round(distanceMiles * 100) / 100,
    })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
