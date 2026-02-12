'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import LastUpdated from '@/components/LastUpdated'
import styles from './page.module.css'

const categoryOptions = [
  'Introductory',
  'Technical Alignment',
  'Governance',
  'Strategy',
]

const typeOptions = ['Curriculum', 'Reading list']

interface Course {
  id: string
  name: string
  description: string
  category: string
  courseType: string
  organizer: string
  url: string
  image: string | null
  lastModified: string | null
}

export default function SelfStudyPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set()
  )
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set())

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/self-study')
        if (!res.ok) {
          throw new Error('Failed to fetch data')
        }
        const data = await res.json()
        setCourses(data.records)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Filter courses based on search, category, and type
  const filteredCourses = courses.filter(course => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (
        !course.name.toLowerCase().includes(query) &&
        !course.description.toLowerCase().includes(query) &&
        !course.organizer.toLowerCase().includes(query)
      ) {
        return false
      }
    }

    // Category filter
    if (selectedCategories.size > 0) {
      const courseCategories = course.category
        .toLowerCase()
        .split(',')
        .map(c => c.trim())
      const hasMatchingCategory = Array.from(selectedCategories).some(cat =>
        courseCategories.some(cc => cc.includes(cat.toLowerCase()))
      )
      if (!hasMatchingCategory) return false
    }

    // Type filter
    if (selectedTypes.size > 0) {
      const courseType = course.courseType.toLowerCase().trim()
      const hasMatchingType = Array.from(selectedTypes).some(t =>
        courseType.includes(t.toLowerCase())
      )
      if (!hasMatchingType) return false
    }

    return true
  })

  const toggleCategory = (category: string) => {
    const newSelected = new Set(selectedCategories)
    if (newSelected.has(category)) {
      newSelected.delete(category)
    } else {
      newSelected.add(category)
    }
    setSelectedCategories(newSelected)
  }

  const toggleType = (type: string) => {
    const newSelected = new Set(selectedTypes)
    if (newSelected.has(type)) {
      newSelected.delete(type)
    } else {
      newSelected.add(type)
    }
    setSelectedTypes(newSelected)
  }

  // Calculate category counts
  const categoryCounts = courses.reduce(
    (counts, course) => {
      const courseCategories = course.category
        .toLowerCase()
        .split(',')
        .map(c => c.trim())
      for (const category of categoryOptions) {
        const catLower = category.toLowerCase()
        if (courseCategories.some(cc => cc.includes(catLower))) {
          counts[category] = (counts[category] || 0) + 1
        }
      }
      return counts
    },
    {} as Record<string, number>
  )

  // Calculate type counts
  const typeCounts = courses.reduce(
    (counts, course) => {
      const courseType = course.courseType.toLowerCase().trim()
      for (const type of typeOptions) {
        if (courseType.includes(type.toLowerCase())) {
          counts[type] = (counts[type] || 0) + 1
        }
      }
      return counts
    },
    {} as Record<string, number>
  )

  return (
    <div className="container-default">
      {/* Hero */}
      <h1 className="padding-top-56px padding-bottom-8px">Self-study</h1>
      <LastUpdated
        apiEndpoint="/api/last-updated/self-study"
        className="padding-bottom-40px paragraph-small color-teal-300"
      />
      <h2 className="width-6-col padding-bottom-56px">
        These curricula and reading lists enable you to{' '}
        <span className="color-light-teal">dive deeper into AI safety </span>
        through independent learning.
      </h2>

      {/* Featured Cards + Related Resources */}
      <div className="flex gap-56px padding-bottom-80px">
        <div className={styles['featured-cards']}>
          <a
            href="https://www.alignmentforum.org/library"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className={styles['featured-card']}>
              <p className="paragraph-small-bold padding-bottom-16px color-teal-300">
                Fundamental reading
              </p>
              <div className="flex items-center gap-16px padding-bottom-24px">
                <div className={styles['featured-img']}>
                  <Image
                    src="/images/download-2-1.svg"
                    alt=""
                    width={64}
                    height={64}
                    className={styles['featured-logo']}
                  />
                </div>
                <h3>AI Alignment Forum: Curated Sequences</h3>
              </div>
              <p className="padding-bottom-24px">
                List of sequences curated by the AI Alignment Forum team,
                featuring work from Richard Ngo, Paul Christiano, etc.
              </p>
              <Image
                src="/images/bookmark-light.svg"
                alt=""
                width={16}
                height={40}
                className={styles['bookmark-icon']}
              />
              <p className="paragraph-xs-bold padding-bottom-4px color-teal-400">
                Category
              </p>
              <p className="paragraph-small padding-bottom-16px">
                Technical Alignment
              </p>
              <p className="paragraph-xs-bold padding-bottom-4px color-teal-400">
                Created by
              </p>
              <p className="paragraph-small">Various</p>
            </div>
          </a>

          <a
            href="https://bluedot.org/courses"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className={styles['featured-card']}>
              <p className="paragraph-small-bold padding-bottom-16px color-teal-300">
                Standard introductory courses
              </p>
              <div className="flex items-center gap-16px padding-bottom-24px">
                <div className={styles['featured-img']}>
                  <Image
                    src="/images/download-2-1.svg"
                    alt=""
                    width={64}
                    height={64}
                    className={styles['featured-logo']}
                  />
                </div>
                <h3>BlueDot Impact: Technical &amp; Governance</h3>
              </div>
              <p className="padding-bottom-24px">
                Covers key concepts and research perspectives in AI safety,
                split into two main streams: Technical AI Safety and AI
                Governance.
              </p>
              <Image
                src="/images/bookmark-light.svg"
                alt=""
                width={16}
                height={40}
                className={styles['bookmark-icon']}
              />
              <p className="paragraph-xs-bold padding-bottom-4px color-teal-400">
                Category
              </p>
              <p className="paragraph-small padding-bottom-16px">
                Technical Alignment, Governance
              </p>
              <p className="paragraph-xs-bold padding-bottom-4px color-teal-400">
                Created by
              </p>
              <p className="paragraph-small">BlueDot Impact</p>
            </div>
          </a>
        </div>

        {/* Related Resources - desktop only */}
        <div className="hide-mobile">
          <p className="paragraph-small-bold padding-bottom-32px">
            Related resources
          </p>
          <Link
            href="/events-and-training"
            className="padding-bottom-40px block"
          >
            <h3 className="padding-bottom-16px">
              Events &amp; training{' '}
              <span className="color-teal-300">&rarr;</span>
            </h3>
            <p className="paragraph-small color-teal-300">
              Upcoming fellowships, conferences, facilitated courses etc.
            </p>
          </Link>
          <a
            href="https://theaidigest.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <h3 className="padding-bottom-16px">
              AI Digest <span className="color-teal-300">&rarr;</span>
            </h3>
            <p className="paragraph-small color-teal-300">
              Interactive explainers of AI capabilities and trends
            </p>
          </a>
        </div>
      </div>

      {/* Database Grid */}
      <div className={styles['database-outer-grid']}>
        {/* Left column: search + cards */}
        <div>
          <div className="padding-bottom-40px">
            <input
              type="text"
              className="text-field"
              placeholder="Search courses by name, description, or creator"
              maxLength={256}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="padding-bottom-40px">
              <p className="paragraph-small color-teal-300">Loading...</p>
            </div>
          ) : error ? (
            <div className="padding-bottom-40px">
              <p className="paragraph-small color-teal-300">Error: {error}</p>
            </div>
          ) : (
            <div className={`${styles['collection-list']} padding-bottom-40px`}>
              {filteredCourses.map(course => (
                <a
                  key={course.id}
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.card}
                >
                  <div className="flex items-center gap-16px padding-bottom-24px">
                    <div className={styles['featured-img']}>
                      {course.image && (
                        <Image
                          src={course.image}
                          alt=""
                          className={styles['card-image']}
                          width={64}
                          height={64}
                          unoptimized
                        />
                      )}
                    </div>
                    <h3>{course.name}</h3>
                  </div>
                  <p className="paragraph-small padding-bottom-24px">
                    {course.description}
                  </p>
                  <p className="paragraph-xs-bold padding-bottom-4px color-teal-400">
                    Category
                  </p>
                  <p className="paragraph-small padding-bottom-16px">
                    {course.category}
                  </p>
                  <p className="paragraph-xs-bold padding-bottom-4px color-teal-400">
                    Created by
                  </p>
                  <p className="paragraph-small">{course.organizer}</p>
                </a>
              ))}
              {filteredCourses.length === 0 && (
                <p className="paragraph-small color-teal-300">
                  No items found.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right column: filters (desktop only) */}
        <div className="hide-mobile">
          {/* Category filter */}
          <div className="padding-bottom-40px">
            <label className="paragraph-small-bold padding-bottom-16px">
              Category
            </label>
            {categoryOptions.map(category => (
              <label
                key={category}
                className="flex items-center cursor-pointer padding-bottom-16px"
              >
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={selectedCategories.has(category)}
                  onChange={() => toggleCategory(category)}
                />
                <span className="paragraph-small color-teal-300 flex items-center cursor-pointer">
                  {category}
                  <span className="filter-count">
                    {' '}
                    ({categoryCounts[category] || 0})
                  </span>
                </span>
              </label>
            ))}
          </div>

          {/* Type filter */}
          <div className="padding-bottom-56px">
            <label className="paragraph-small padding-bottom-16px">Type</label>
            {typeOptions.map(type => (
              <label
                key={type}
                className="flex items-center cursor-pointer padding-bottom-16px"
              >
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={selectedTypes.has(type)}
                  onChange={() => toggleType(type)}
                />
                <span className="paragraph-small color-teal-300 flex items-center cursor-pointer">
                  {type}
                  <span className="filter-count">
                    {' '}
                    ({typeCounts[type] || 0})
                  </span>
                </span>
              </label>
            ))}
          </div>

          {/* Contribute buttons */}
          <div className={styles['contribute-buttons']}>
            <a
              href="https://airtable.com/appF8XfZUGXtfi40E/pag6L4BzdkxocBzqr/form"
              target="_blank"
              rel="noopener noreferrer"
            >
              <p className="paragraph-default-bold padding-bottom-8px">
                Suggest entry <span className="color-teal-300">&rarr;</span>
              </p>
              <p className={styles['side-button']}>
                Suggest a course to be listed here
              </p>
            </a>
            <a
              href="https://airtable.com/appF8XfZUGXtfi40E/pagndDvdya1DSqoxN/form"
              target="_blank"
              rel="noopener noreferrer"
            >
              <p className="paragraph-default-bold padding-bottom-8px">
                Suggest correction{' '}
                <span className="color-teal-300">&rarr;</span>
              </p>
              <p className={styles['side-button']}>
                Let us know of changes to a course
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
