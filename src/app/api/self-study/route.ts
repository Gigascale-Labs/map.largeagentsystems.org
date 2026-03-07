import { jsonWithCache } from '@/lib/api'
import { getCourses } from '@/lib/data/self-study'

export type { Course } from '@/lib/data/self-study'

export async function GET() {
  const records = await getCourses()

  return jsonWithCache({
    records,
    count: records.length,
  })
}
