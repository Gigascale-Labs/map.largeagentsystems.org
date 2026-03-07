import { jsonWithCache } from '@/lib/api'
import { getMapData } from '@/lib/data/map'

export type { MapOrg } from '@/lib/data/map'

export async function GET() {
  const { records, lastUpdated } = await getMapData()

  return jsonWithCache({
    records,
    lastUpdated,
    count: records.length,
  })
}
