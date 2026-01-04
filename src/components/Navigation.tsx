'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import styles from './Navigation.module.css'

const navItems = [
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
]

const SCROLL_THRESHOLD_TOP = 10
const SCROLL_THRESHOLD_HIDE = 100

export default function Navigation() {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      const scrollIsOnTop = currentScrollY <= SCROLL_THRESHOLD_TOP
      const isScrollingUp = currentScrollY <= lastScrollY
      const isScrollingDown = !isScrollingUp
      const hasScrolledEnoughToHide = currentScrollY > SCROLL_THRESHOLD_HIDE

      if (scrollIsOnTop || isScrollingUp) {
        setIsVisible(true)
      } else if (isScrollingDown && hasScrolledEnoughToHide) {
        setIsVisible(false)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY, isVisible])
  return (
    <div
      className={`nav w-nav px-6 py-4 ${styles.navSticky} ${isVisible ? styles.visible : styles.hidden}`}
    >
      <div className="nav-container">
        <Link href="/" className="brand pr-6 w-nav-brand">
          <Image
            src="/images/logo.svg"
            alt="AI Safety logo"
            width={139}
            height={24}
            className="block"
          />
        </Link>

        <nav className="nav-menu w-nav-menu">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-item inline-block"
            >
              <div className="nav-item-icon">
                <Image
                  width={16}
                  height={16}
                  alt={`${item.label} icon`}
                  src={`/images/${item.icon}`}
                />
              </div>
              <p className="paragraph-small-bold">{item.label}</p>
              <p className="paragraph-xs color-teal-300">{item.count}</p>
            </Link>
          ))}

          <div className="nav-item-last">
            <p className="paragraph-small-bold">+4</p>
          </div>
        </nav>
      </div>
    </div>
  )
}
