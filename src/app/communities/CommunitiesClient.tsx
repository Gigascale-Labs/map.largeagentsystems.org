'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Community } from '../api/communities/route'

interface CommunitiesClientProps {
  communities: Community[]
}

// Filter options based on Airtable data
const typeOptions = ['Online', 'In person']
const platformOptions = [
  'Discord',
  'Facebook',
  'Forum',
  'Gather',
  'Local',
  'Reddit',
  'Slack',
  'Telegram',
  'WhatsApp',
]
const activityOptions = ['Very active', 'Active', 'Semi-active']
const focusOptions = ['Main focus is AI safety', 'Partial focus on AI safety']

export default function CommunitiesClient({
  communities,
}: CommunitiesClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilters, setTypeFilters] = useState<string[]>([])
  const [platformFilters, setPlatformFilters] = useState<string[]>([])
  const [activityFilters, setActivityFilters] = useState<string[]>([])
  const [focusFilters, setFocusFilters] = useState<string[]>([])

  const filteredCommunities = useMemo(() => {
    return communities.filter(community => {
      // Text search
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          community.name.toLowerCase().includes(query) ||
          community.description.toLowerCase().includes(query) ||
          (community.location &&
            community.location.toLowerCase().includes(query))
        if (!matchesSearch) return false
      }

      // Type filter
      if (typeFilters.length > 0) {
        const hasMatchingType = community.type.some(t =>
          typeFilters.includes(t)
        )
        if (!hasMatchingType) return false
      }

      // Platform filter
      if (platformFilters.length > 0) {
        const hasMatchingPlatform = community.platform.some(p =>
          platformFilters.includes(p)
        )
        if (!hasMatchingPlatform) return false
      }

      // Activity level filter
      if (activityFilters.length > 0) {
        if (!activityFilters.includes(community.activityLevel)) return false
      }

      // Focus filter
      if (focusFilters.length > 0) {
        if (!focusFilters.includes(community.focus)) return false
      }

      return true
    })
  }, [
    communities,
    searchQuery,
    typeFilters,
    platformFilters,
    activityFilters,
    focusFilters,
  ])

  const filterCounts = useMemo(() => {
    const counts = {
      type: {} as Record<string, number>,
      platform: {} as Record<string, number>,
      activity: {} as Record<string, number>,
      focus: {} as Record<string, number>,
    }
    for (const community of filteredCommunities) {
      for (const t of community.type) {
        counts.type[t] = (counts.type[t] || 0) + 1
      }
      for (const p of community.platform) {
        counts.platform[p] = (counts.platform[p] || 0) + 1
      }
      if (community.activityLevel) {
        counts.activity[community.activityLevel] =
          (counts.activity[community.activityLevel] || 0) + 1
      }
      if (community.focus) {
        counts.focus[community.focus] = (counts.focus[community.focus] || 0) + 1
      }
    }
    return counts
  }, [filteredCommunities])

  const toggleFilter = (
    value: string,
    current: string[],
    setter: (v: string[]) => void
  ) => {
    if (current.includes(value)) {
      setter(current.filter(v => v !== value))
    } else {
      setter([...current, value])
    }
  }

  return (
    <div className="database-outer-grid">
      <div>
        {/* Search Bar */}
        <div className="padding-bottom-40px">
          <input
            type="text"
            placeholder="Search communities by title, description, or location"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="text-field"
          />
        </div>

        {/* Community Cards */}
        <div className="collection-list">
          {filteredCommunities.length === 0 ? (
            <p className="paragraph-small color-teal-300">No items found.</p>
          ) : (
            filteredCommunities.map(community => (
              <Link
                key={community.id}
                href={community.joinLink}
                target="_blank"
                rel="noopener noreferrer"
                className="card"
              >
                <div className="flex items-center gap-16px padding-bottom-24px">
                  {community.logo && (
                    <div className="featured-img">
                      <Image
                        src={community.logo}
                        alt={`${community.name} logo`}
                        width={64}
                        height={64}
                        className="card-image"
                        unoptimized
                      />
                    </div>
                  )}
                  <h3>{community.name}</h3>
                </div>
                {community.description && (
                  <p className="paragraph-small padding-bottom-24px">
                    {community.description}
                  </p>
                )}
                <p className="paragraph-xs-bold color-teal-400 padding-bottom-4px">
                  Platform
                </p>
                <p className="paragraph-small padding-bottom-16px">
                  {community.platformText || community.platform.join(', ')}
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
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Filters Sidebar */}
      <aside className="hide-mobile">
        {/* Type Filter */}
        <div className="padding-bottom-40px">
          <p className="paragraph-small-bold color-white padding-bottom-24px">
            Type
          </p>
          {typeOptions.map(option => (
            <label
              key={option}
              className="flex items-center cursor-pointer padding-bottom-16px"
            >
              <input
                type="checkbox"
                checked={typeFilters.includes(option)}
                onChange={() =>
                  toggleFilter(option, typeFilters, setTypeFilters)
                }
                className="checkbox"
              />
              <span className="paragraph-small color-teal-300">
                {option}
                <span className="filter-count">
                  {' '}
                  ({filterCounts.type[option] || 0})
                </span>
              </span>
            </label>
          ))}
        </div>

        {/* Platform Filter */}
        <div className="padding-bottom-40px">
          <p className="paragraph-small-bold color-white padding-bottom-24px">
            Platform
          </p>
          {platformOptions.map(option => (
            <label
              key={option}
              className="flex items-center cursor-pointer padding-bottom-16px"
            >
              <input
                type="checkbox"
                checked={platformFilters.includes(option)}
                onChange={() =>
                  toggleFilter(option, platformFilters, setPlatformFilters)
                }
                className="checkbox"
              />
              <span className="paragraph-small color-teal-300">
                {option}
                <span className="filter-count">
                  {' '}
                  ({filterCounts.platform[option] || 0})
                </span>
              </span>
            </label>
          ))}
        </div>

        {/* Activity Level Filter */}
        <div className="padding-bottom-40px">
          <p className="paragraph-small-bold color-white padding-bottom-24px">
            Activity level
          </p>
          {activityOptions.map(option => (
            <label
              key={option}
              className="flex items-center cursor-pointer padding-bottom-16px"
            >
              <input
                type="checkbox"
                checked={activityFilters.includes(option)}
                onChange={() =>
                  toggleFilter(option, activityFilters, setActivityFilters)
                }
                className="checkbox"
              />
              <span className="paragraph-small color-teal-300">
                {option}
                <span className="filter-count">
                  {' '}
                  ({filterCounts.activity[option] || 0})
                </span>
              </span>
            </label>
          ))}
        </div>

        {/* Focus Filter */}
        <div className="padding-bottom-40px">
          <p className="paragraph-small-bold color-white padding-bottom-24px">
            Focus
          </p>
          {focusOptions.map(option => (
            <label
              key={option}
              className="flex items-center cursor-pointer padding-bottom-16px"
            >
              <input
                type="checkbox"
                checked={focusFilters.includes(option)}
                onChange={() =>
                  toggleFilter(option, focusFilters, setFocusFilters)
                }
                className="checkbox"
              />
              <span className="paragraph-small color-teal-300">
                {option}
                <span className="filter-count">
                  {' '}
                  ({filterCounts.focus[option] || 0})
                </span>
              </span>
            </label>
          ))}
        </div>

        {/* Suggest Entry / Correction */}
        <div className="contribute-buttons">
          <a
            href="https://airtable.com/appF8XfZUGXtfi40E/pagKhplUqu07DwVqC/form"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="paragraph-default-bold padding-bottom-8px">
              Suggest entry <span className="color-teal-300">→</span>
            </p>
            <p className="paragraph-small color-teal-300">
              Suggest a community to be listed here
            </p>
          </a>
          <a
            href="https://airtable.com/appF8XfZUGXtfi40E/pagndDvdya1DSqoxN/form"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="paragraph-default-bold padding-bottom-8px">
              Suggest correction <span className="color-teal-300">→</span>
            </p>
            <p className="paragraph-small color-teal-300">
              Let us know of changes to a community
            </p>
          </a>
        </div>
      </aside>
    </div>
  )
}
