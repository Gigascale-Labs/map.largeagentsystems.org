export interface AirtableRawRecord {
  id: string
  fields: Record<string, unknown>
}

interface FetchOptions {
  tableId: string
  viewId?: string
  filterByFormula?: string
  sort?: Array<{ field: string; direction: 'asc' | 'desc' }>
  fields?: string[]
}

export async function fetchAirtableRecords(
  options: FetchOptions
): Promise<AirtableRawRecord[]> {
  const token = process.env.AIRTABLE_TOKEN
  const baseId = process.env.AIRTABLE_BASE_ID

  if (!token || !baseId) {
    console.error('Airtable credentials not configured')
    return []
  }

  const allRecords: AirtableRawRecord[] = []
  let offset: string | null = null

  do {
    const url = new URL(
      `https://api.airtable.com/v0/${baseId}/${options.tableId}`
    )
    if (options.viewId) {
      url.searchParams.set('view', options.viewId)
    }
    if (options.filterByFormula) {
      url.searchParams.set('filterByFormula', options.filterByFormula)
    }
    if (options.sort) {
      options.sort.forEach((s, i) => {
        url.searchParams.set(`sort[${i}][field]`, s.field)
        url.searchParams.set(`sort[${i}][direction]`, s.direction)
      })
    }
    if (options.fields) {
      options.fields.forEach(f => url.searchParams.append('fields[]', f))
    }
    if (offset) {
      url.searchParams.set('offset', offset)
    }

    let response = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!response.ok) {
      console.warn(`Airtable API error (${response.status}), retrying...`)
      await new Promise(r => setTimeout(r, 1000))
      response = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      })
    }

    if (!response.ok) {
      console.warn('Airtable API error after retry:', response.status)
      return []
    }

    const data = await response.json()
    allRecords.push(...(data.records as AirtableRawRecord[]))
    offset = data.offset || null
  } while (offset)

  return allRecords
}
