import { NextResponse } from 'next/server'
import { jsonWithCache } from '@/lib/api'
import { getCourses } from '@/lib/data/self-study'

export type { Course } from '@/lib/data/self-study'

export async function GET() {
  const records = await getCourses()

  if (records.length === 0) {
    return NextResponse.json(
      { error: 'Failed to fetch self-study data' },
      { status: 500 }
    )
  }

  return jsonWithCache({
    records,
    count: records.length,
  })
}
