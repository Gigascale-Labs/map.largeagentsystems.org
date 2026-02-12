import { NextResponse } from 'next/server'

const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN
const BASE_ID = process.env.AIRTABLE_BASE_ID
const TABLE_ID = 'TBD' // TODO: Replace with actual self-study table ID
const VIEW_ID = 'TBD' // TODO: Replace with actual self-study view ID

interface AirtableRecord {
  id: string
  fields: {
    Name?: string
    Description?: string
    Category?: string
    'Course type'?: string
    Organizer?: string
    URL?: string
    Image?: Array<{
      url: string
      thumbnails?: { large?: { url: string } }
    }>
    'Last Modified'?: string
  }
}

export interface Course {
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

export async function GET() {
  if (!AIRTABLE_TOKEN || !BASE_ID) {
    return NextResponse.json(
      { error: 'Airtable credentials not configured' },
      { status: 500 }
    )
  }

  try {
    const allRecords: Course[] = []
    let offset: string | null = null

    // Fetch all records (Airtable paginates at 100 records)
    do {
      const url = new URL(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`)
      url.searchParams.set('view', VIEW_ID)
      if (offset) {
        url.searchParams.set('offset', offset)
      }

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        },
        next: { revalidate: 300 }, // Cache for 5 minutes
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(
          `Airtable API error: ${response.status} ${response.statusText}`,
          errorText
        )
        return NextResponse.json(
          { error: `Airtable API error: ${response.status}` },
          { status: response.status }
        )
      }

      const data = await response.json()

      for (const record of data.records as AirtableRecord[]) {
        const fields = record.fields
        const name = fields.Name
        if (!name) continue

        let image: string | null = null
        if (fields.Image && fields.Image.length > 0) {
          image = fields.Image[0].url
        }

        allRecords.push({
          id: record.id,
          name,
          description: fields.Description || '',
          category: fields.Category || '',
          courseType: fields['Course type'] || '',
          organizer: fields.Organizer || '',
          url: fields.URL || '#',
          image,
          lastModified: fields['Last Modified'] || null,
        })
      }

      offset = data.offset || null
    } while (offset)

    return NextResponse.json({
      records: allRecords,
      count: allRecords.length,
    })
  } catch (error) {
    console.error('Error fetching self-study data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch self-study data' },
      { status: 500 }
    )
  }
}
