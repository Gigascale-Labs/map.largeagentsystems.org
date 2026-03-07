import { NextResponse } from 'next/server'
import { jsonWithCache } from '@/lib/api'
import { getCommunities } from '@/lib/data/communities'

export type { Community } from '@/lib/data/communities'

export async function GET() {
  const communities = await getCommunities()

  if (communities.length === 0) {
    return NextResponse.json(
      { error: 'Failed to fetch communities' },
      { status: 500 }
    )
  }

  return jsonWithCache({
    communities,
    count: communities.length,
  })
}
