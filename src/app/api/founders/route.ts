import { NextResponse } from 'next/server'
import { getFounderResources } from '@/lib/data/founders'

export type { FounderResource } from '@/lib/data/founders'

export async function GET() {
  const records = await getFounderResources()

  return NextResponse.json({
    records,
    count: records.length,
  })
}
