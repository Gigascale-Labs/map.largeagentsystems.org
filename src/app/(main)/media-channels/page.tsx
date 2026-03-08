import LastUpdated from '@/components/LastUpdated'
import FeaturedCard from '@/components/FeaturedCard'
import MediaChannelsClient from './MediaChannelsClient'
import { getMediaChannels } from '@/lib/data/media-channels'

export const metadata = {
  title: 'Media Channels – AISafety.com',
  description:
    'Information sources to help you learn more about AI safety and stay up to date.',
}

export default async function MediaChannelsPage() {
  const channels = await getMediaChannels()

  return (
    <div className="container-default">
      <h1 className="padding-top-56px padding-bottom-8px">Media channels</h1>
      <LastUpdated
        apiEndpoint="/api/last-updated/media-channels"
        className="paragraph-small color-teal-300 margin-bottom-40px"
      />
      <h2 className="width-7-col margin-bottom-56px">
        <span className="color-light-teal">
          The AI safety space is changing rapidly.
        </span>{' '}
        These information sources can help you learn more and stay up to date.
      </h2>

      {/* Featured Cards + Related Resources */}
      <div className="flex flex-col-mobile gap-56px padding-bottom-80px">
        <div className="flex flex-col-mobile gap-40px">
          <FeaturedCard
            href="https://thezvi.substack.com/"
            tagline="Top blog recommendation"
            name="Don't Worry About the Vase"
            description="Zvi Mowshowitz's blog covering AI developments, policy, and safety with detailed analysis and commentary."
            logo="/images/blue-dot-impact.svg"
            metadata={[{ label: 'Type', value: 'Blog' }]}
          />
          <FeaturedCard
            href="https://www.youtube.com/playlist?list=PLWQikawCP4UFM_ziLf9X2rcOLCSbqisRE"
            tagline="Top recommended videos"
            name="AI Safety Playlist"
            description="A carefully curated and regularly updated YouTube playlist to help people gain an understanding of what's going on with AI."
            logo="/images/YouTube.png"
            metadata={[{ label: 'Type', value: 'YouTube' }]}
          />
        </div>

        <aside className="hide-mobile">
          <p className="paragraph-small-bold padding-bottom-32px">
            Related resource
          </p>
          <a
            href="https://aisafety.info"
            target="_blank"
            rel="noopener noreferrer"
            className="block hover-opacity-80"
          >
            <h3 className="padding-bottom-16px">
              AISafety.info <span className="color-teal-400">&rarr;</span>
            </h3>
            <p className="paragraph-small color-teal-300">
              A comprehensive FAQ on various AI safety topics, written and
              curated by our team and affiliates
            </p>
          </a>
        </aside>
      </div>

      {/* Main Content with Search, Cards, and Filters */}
      <MediaChannelsClient channels={channels} />
    </div>
  )
}
