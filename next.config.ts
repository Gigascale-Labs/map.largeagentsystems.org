import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/', destination: '/map', permanent: false },
      // Migrated from Webflow redirects (exported 6 April 2026).
      { source: '/landscape-map', destination: '/map', permanent: true },
      { source: '/landscape-map-2025', destination: '/map', permanent: true },
      { source: '/reading-group', destination: '/map', permanent: true },
    ]
  },
}

export default nextConfig
