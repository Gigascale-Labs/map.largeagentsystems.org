'use client'

import { usePathname } from 'next/navigation'
import Navigation from './Navigation'
import Footer from './Footer'

// Routes that render without Navigation/Footer (e.g. poster-map is for printing)
const standaloneRoutes = ['/poster-map']

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isStandalone = standaloneRoutes.some(route =>
    pathname.startsWith(route)
  )

  if (isStandalone) {
    return <>{children}</>
  }

  return (
    <>
      <Navigation />
      {children}
      <Footer />
    </>
  )
}
