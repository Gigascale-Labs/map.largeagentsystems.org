const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN
const BASE_ID = process.env.AIRTABLE_BASE_ID
const TABLE_ID = 'tblHT29QNgMYKB8iW'

interface AirtableRecord {
  id: string
  fields: {
    'Project Name'?: string
    'Description (short)'?: string
    Status?: string | string[]
    Website?: string
    'Contact name'?: string
  }
}

export interface Project {
  id: string
  name: string
  description: string
  logo: string | null
  contact: string
  status: string
  url: string
  lastModified: string | null
}

export async function getProjects(): Promise<Project[]> {
  if (!AIRTABLE_TOKEN || !BASE_ID) {
    console.error('Airtable credentials not configured')
    return []
  }

  try {
    const allRecords: Project[] = []
    let offset: string | null = null

    do {
      const url = new URL(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`)
      url.searchParams.set('filterByFormula', '{Publish?} = TRUE()')
      url.searchParams.set('sort[0][field]', 'Sort')
      url.searchParams.set('sort[0][direction]', 'asc')
      if (offset) {
        url.searchParams.set('offset', offset)
      }

      let response = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
        next: { revalidate: 300 },
      })

      if (!response.ok) {
        await new Promise(r => setTimeout(r, 1000))
        response = await fetch(url.toString(), {
          headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
          next: { revalidate: 300 },
        })
      }

      if (!response.ok) {
        console.warn('Airtable API error:', response.status)
        return []
      }

      const data = await response.json()

      for (const record of data.records as AirtableRecord[]) {
        const fields = record.fields
        if (!fields['Project Name']) continue

        allRecords.push({
          id: record.id,
          name: fields['Project Name'],
          description: fields['Description (short)'] || '',
          logo: null,
          contact: fields['Contact name'] || '',
          status: Array.isArray(fields.Status)
            ? fields.Status.join(', ')
            : fields.Status || '',
          url: fields.Website || '#',
          lastModified: null,
        })
      }

      offset = data.offset || null
    } while (offset)

    return allRecords
  } catch (error) {
    console.error('Error fetching projects:', error)
    return []
  }
}
