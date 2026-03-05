import { NextResponse } from 'next/server'

const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN
const BASE_ID = process.env.AIRTABLE_BASE_ID
const TABLE_ID = 'TBD' // TODO: Replace with actual jobs table ID

interface AirtableRecord {
  id: string
  fields: {
    Name?: string
    Description?: string
    Organization?: string
    Logo?: Array<{
      url: string
      thumbnails?: { large?: { url: string } }
    }>
    'Skill set'?: string
    Location?: string
    'Minimum experience'?: string
    'Role type'?: string
    'Work location'?: string
    URL?: string
    'Last Modified'?: string
  }
}

export interface Job {
  id: string
  name: string
  description: string
  organization: string
  logo: string | null
  skillSet: string
  location: string
  minimumExperience: string
  roleType: string
  workLocation: string
  url: string
  lastModified: string | null
  datePublished: string | null
}

export async function GET() {
  if (!AIRTABLE_TOKEN || !BASE_ID) {
    return NextResponse.json(
      { error: 'Airtable credentials not configured' },
      { status: 500 }
    )
  }

  try {
    const allRecords: Job[] = []
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
        if (!fields.Name) continue

        let logo: string | null = null
        if (fields.Logo && fields.Logo.length > 0) {
          logo = fields.Logo[0].url
        }

        allRecords.push({
          id: record.id,
          name: fields.Name,
          description: fields.Description || '',
          organization: fields.Organization || '',
          logo,
          skillSet: fields['Skill set'] || '',
          location: fields.Location || '',
          minimumExperience: fields['Minimum experience'] || '',
          roleType: fields['Role type'] || '',
          workLocation: fields['Work location'] || '',
          url: fields.URL || '#',
          lastModified: fields['Last Modified'] || null,
          datePublished: null,
        })
      }

      offset = data.offset || null
    } while (offset)

    return NextResponse.json({
      records: allRecords,
      count: allRecords.length,
    })
  } catch (error) {
    console.error('Error fetching jobs data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch jobs data' },
      { status: 500 }
    )
  }
}
