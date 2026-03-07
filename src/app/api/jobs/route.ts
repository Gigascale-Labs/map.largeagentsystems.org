import { jsonWithCache } from '@/lib/api'
import { getJobs } from '@/lib/data/jobs'

export type { Job } from '@/lib/data/jobs'

export async function GET() {
  const records = await getJobs()

  return jsonWithCache({
    records,
    count: records.length,
  })
}
