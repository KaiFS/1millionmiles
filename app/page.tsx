import DashboardClient from '@/app/_components/dashboard-client'
import { getStats } from '@/app/_lib/get-stats.server'
import type { Stats } from '@/app/_lib/dashboard-types'

export default async function Page() {
  let initialStats: Stats | null = null

  try {
    initialStats = await getStats()
  } catch {
    initialStats = null
  }

  return <DashboardClient initialStats={initialStats} />
}
