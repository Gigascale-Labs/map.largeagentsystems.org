import { NextResponse } from 'next/server'
import { getCourses } from '@/lib/data/self-study'

export type { Course } from '@/lib/data/self-study'

export async function GET() {
  const records = await getCourses()

  return NextResponse.json({
    records,
    count: records.length,
  })
}
