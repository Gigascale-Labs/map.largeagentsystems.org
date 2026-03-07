import { NextResponse } from 'next/server'

export function jsonWithCache<T>(data: T) {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
    },
  })
}
