import { jsonWithCache } from '@/lib/api'
import { getCommunities } from '@/lib/data/communities'

export type { Community } from '@/lib/data/communities'

export async function GET() {
  const communities = await getCommunities()

  return jsonWithCache({
    communities,
    count: communities.length,
  })
}
