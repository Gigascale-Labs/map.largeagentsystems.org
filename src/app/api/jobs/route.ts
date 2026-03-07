import { NextResponse } from 'next/server'
import { jsonWithCache } from '@/lib/api'
import { getJobs } from '@/lib/data/jobs'

export type { Job } from '@/lib/data/jobs'

export async function GET() {
  const records = await getJobs()

  if (records.length === 0) {
    return NextResponse.json(
      { error: 'Failed to fetch jobs data' },
      { status: 500 }
    )
  }

  return jsonWithCache({
    records,
    count: records.length,
  })
}
