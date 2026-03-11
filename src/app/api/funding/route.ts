import { NextResponse } from 'next/server'
import { jsonWithCache } from '@/lib/api'
import { getFunders } from '@/lib/data/funding'

export type { Funder } from '@/lib/data/funding'

export async function GET() {
  const records = await getFunders()

  if (records.length === 0) {
    return NextResponse.json(
      { error: 'Failed to fetch funding data' },
      { status: 500 }
    )
  }

  return jsonWithCache({
    records,
    count: records.length,
  })
}
