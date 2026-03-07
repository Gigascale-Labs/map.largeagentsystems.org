import { NextResponse } from 'next/server'
import { getMapData } from '@/lib/data/map'

export type { MapOrg } from '@/lib/data/map'

export async function GET() {
  const { records, lastUpdated } = await getMapData()

  return NextResponse.json({
    records,
    lastUpdated,
    count: records.length,
  })
}
