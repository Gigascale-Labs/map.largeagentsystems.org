'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import styles from './Navigation.module.css'

const SCROLL_THRESHOLD_BLUR = 50

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  // Close the mobile menu only once the new route is actually active.
  // Closing on link click instead snaps the overlay shut before the new
  // page has rendered, producing a flash of the previous page.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: react to route change driven by Link clicks outside this component
    setIsMenuOpen(false)
  }, [pathname])

  const navOuterRef = useRef<HTMLDivElement>(null)
  const scrollInfo = useRef({
    lastY: 0,
    mode: 'top' as 'top' | 'scrolling' | 'hidden' | 'revealed',
  })

  useLayoutEffect(() => {
    const handleScroll = () => {
      const el = navOuterRef.current
      if (!el) return
      const y = window.scrollY
      const { lastY, mode } = scrollInfo.current
      const goingDown = y > lastY
      const goingUp = y < lastY

      if (y <= 0) {
        // At the very top - reset
        el.style.transition = 'none'
        el.style.transform = 'translateY(0)'
        scrollInfo.current.mode = 'top'
      } else if (goingDown) {
        if (mode === 'top' || mode === 'scrolling') {
          // Scrolling down from top - move naturally with the page
          const navHeight = el.offsetHeight
          if (y >= navHeight) {
            el.style.transition = 'none'
            el.style.transform = 'translateY(-100%)'
            scrollInfo.current.mode = 'hidden'
          } else {
            el.style.transition = 'none'
            el.style.transform = `translateY(-${y}px)`
            scrollInfo.current.mode = 'scrolling'
          }
        } else if (mode === 'revealed') {
          // Was revealed by scroll-up, now scrolling down again - animate away
          el.style.transition = 'transform 0.3s ease-in-out'
          el.style.transform = 'translateY(-100%)'
          scrollInfo.current.mode = 'hidden'
        }
        // 'hidden' stays hidden
      } else if (goingUp) {
        if (mode === 'hidden' || mode === 'scrolling') {
          // Scrolling up - reveal with smooth animation
          el.style.transition = 'transform 0.3s ease-in-out'
          el.style.transform = 'translateY(0)'
          scrollInfo.current.mode = 'revealed'
        }
        // Near the top, switch back to natural mode
        if (y <= 5) {
          scrollInfo.current.mode = 'top'
        }
      }

      // Toggle blur class directly on the DOM — no React render delay
      const blurClass = styles['nav-blur']
      if (y > SCROLL_THRESHOLD_BLUR) {
        el.classList.add(blurClass)
      } else {
        el.classList.remove(blurClass)
      }

      scrollInfo.current.lastY = y
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    document.documentElement.classList.remove('is-reload')
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <div ref={navOuterRef} className={`${styles.nav} ${styles['nav-fixed']}`}>
        <div className={styles['nav-container']}>
          <Link
            href="https://www.LargeAgentSystems.org"
            target="_blank"
            rel="noopener noreferrer"
            className="padding-right-24px"
          >
            <p className="paragraph-small-bold color-white">
              LargeAgentSystems.org
            </p>
          </Link>

          <nav className={styles['nav-menu']}>
            <Link href="/map" className={styles['nav-item']}>
              <div className={styles['nav-item-icon']}>
                <Image
                  width={16}
                  height={16}
                  alt="Field map icon"
                  src="/images/map.svg"
                />
              </div>
              <p className="paragraph-small-bold">Field map</p>
            </Link>
          </nav>

          <button
            className={styles['menu-button']}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`${styles.hamburger} ${isMenuOpen ? styles['hamburger-open'] : ''}`}
            >
              <span className={styles['hamburger-bar']} />
              <span className={styles['hamburger-bar']} />
              <span className={styles['hamburger-bar']} />
            </span>
          </button>
        </div>
      </div>

      <div
        className={`${styles['mobile-menu']} ${isMenuOpen ? styles['mobile-menu-visible'] : ''}`}
      >
        <div className={styles['mobile-menu-header']}>
          <Link
            href="https://www.LargeAgentSystems.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="paragraph-small-bold color-white">
              LargeAgentSystems.org
            </p>
          </Link>
          <button
            className={styles['menu-button']}
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
          >
            <span className={`${styles.hamburger} ${styles['hamburger-open']}`}>
              <span className={styles['hamburger-bar']} />
              <span className={styles['hamburger-bar']} />
              <span className={styles['hamburger-bar']} />
            </span>
          </button>
        </div>
        <nav className={styles['mobile-menu-items']}>
          <Link href="/map" className={styles['nav-item']}>
            <div className={styles['nav-item-icon']}>
              <Image
                width={16}
                height={16}
                alt="Field map icon"
                src="/images/map.svg"
              />
            </div>
            <p className="paragraph-default-bold">Field map</p>
          </Link>
        </nav>
      </div>
    </>
  )
}
