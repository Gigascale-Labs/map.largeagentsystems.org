import { jsonWithCache } from '@/lib/api'
import { getAdvisors } from '@/lib/data/advisors'

export type { Advisor } from '@/lib/data/advisors'

export async function GET() {
  const records = await getAdvisors()

  return jsonWithCache({
    records,
    count: records.length,
  })
}
