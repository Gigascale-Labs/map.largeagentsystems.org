import { jsonWithCache } from '@/lib/api'
import { getFunders } from '@/lib/data/funding'

export type { Funder } from '@/lib/data/funding'

export async function GET() {
  const records = await getFunders()

  return jsonWithCache({
    records,
    count: records.length,
  })
}
