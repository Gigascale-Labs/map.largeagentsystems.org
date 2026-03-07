import { NextResponse } from 'next/server'
import { jsonWithCache } from '@/lib/api'
import { getProjects } from '@/lib/data/projects'

export type { Project } from '@/lib/data/projects'

export async function GET() {
  const records = await getProjects()

  if (records.length === 0) {
    return NextResponse.json(
      { error: 'Failed to fetch projects data' },
      { status: 500 }
    )
  }

  return jsonWithCache({
    records,
    count: records.length,
  })
}
