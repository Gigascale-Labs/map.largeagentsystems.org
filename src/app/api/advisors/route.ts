import { NextResponse } from 'next/server'
import { getAdvisors } from '@/lib/data/advisors'

export type { Advisor } from '@/lib/data/advisors'

export async function GET() {
  const records = await getAdvisors()

  return NextResponse.json({
    records,
    count: records.length,
  })
}
