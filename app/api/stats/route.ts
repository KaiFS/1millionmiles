import { NextResponse } from 'next/server'
import { getStats, STATS_CACHE_SECONDS, STATS_STALE_SECONDS } from '@/app/_lib/get-stats.server'

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
