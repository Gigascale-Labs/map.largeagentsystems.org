import LastUpdated from '@/components/LastUpdated'
import FeaturedCard from '@/components/FeaturedCard'
import ProjectsClient from './ProjectsClient'
import { getProjects } from '@/lib/data/projects'

export const metadata = {
  title: 'Volunteer Projects – AISafety.com',
  description:
    'Initiatives seeking your volunteer help, focused on supporting and improving the AI safety field.',
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="container-default">
      <h1 className="padding-top-56px padding-bottom-8px">
        Volunteer projects
      </h1>
      <LastUpdated
        apiEndpoint="/api/last-updated/projects"
        className="paragraph-small color-teal-300 margin-bottom-40px"
      />
      <h2 className="width-7-col margin-bottom-56px">
        Initiatives{' '}
        <span className="color-light-teal">seeking your volunteer help</span>.
        These projects are focused on supporting and improving the AI safety
        field.
      </h2>

      {/* Featured Cards + Related Resources */}
      <div className="flex flex-col-mobile gap-56px padding-bottom-80px">
        <div className="flex flex-col-mobile gap-40px">
          <FeaturedCard
            href="https://huggingface.co/datasets/StampyAI/alignment-research-dataset"
            tagline="Seeking maintainer"
            name="Alignment Research Dataset"
            description='Regularly scrapes all major sources of alignment data for use by the AI Safety Chatbot and other projects. Currently needs someone to maintain it. Search "alignment research dataset" on Hugging Face for details.'
            metadata={[
              { label: 'Contact', value: 'Olivier Coutu' },
              { label: 'Status', value: 'Active' },
            ]}
          />
          <FeaturedCard
            href="https://aisafetyfeed.com/"
            tagline="Content curation platform"
            name="AI Safety Feed"
            description="A curated stream for AI safety content, gathering posts and research from key sources. AI helps summarize, tag, and rate content for novelty, letting users quickly find what's important and relevant to them."
            metadata={[
              { label: 'Contact', value: 'Matt Brooks' },
              { label: 'Status', value: 'Active' },
            ]}
          />
        </div>

        <aside className="hide-mobile">
          <p className="paragraph-small-bold padding-bottom-32px">
            Related resources
          </p>
          <a
            href="https://discord.com/invite/BfwQq2FTqE"
            target="_blank"
            rel="noopener noreferrer"
            className="block hover-opacity-80"
          >
            <h3 className="padding-bottom-16px">
              AED Discord <span className="color-teal-400">&rarr;</span>
            </h3>
            <p className="paragraph-small color-teal-300">
              A hub connecting AI safety volunteers and projects
            </p>
          </a>
        </aside>
      </div>

      {/* Main Content with Search, Cards, and Filters */}
      <ProjectsClient projects={projects} />
    </div>
  )
}
