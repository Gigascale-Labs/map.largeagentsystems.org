import { NextResponse } from 'next/server'
import { DONATION_GUIDE_LAST_UPDATED } from '@/lib/donation-guide-date'

export async function GET() {
  const date = new Date(DONATION_GUIDE_LAST_UPDATED)
  const formattedDate = date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return NextResponse.json({
    lastUpdated: DONATION_GUIDE_LAST_UPDATED,
    formattedDate,
  })
}
