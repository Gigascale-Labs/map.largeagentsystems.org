const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN
const BASE_ID = process.env.AIRTABLE_BASE_ID
const TABLE_ID = 'tblyLelYCQjP6w3nV'
const VIEW_ID = 'viwDXZcviPykFzt4g'

interface AirtableRecord {
  id: string
  fields: {
    '!Title'?: string
    '!Description'?: string
    '!Org'?: string
    "Org's logo"?: string | Array<{ url: string }>
    'Skill set text'?: string | string[]
    'Location (formatted)'?: string | string[]
    '!MinimumExperienceLevel (text)'?: string | string[]
    'Role type text'?: string | string[]
    'Work location'?: string | string[]
    "Org's vacancies page"?: string
    '!Date it closes'?: string
    'Date published'?: string
  }
}

const FIELDS = [
  '!Title',
  '!Description',
  '!Org',
  "Org's logo",
  'Skill set text',
  'Location (formatted)',
  '!MinimumExperienceLevel (text)',
  'Role type text',
  'Work location',
  "Org's vacancies page",
  '!Date it closes',
  'Date published',
]

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

export async function getJobs(): Promise<Job[]> {
  if (!AIRTABLE_TOKEN || !BASE_ID) {
    console.error('Airtable credentials not configured')
    return []
  }

  try {
    const allRecords: Job[] = []
    let offset: string | null = null

    do {
      const url = new URL(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`)
      url.searchParams.set('view', VIEW_ID)
      FIELDS.forEach(f => url.searchParams.append('fields[]', f))
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
        if (!fields['!Title']) continue

        let logo: string | null = null
        const logoField = fields["Org's logo"]
        if (logoField) {
          if (typeof logoField === 'string') {
            logo = logoField
          } else if (Array.isArray(logoField) && logoField.length > 0) {
            logo = logoField[0].url
          }
        }

        allRecords.push({
          id: record.id,
          name: fields['!Title'],
          description: fields['!Description'] || '',
          organization: fields['!Org'] || '',
          logo,
          skillSet: Array.isArray(fields['Skill set text'])
            ? fields['Skill set text'].join(', ')
            : fields['Skill set text'] || '',
          location: Array.isArray(fields['Location (formatted)'])
            ? fields['Location (formatted)'].join(', ')
            : fields['Location (formatted)'] || '',
          minimumExperience: Array.isArray(
            fields['!MinimumExperienceLevel (text)']
          )
            ? fields['!MinimumExperienceLevel (text)'].join(', ')
            : fields['!MinimumExperienceLevel (text)'] || '',
          roleType: Array.isArray(fields['Role type text'])
            ? fields['Role type text'].join(', ')
            : fields['Role type text'] || '',
          workLocation: Array.isArray(fields['Work location'])
            ? fields['Work location'].join(', ')
            : fields['Work location'] || '',
          url: fields["Org's vacancies page"] || '#',
          lastModified: fields['!Date it closes'] || null,
          datePublished: fields['Date published'] || null,
        })
      }

      offset = data.offset || null
    } while (offset)

    allRecords.sort((a, b) => {
      if (!a.datePublished && !b.datePublished) return 0
      if (!a.datePublished) return 1
      if (!b.datePublished) return -1
      return b.datePublished.localeCompare(a.datePublished)
    })

    return allRecords
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return []
  }
}
