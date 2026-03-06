import Link from 'next/link'
import LastUpdated from '@/components/LastUpdated'
import FeaturedCard from '@/components/FeaturedCard'
import SelfStudyClient from './SelfStudyClient'
import { getCourses } from '@/lib/data/self-study'

export const metadata = {
  title: 'Self-study – AISafety.com',
  description:
    'Curricula and reading lists to dive deeper into AI safety through independent learning.',
}

export default async function SelfStudyPage() {
  const courses = await getCourses()

  return (
    <div className="container-default">
      <h1 className="padding-top-56px padding-bottom-8px">Self-study</h1>
      <LastUpdated
        apiEndpoint="/api/last-updated/self-study"
        className="paragraph-small color-teal-300 margin-bottom-40px"
      />
      <h2 className="width-7-col margin-bottom-56px">
        These curricula and reading lists enable you to{' '}
        <span className="color-light-teal">dive deeper into AI safety </span>
        through independent learning.
      </h2>

      {/* Featured Cards + Related Resources */}
      <div className="flex flex-col-mobile gap-56px padding-bottom-80px">
        <div className="flex flex-col-mobile gap-40px">
          <FeaturedCard
            href="https://www.alignmentforum.org/library"
            tagline="Fundamental reading"
            name="AI Alignment Forum: Curated Sequences"
            description="List of sequences curated by the AI Alignment Forum team, featuring work from Richard Ngo, Paul Christiano, etc."
            logo="/images/2.png"
            metadata={[
              { label: 'Category', value: 'Technical Alignment' },
              { label: 'Created by', value: 'Various' },
            ]}
          />
          <FeaturedCard
            href="https://bluedot.org/courses"
            tagline="Standard introductory courses"
            name="BlueDot Impact: Technical & Governance"
            description="Covers key concepts and research perspectives in AI safety, split into two main streams: Technical AI Safety and AI Governance."
            logo="/images/download-2.svg"
            metadata={[
              { label: 'Category', value: 'Technical Alignment, Governance' },
              { label: 'Created by', value: 'BlueDot Impact' },
            ]}
          />
        </div>

        <aside className="hide-mobile">
          <p className="paragraph-small-bold padding-bottom-32px">
            Related resources
          </p>
          <Link
            href="/events-and-training"
            className="block padding-bottom-40px hover-opacity-80"
          >
            <h3 className="padding-bottom-16px">
              Events &amp; training{' '}
              <span className="color-teal-400">&rarr;</span>
            </h3>
            <p className="paragraph-small color-teal-300">
              Upcoming fellowships, conferences, facilitated courses etc.
            </p>
          </Link>
          <a
            href="https://theaidigest.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="block hover-opacity-80"
          >
            <h3 className="padding-bottom-16px">
              AI Digest <span className="color-teal-400">&rarr;</span>
            </h3>
            <p className="paragraph-small color-teal-300">
              Interactive explainers of AI capabilities and trends
            </p>
          </a>
        </aside>
      </div>

      {/* Main Content with Search, Cards, and Filters */}
      <SelfStudyClient courses={courses} />
    </div>
  )
}
