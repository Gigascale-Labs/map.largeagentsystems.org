import { NextResponse } from 'next/server'
import { getAdvisors } from '@/lib/data/advisors'

export type { Advisor } from '@/lib/data/advisors'

export async function GET() {
  const records = await getAdvisors()

  if (records.length === 0) {
    return NextResponse.json(
      { error: 'Failed to fetch advisors data' },
      { status: 500 }
    )
  }

  return NextResponse.json({
    records,
    count: records.length,
  })
}
