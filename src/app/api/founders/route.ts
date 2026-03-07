import { jsonWithCache } from '@/lib/api'
import { getFounderResources } from '@/lib/data/founders'

export type { FounderResource } from '@/lib/data/founders'

export async function GET() {
  const records = await getFounderResources()

  return jsonWithCache({
    records,
    count: records.length,
  })
}
