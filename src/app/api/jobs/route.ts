import { NextResponse } from 'next/server'
import { getJobs } from '@/lib/data/jobs'

export type { Job } from '@/lib/data/jobs'

export async function GET() {
  const records = await getJobs()

  return NextResponse.json({
    records,
    count: records.length,
  })
}
