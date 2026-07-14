import MapClient from './MapClient'
import { getMapData } from '@/lib/data/map'

export const metadata = {
  alternates: { canonical: '/map' },
}

export default async function MapPage() {
  const { records, lastUpdated, suggestUrl } = await getMapData()

  return (
    <MapClient
      orgs={records}
      lastUpdated={lastUpdated}
      suggestUrl={suggestUrl}
    />
  )
}
