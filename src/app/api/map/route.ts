import { NextResponse } from 'next/server'
import { jsonWithCache } from '@/lib/api'
import { getMapData } from '@/lib/data/map'

export type { MapOrg } from '@/lib/data/map'

export async function GET() {
  const { records, lastUpdated } = await getMapData()

  if (records.length === 0) {
    return NextResponse.json(
      { error: 'Failed to fetch map data' },
      { status: 500 }
    )
  }

  return jsonWithCache({
    records,
    lastUpdated,
    count: records.length,
  })
}
