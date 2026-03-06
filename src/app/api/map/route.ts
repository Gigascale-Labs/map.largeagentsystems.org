import { NextResponse } from 'next/server'
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

  return NextResponse.json({
    records,
    lastUpdated,
    count: records.length,
  })
}
