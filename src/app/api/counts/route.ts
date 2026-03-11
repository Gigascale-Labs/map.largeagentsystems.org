import { jsonWithCache } from '@/lib/api'
import { fetchAirtableRecords } from '@/lib/data/airtable'

// Each resource's table ID, view to count from, and a minimal field to fetch.
// Events uses "Table" (On site); Jobs uses "Jobs" (no Grid view);
// all others use their Grid view.
const resources = [
  {
    path: '/events-and-training',
    tableId: 'tblx0L8qJEaLBxJFS',
    viewId: 'viwHl72bJxCb2SfrL',
    field: 'Name',
  },
  {
    path: '/map',
    tableId: 'tblvzbGL9q9dOO9Nc',
    viewId: 'viwJgtDFDmaP8PyoI',
    field: 'Long name',
    adjust: -4,
  },
  {
    path: '/communities',
    tableId: 'tbluI5Dll697WiSm8',
    viewId: 'viwFIU3lKQHZlpc0b',
    field: 'Name',
  },
  {
    path: '/self-study',
    tableId: 'tblRNYJ0m1cmJXKKk',
    viewId: 'viwblgaia3x1gsqBo',
    field: 'Name',
    adjust: 1,
  },
  {
    path: '/jobs',
    tableId: 'tblyLelYCQjP6w3nV',
    viewId: 'viwBfn9CIUVqQHUy6',
    field: '!Title',
  },
  {
    path: '/funding',
    tableId: 'tblzMTLDZWZKqTxrq',
    viewId: 'viwxv2w8utSEhUeiJ',
    field: 'Name',
  },
  {
    path: '/media-channels',
    tableId: 'tblCTOMzyH3vILL5I',
    viewId: 'viwT8KTwupcVyGKLZ',
    field: 'Name',
  },
  {
    path: '/advisors',
    tableId: 'tblf3KKYnmgcjVGhD',
    viewId: 'viwIdRmaCar2Y6gPi',
    field: 'Name',
  },
  {
    path: '/projects',
    tableId: 'tblHT29QNgMYKB8iW',
    viewId: 'viwVgPN3hgpGa8dRE',
    field: 'Project Name',
  },
  {
    path: '/founders',
    tableId: 'tbl59Ye8oxvPjoVJv',
    viewId: 'viwzMBhPBk1GpQXnn',
    field: 'Name',
  },
]

async function countRecords(
  tableId: string,
  viewId: string,
  field: string
): Promise<number> {
  const raw = await fetchAirtableRecords({ tableId, viewId, fields: [field] })
  return raw.length
}

export async function GET() {
  // Serialize requests to avoid hitting Airtable's 5 req/sec rate limit.
  // This endpoint is cached (30 min) so cold-start latency is acceptable.
  const counts: Record<string, number> = {}
  for (const r of resources) {
    const count = await countRecords(r.tableId, r.viewId, r.field)
    counts[r.path] = count + (r.adjust ?? 0)
  }

  return jsonWithCache(counts)
}
