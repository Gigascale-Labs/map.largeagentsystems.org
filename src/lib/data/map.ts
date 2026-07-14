import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'
import { unstable_cache } from 'next/cache'
import { mapMeta } from './map-config'

const DATA_FILE = path.join(process.cwd(), 'data', 'map.csv')

interface MapCsvRow {
  'Long name'?: string
  'Long name for cards'?: string
  'Short name'?: string
  Description?: string
  Category?: string
  Status?: string
  'Logo (for cards)'?: string
  'Logo (for map)'?: string
  Link?: string
  'Short URL'?: string
  'Date added'?: string
  x?: string
  y?: string
  Scale?: string
  'Publish?'?: string
  'Hide?'?: string
}

export interface MapOrg {
  id: string
  title: string
  tooltipTitle: string
  shortName: string | null
  description: string
  category: string
  status: string
  logo: string | null
  mapLogo: string | null
  link: string
  shortUrl: string | null
  x: number | null
  y: number | null
  scale: string | null
  isMagic: boolean
}

export interface MapData {
  records: MapOrg[]
  lastUpdated: string | null
  suggestUrl: string
}

// Sort order is hardcoded so the data file's row order can change freely
// without affecting how cards are displayed on /map.
const STATUS_ORDER = ['Active', 'Inactive']
const SCALE_ORDER_LARGE_FIRST = ['Large', 'Medium', 'Small']
const CATEGORY_ORDER = [
  'Advocacy',
  'Blog',
  'Capabilities research',
  'Career support',
  'Conceptual research',
  'Empirical research',
  'Forecasting',
  'Funding',
  'Governance',
  'Newsletter',
  'Podcast',
  'Research support',
  'Resource',
  'Strategy',
  'Training and education',
  'Video',
  'No longer active',
]

function rankIn(value: string | null | undefined, order: string[]): number {
  if (!value) return order.length + 1
  const idx = order.indexOf(value)
  return idx === -1 ? order.length : idx
}

// Multi-select sort: compare categories in selection order (not sorted),
// using each option's index in CATEGORY_ORDER as the rank, then compare
// lexicographically. Records with fewer categories sort first when the
// prefix is equal — matches Airtable's multi-select sort behavior.
function categoryIndices(category: string): number[] {
  if (!category) return [CATEGORY_ORDER.length + 1]
  return category
    .split(',')
    .map(c => c.trim())
    .filter(Boolean)
    .map(c => {
      const i = CATEGORY_ORDER.indexOf(c)
      return i === -1 ? CATEGORY_ORDER.length : i
    })
}

function compareCategoryIndices(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length)
  for (let i = 0; i < len; i++) {
    if (a[i] !== b[i]) return a[i] - b[i]
  }
  return a.length - b.length
}

function parseBool(value: string | undefined, context: string): boolean {
  const normalized = (value ?? '').trim().toUpperCase()
  if (normalized === 'TRUE') return true
  if (normalized === 'FALSE') return false
  throw new Error(`${context} must be "TRUE" or "FALSE", got: "${value ?? ''}"`)
}

function parseNumber(
  value: string | undefined,
  context: string
): number | null {
  const trimmed = (value ?? '').trim()
  if (!trimmed) return null
  const n = Number(trimmed)
  if (!Number.isFinite(n)) {
    throw new Error(`${context} must be a number, got: "${trimmed}"`)
  }
  return n
}

// CSV can't reuse its own delimiter for multi-value cells, so Category is
// semicolon-separated in data/map.csv. Re-join with ', ' so the resulting
// MapOrg.category string still matches the comma-separated format every
// consumer (categoryIndices above, MapClient's filters, search-index, etc.)
// already expects.
function parseCategory(value: string | undefined): string {
  return (value ?? '')
    .split(';')
    .map(c => c.trim())
    .filter(Boolean)
    .join(', ')
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function getMapDataImpl(): Promise<MapData> {
  if (!fs.existsSync(DATA_FILE)) {
    throw new Error(`Map data file not found: ${DATA_FILE}`)
  }

  const csvText = fs.readFileSync(DATA_FILE, 'utf-8')
  const rows: MapCsvRow[] = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  })

  const published = rows.filter(row => {
    const title =
      row['Long name for cards'] || row['Long name'] || '(untitled row)'
    const publish = parseBool(row['Publish?'], `"Publish?" for "${title}"`)
    const hide = parseBool(row['Hide?'], `"Hide?" for "${title}"`)
    return publish && !hide
  })

  const allRecords: MapOrg[] = published.map((row, index) => {
    const title = row['Long name for cards'] || row['Long name']
    if (!title) {
      throw new Error(`Row ${index + 2} of ${DATA_FILE} is missing "Long name"`)
    }
    if (!row.Description) {
      throw new Error(`Row ${index + 2} ("${title}") is missing "Description"`)
    }

    const tooltipTitle = row['Long name'] || title

    return {
      id: slugify(title),
      title,
      tooltipTitle,
      shortName: row['Short name'] || null,
      description: row.Description,
      category: parseCategory(row.Category),
      status: row.Status || 'Active',
      logo: row['Logo (for cards)'] || null,
      mapLogo: row['Logo (for map)'] || null,
      link: row.Link || '#',
      shortUrl: row['Short URL'] || null,
      x: parseNumber(row.x, `"x" for "${title}"`),
      y: parseNumber(row.y, `"y" for "${title}"`),
      scale: row.Scale || null,
      isMagic: false,
    }
  })

  allRecords.sort((a, b) => {
    const statusDiff =
      rankIn(a.status, STATUS_ORDER) - rankIn(b.status, STATUS_ORDER)
    if (statusDiff !== 0) return statusDiff

    const scaleDiff =
      rankIn(a.scale, SCALE_ORDER_LARGE_FIRST) -
      rankIn(b.scale, SCALE_ORDER_LARGE_FIRST)
    if (scaleDiff !== 0) return scaleDiff

    const catDiff = compareCategoryIndices(
      categoryIndices(a.category),
      categoryIndices(b.category)
    )
    if (catDiff !== 0) return catDiff

    return a.title.localeCompare(b.title)
  })

  return {
    records: allRecords,
    lastUpdated: mapMeta.lastUpdated,
    suggestUrl: mapMeta.suggestUrl,
  }
}

export const getMapData = unstable_cache(getMapDataImpl, ['map-data', 'v1'], {
  revalidate: 3600,
})
