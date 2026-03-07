import { jsonWithCache } from '@/lib/api'
import { getMediaChannels } from '@/lib/data/media-channels'

export type { MediaChannel } from '@/lib/data/media-channels'

export async function GET() {
  const records = await getMediaChannels()

  return jsonWithCache({
    records,
    count: records.length,
  })
}
