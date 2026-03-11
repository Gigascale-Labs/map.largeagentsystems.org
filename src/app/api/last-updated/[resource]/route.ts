import { NextResponse } from 'next/server'
import { fetchLastUpdated, validResources } from '@/lib/data/last-updated'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ resource: string }> }
) {
  const { resource } = await params

  if (!validResources.includes(resource)) {
    return NextResponse.json({ error: 'Unknown resource' }, { status: 404 })
  }

  return NextResponse.json(await fetchLastUpdated(resource))
}
