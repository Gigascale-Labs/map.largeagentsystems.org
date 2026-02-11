import Link from 'next/link'
import Image from 'next/image'
import LastUpdated from '@/components/LastUpdated'
import CommunitiesClient from './CommunitiesClient'
import CommunitiesMap from './CommunitiesMap'
import styles from './page.module.css'
import { Community } from '../api/communities/route'

export const metadata = {
  title: 'Communities – AISafety.com',
  description:
    'Groups dedicated to discussing and contributing to AI safety, both online and in-person.',
}

const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN
const BASE_ID = process.env.AIRTABLE_BASE_ID
const TABLE_ID = 'tbluI5Dll697WiSm8'

interface AirtableRecord {
  id: string
  fields: {
    Name?: string
    Description?: string
    Logo?: Array<{ url: string }>
    Platform?: string[]
    'Platform wrangled'?: string
    Type?: string[]
    'Activity level'?: string
    Focus?: string
    'Join link'?: string
    Website?: string
    'Location (if in-person)'?: string
    Size?: string
    Sort?: number
    'Publish?'?: boolean
    Latitude?: number
    Longitude?: number
  }
}

async function getCommunities(): Promise<Community[]> {
  if (!AIRTABLE_TOKEN || !BASE_ID) {
    console.error('Airtable credentials not configured')
    return []
  }

  try {
    const allRecords: Community[] = []
    let offset: string | null = null

    do {
      const url = new URL(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`)
      url.searchParams.set('filterByFormula', '{Publish?} = TRUE()')
      url.searchParams.set('sort[0][field]', 'Sort')
      url.searchParams.set('sort[0][direction]', 'asc')
      if (offset) {
        url.searchParams.set('offset', offset)
      }

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        },
        next: { revalidate: 300 },
      })

      if (!response.ok) {
        console.error('Airtable API error:', response.status)
        return []
      }

      const data = await response.json()

      for (const record of data.records as AirtableRecord[]) {
        const fields = record.fields
        if (!fields.Name) continue

        let logo: string | null = null
        if (fields.Logo && fields.Logo.length > 0) {
          logo = fields.Logo[0].url
        }

        allRecords.push({
          id: record.id,
          name: fields.Name,
          description: fields.Description || '',
          logo,
          platform: fields.Platform || [],
          platformText: fields['Platform wrangled'] || '',
          type: fields.Type || [],
          activityLevel: fields['Activity level'] || '',
          focus: fields.Focus || '',
          joinLink: fields['Join link'] || '#',
          website: fields.Website || null,
          location: fields['Location (if in-person)'] || null,
          size: fields.Size || null,
          sort: fields.Sort || 9999,
          latitude: fields.Latitude ?? null,
          longitude: fields.Longitude ?? null,
        })
      }

      offset = data.offset || null
    } while (offset)

    return allRecords
  } catch (error) {
    console.error('Error fetching communities:', error)
    return []
  }
}

// Featured communities data (hardcoded as these are special highlights)
const featuredCommunities = [
  {
    id: 'ai-alignment-slack',
    name: 'AI Alignment Slack',
    tagline: 'Largest real-time online community',
    description:
      'Community of thousands involved in making AI safe. Includes channels dedicated to making introductions, finding study buddies, asking questions, and discovering opportunities.',
    logo: '/images/ai-alignment-slack.png',
    platform: 'Slack',
    activityLevel: 'Very active',
    focus: 'Main focus is AI safety',
    joinLink:
      'https://join.slack.com/t/ai-alignment/shared_invite/zt-3jqiicbfr-u1lLvDWy6E5WL7uucV~opw',
  },
  {
    id: 'lesswrong',
    name: 'LessWrong',
    tagline: 'Main forum for research and advocacy',
    description:
      'Forum dedicated to improving human reasoning and decision-making, and the primary online hub for long-form AI safety discussion and research.',
    logo: '/images/lesswrong.png',
    platform: 'Forum',
    activityLevel: 'Very active',
    focus: 'Partial focus on AI safety',
    joinLink: 'https://www.lesswrong.com/w/ai',
  },
]

export default async function CommunitiesPage() {
  const communities = await getCommunities()

  return (
    <div>
      <CommunitiesMap communities={communities} />
      <div className="container-default">
        <h1 id="communities" className="padding-top-56px padding-bottom-16px">
          Communities
        </h1>

        <LastUpdated
          apiEndpoint="/api/last-updated/communities"
          className={styles.lastUpdatedText}
        />

        <h2 className={`width-7-col ${styles.introParagraph}`}>
          There are many groups dedicated to discussing and contributing to AI
          safety, both{' '}
          <span className="color-light-teal">online and in-person.</span> We
          recommend joining a few.
        </h2>

        {/* Featured Communities + Related Resources */}
        <div className={styles.featuredSection}>
          <div className={styles.featuredCards}>
            {featuredCommunities.map(community => (
              <Link
                key={community.id}
                href={community.joinLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.featuredCardLink}
              >
                <div className={styles.featuredCard}>
                  <Image
                    src="/images/bookmark-small.svg"
                    alt=""
                    className={styles.featuredBookmark}
                    width={16}
                    height={24}
                  />
                  <p
                    className={`paragraph-small-bold color-teal-300 ${styles.featuredTagline}`}
                  >
                    {community.tagline}
                  </p>
                  <div className={styles.featuredHeader}>
                    <div className={styles.featuredLogoWrapper}>
                      {community.logo && (
                        <Image
                          src={community.logo}
                          alt={`${community.name} logo`}
                          width={64}
                          height={64}
                          className={styles.featuredLogo}
                        />
                      )}
                    </div>
                    <h3>{community.name}</h3>
                  </div>
                  <p className={styles.featuredDescription}>
                    {community.description}
                  </p>
                  <p className="paragraph-xs-bold color-teal-400 padding-bottom-4px">
                    Platform
                  </p>
                  <p className="paragraph-small padding-bottom-16px">
                    {community.platform}
                  </p>
                  <p className="paragraph-xs-bold color-teal-400 padding-bottom-4px">
                    Activity level
                  </p>
                  <p className="paragraph-small padding-bottom-16px">
                    {community.activityLevel}
                  </p>
                  <p className="paragraph-xs-bold color-teal-400 padding-bottom-4px">
                    Focus
                  </p>
                  <p className="paragraph-small">{community.focus}</p>
                </div>
              </Link>
            ))}
          </div>

          <aside className={`hide-mobile ${styles.relatedResources}`}>
            <p className="paragraph-small-bold padding-bottom-32px">
              Related resources
            </p>
            <Link
              href="https://www.lesswrong.com/community"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.relatedLink}
            >
              <h3 className="padding-bottom-16px">
                Map of LessWrong groups{' '}
                <span className="color-teal-400">→</span>
              </h3>
              <p className="paragraph-small color-teal-300">
                People in Rationalist groups like these often overlap with those
                in AI safety
              </p>
            </Link>
            <Link
              href="https://forum.effectivealtruism.org/groups"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.relatedLink}
            >
              <h3 className="padding-bottom-16px">
                Map of EA groups <span className="color-teal-400">→</span>
              </h3>
              <p className="paragraph-small color-teal-300">
                Effective Altruism groups also tend to be concerned with AI
                safety
              </p>
            </Link>
          </aside>
        </div>

        {/* Main Content with Search, Cards, and Filters */}
        <CommunitiesClient communities={communities} />
      </div>
    </div>
  )
}
