'use client'

import { useEffect, useState } from 'react'
import { formatRelativeDate } from '@/lib/format-date'

interface LastUpdatedProps {
  apiEndpoint: string
  className?: string
  format?: 'full' | 'relative'
}

export default function LastUpdated({
  apiEndpoint,
  className = '',
  format = 'full',
}: LastUpdatedProps) {
  const [text, setText] = useState<string | null>(null)

  useEffect(() => {
    fetch(apiEndpoint)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(data => {
        if (data.lastUpdated) {
          setText(
            format === 'relative'
              ? formatRelativeDate(data.lastUpdated)
              : `Last updated: ${data.formattedDate}`
          )
        }
      })
      .catch(err => console.warn('Failed to load last updated date:', err))
  }, [apiEndpoint, format])

  if (!text) return null

  return <div className={className}>{text}</div>
}
