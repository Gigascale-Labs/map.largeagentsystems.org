'use client'

import { useEffect, useState } from 'react'
import styles from './UpButton.module.css'

export default function UpButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show button when scrolled more than 200px from top
      setIsVisible(window.scrollY > 200)
    }

    // Check initial scroll position
    handleScroll()

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!isVisible) return null

  return (
    <button
      className={styles['up-button']}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
    >
      ⌃
    </button>
  )
}
