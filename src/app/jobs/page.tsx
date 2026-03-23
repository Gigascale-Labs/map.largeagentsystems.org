import { fetchLastUpdated } from '@/lib/data/last-updated'
import JobsClient from './JobsClient'
import { getJobs } from '@/lib/data/jobs'

export const metadata = {
  title: 'Jobs – AISafety.com',
  description:
    "AI safety career opportunities. Many roles don't require technical skills.",
}

export default async function JobsPage() {
  const [jobs, lastUpdated] = await Promise.all([
    getJobs(),
    fetchLastUpdated('jobs'),
  ])

  return (
    <div className="container-default">
      <h1 className="padding-top-56px padding-bottom-8px">Jobs</h1>
      {lastUpdated.formattedDate && (
        <p className="paragraph-small color-teal-300 margin-bottom-40px">
          Last updated: {lastUpdated.formattedDate}
        </p>
      )}
      <h2 className="width-7-col margin-bottom-56px">
        Pursuing a career in AI safety can be{' '}
        <span className="color-light-teal">one of the most impactful ways</span>{' '}
        to contribute. Many roles don&apos;t require technical skills.
      </h2>

      {/* Main Content with Search, Cards, and Filters */}
      <JobsClient jobs={jobs} />
    </div>
  )
}
