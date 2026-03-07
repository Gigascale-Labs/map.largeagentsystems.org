import { NextResponse } from 'next/server'
import { getMediaChannels } from '@/lib/data/media-channels'

export type { MediaChannel } from '@/lib/data/media-channels'

export async function GET() {
  const records = await getMediaChannels()

  return NextResponse.json({
    records,
    count: records.length,
  })
}
