import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
)

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, trust, activity_type, distance_miles } = body

  if (!name || !trust || !activity_type || !distance_miles) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  if (distance_miles <= 0 || distance_miles > 200) {
    return NextResponse.json({ error: 'Invalid distance' }, { status: 400 })
  }

  const { error } = await supabase
    .from('miles_submissions')
    .insert({ name: name.trim(), trust, activity_type, distance_miles: Number(distance_miles) })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
