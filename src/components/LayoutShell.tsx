'use client'

import { usePathname } from 'next/navigation'
import Navigation from './Navigation'
import Footer from './Footer'

// /poster-map renders without Navigation/Footer (standalone print/embed view).
const standaloneRoutes = ['/poster-map']

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isStandalone = standaloneRoutes.some(
    route => pathname === route || pathname.startsWith(`${route}/`)
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
