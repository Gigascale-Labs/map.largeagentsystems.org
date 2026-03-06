import { NextResponse } from 'next/server'
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

  return NextResponse.json({
    records,
    count: records.length,
  })
}
