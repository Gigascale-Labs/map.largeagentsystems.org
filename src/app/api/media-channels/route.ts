import { NextResponse } from 'next/server'
import { getMediaChannels } from '@/lib/data/media-channels'

export type { MediaChannel } from '@/lib/data/media-channels'

export async function GET() {
  const records = await getMediaChannels()

  if (records.length === 0) {
    return NextResponse.json(
      { error: 'Failed to fetch media channels data' },
      { status: 500 }
    )
  }

  return NextResponse.json({
    records,
    count: records.length,
  })
}
