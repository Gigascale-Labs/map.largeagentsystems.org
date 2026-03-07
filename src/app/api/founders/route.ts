import { NextResponse } from 'next/server'
import { jsonWithCache } from '@/lib/api'
import { getFounderResources } from '@/lib/data/founders'

export type { FounderResource } from '@/lib/data/founders'

export async function GET() {
  const records = await getFounderResources()

  if (records.length === 0) {
    return NextResponse.json(
      { error: 'Failed to fetch founders data' },
      { status: 500 }
    )
  }

  return jsonWithCache({
    records,
    count: records.length,
  })
}
