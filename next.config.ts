import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/founder-toolkit',
        destination: '/founders',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
