import Link from 'next/link'
import LastUpdated from '@/components/LastUpdated'
import FeaturedCard from '@/components/FeaturedCard'
import FoundersClient from './FoundersClient'
import { getFounderResources } from '@/lib/data/founders'

export const metadata = {
  title: 'Founder Toolkit – AISafety.com',
  description:
    'Resources for starting and growing an AI safety organization, including incubators, fiscal sponsors, VCs, and practical tools.',
}

export default async function FoundersPage() {
  const resources = await getFounderResources()

  return (
    <div className="container-default">
      <h1 className="padding-top-56px padding-bottom-8px">Founder Toolkit</h1>
      <LastUpdated
        apiEndpoint="/api/last-updated/founders"
        className="paragraph-small color-teal-300 margin-bottom-40px"
      />
      <h2 className="width-7-col margin-bottom-56px">
        Resources for{' '}
        <span className="color-light-teal">starting and growing</span> an AI
        safety organization – including incubators, fiscal sponsors, VCs, and
        practical tools.
      </h2>

      {/* Featured Cards + Related Resources */}
      <div className="flex flex-col-mobile gap-56px padding-bottom-80px">
        <div className="flex flex-col-mobile gap-40px">
          <FeaturedCard
            href="https://beacongcr.org/"
            tagline="Featured fiscal sponsor"
            name="Beacon"
            description="Fiscal sponsorship, administrative support, and bureaucracy shielding for researchers safeguarding humanity from catastrophic risk."
            logo="/images/beacon-logo.webp"
            metadata={[{ label: 'Type', value: 'Fiscal sponsor' }]}
          />
          <FeaturedCard
            href="https://www.catalyze-impact.org/"
            tagline="Featured incubator"
            name="Catalyze Impact"
            description="Incubating early-stage AI safety research organizations. The program involves co-founder matching, mentorship, and seed funding, culminating in an in-person building phase."
            logo="/images/catalyze-impact-logo.png"
            metadata={[{ label: 'Type', value: 'Incubator' }]}
          />
        </div>

        <aside className="hide-mobile">
          <p className="paragraph-small-bold padding-bottom-32px">
            Related resources
          </p>
          <Link
            href="/funding"
            className="block padding-bottom-40px hover-opacity-80"
          >
            <h3 className="padding-bottom-16px">
              Funding <span className="color-teal-400">&rarr;</span>
            </h3>
            <p className="paragraph-small color-teal-300">
              Organizations offering financial support to AI safety projects and
              individuals
            </p>
          </Link>
          <Link href="/events-and-training" className="block hover-opacity-80">
            <h3 className="padding-bottom-16px">
              Events &amp; Training{' '}
              <span className="color-teal-400">&rarr;</span>
            </h3>
            <p className="paragraph-small color-teal-300">
              Upcoming fellowships, conferences, facilitated courses etc.
            </p>
          </Link>
        </aside>
      </div>

      {/* Main Content with Search, Cards, and Filters */}
      <FoundersClient resources={resources} />
    </div>
  )
}
