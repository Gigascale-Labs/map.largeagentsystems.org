import { jsonWithCache } from '@/lib/api'
import { getProjects } from '@/lib/data/projects'

export type { Project } from '@/lib/data/projects'

export async function GET() {
  const records = await getProjects()

  return jsonWithCache({
    records,
    count: records.length,
  })
}
