import { NextResponse } from 'next/server'
import { getFunders } from '@/lib/data/funding'

export type { Funder } from '@/lib/data/funding'

export async function GET() {
  const records = await getFunders()

  return NextResponse.json({
    records,
    count: records.length,
  })
}
