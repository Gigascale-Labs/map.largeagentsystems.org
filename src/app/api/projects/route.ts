import { NextResponse } from 'next/server'
import { getProjects } from '@/lib/data/projects'

export type { Project } from '@/lib/data/projects'

export async function GET() {
  const records = await getProjects()

  return NextResponse.json({
    records,
    count: records.length,
  })
}
