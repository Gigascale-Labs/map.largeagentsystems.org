import { NextResponse } from 'next/server'
import { getCommunities } from '@/lib/data/communities'

export type { Community } from '@/lib/data/communities'

export async function GET() {
  const communities = await getCommunities()

  return NextResponse.json({
    communities,
    count: communities.length,
  })
}
