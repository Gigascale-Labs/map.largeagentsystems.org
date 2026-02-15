'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './Navigation.module.css'

const allNavItems = [
  {
    href: '/events-and-training',
    label: 'Events & training',
    icon: 'calendar.svg',
    count: 48,
  },
  { href: '/map', label: 'Field map', icon: 'map.svg', count: 323 },
  { href: '/communities', label: 'Communities', icon: 'globe.svg', count: 196 },
  { href: '/self-study', label: 'Self-study', icon: 'book.svg', count: 25 },
  { href: '/jobs', label: 'Jobs', icon: 'briefcase.svg', count: 327 },
  { href: '/funding', label: 'Funding', icon: 'coins.svg', count: 49 },
  {
    href: '/media-channels',
    label: 'Media channels',
    icon: 'megaphone.svg',
    count: 75,
  },
  { href: '/advisors', label: 'Advisors', icon: 'person.svg', count: 20 },
  {
    href: '/projects',
    label: 'Volunteer projects',
    icon: 'clipboard.svg',
    count: 33,
  },
  { href: '/donation-guide', label: 'Donation guide', icon: 'heart.svg' },
]

const MIN_OVERFLOW = 4

const SCROLL_THRESHOLD_BLUR = 50

export default function Navigation() {
  const [hasBlur, setHasBlur] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(
    allNavItems.length - MIN_OVERFLOW
  )
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const navOuterRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const scrollInfo = useRef({
    lastY: 0,
    mode: 'top' as 'top' | 'scrolling' | 'hidden' | 'revealed',
  })

  const overflowCount = allNavItems.length - visibleCount
  const visibleItems = allNavItems.slice(0, visibleCount)
  const overflowItems = allNavItems.slice(visibleCount)

  const calculateVisibleItems = useCallback(() => {
    if (!navRef.current) return
    const navWidth = navRef.current.offsetWidth
    // Reserve space for the "+N" button (~60px) and gap
    const overflowButtonWidth = 60
    const gap = 8
    let usedWidth = 0
    let count = 0

    for (let i = 0; i < itemRefs.current.length; i++) {
      const el = itemRefs.current[i]
      if (!el) break
      const itemWidth = el.offsetWidth + gap
      if (usedWidth + itemWidth + overflowButtonWidth > navWidth) break
      usedWidth += itemWidth
      count++
    }

    // Ensure at least MIN_OVERFLOW items are in the dropdown
    const maxVisible = allNavItems.length - MIN_OVERFLOW
    setVisibleCount(Math.min(count, maxVisible))
  }, [])

  useEffect(() => {
    // Wait for render, then calculate how many items fit
    const timer = setTimeout(calculateVisibleItems, 50)
    const observer = new ResizeObserver(() => {
      // Re-show max items to re-measure, then recalculate
      setVisibleCount(allNavItems.length - MIN_OVERFLOW)
      setTimeout(calculateVisibleItems, 50)
    })
    if (navRef.current) observer.observe(navRef.current)
    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [calculateVisibleItems])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }
    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside)
    }
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isDropdownOpen])

  useEffect(() => {
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

      // Only show blur when nav is revealed mid-page (not when scrolling away from top)
      setHasBlur(
        scrollInfo.current.mode === 'revealed' && y > SCROLL_THRESHOLD_BLUR
      )

      scrollInfo.current.lastY = y
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  return (
    <>
      <div
        ref={navOuterRef}
        className={`${styles.nav} ${styles['nav-fixed']} ${hasBlur ? styles['nav-blur'] : ''}`}
      >
        <div className={styles['nav-container']}>
          <Link href="/" className="padding-right-24px">
            <Image
              src="/images/logo.svg"
              alt="AI Safety logo"
              width={139}
              height={24}
              className="block"
            />
          </Link>

          <nav ref={navRef} className={styles['nav-menu']}>
            {visibleItems.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                className={styles['nav-item']}
                ref={el => {
                  itemRefs.current[i] = el
                }}
              >
                <div className={styles['nav-item-icon']}>
                  <Image
                    width={16}
                    height={16}
                    alt={`${item.label} icon`}
                    src={`/images/${item.icon}`}
                  />
                </div>
                <p className="paragraph-small-bold">{item.label}</p>
                {item.count && (
                  <p className="paragraph-xs color-teal-300">{item.count}</p>
                )}
              </Link>
            ))}

            <div
              ref={dropdownRef}
              className={styles['nav-item-last']}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <p className="paragraph-small-bold">+{overflowCount}</p>
              {isDropdownOpen && (
                <div className={styles['nav-dropdown']}>
                  {overflowItems.map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={styles['nav-dropdown-item']}
                      style={{ marginBottom: '8px' }}
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <div className={styles['nav-item-icon']}>
                        <Image
                          width={16}
                          height={16}
                          alt={`${item.label} icon`}
                          src={`/images/${item.icon}`}
                        />
                      </div>
                      <p className="paragraph-small-bold">{item.label}</p>
                      {item.count && (
                        <p className="paragraph-xs color-teal-300">
                          {item.count}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
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
          <Link href="/" onClick={() => setIsMenuOpen(false)}>
            <Image
              src="/images/logo.svg"
              alt="AI Safety logo"
              width={139}
              height={24}
              className="block"
            />
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
          {allNavItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={styles['nav-item']}
              onClick={() => setIsMenuOpen(false)}
            >
              <div className={styles['nav-item-icon']}>
                <Image
                  width={16}
                  height={16}
                  alt={`${item.label} icon`}
                  src={`/images/${item.icon}`}
                />
              </div>
              <p className="paragraph-default-bold">{item.label}</p>
              {item.count && (
                <p className="paragraph-small color-teal-300">{item.count}</p>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}
