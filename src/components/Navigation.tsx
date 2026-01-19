import Image from 'next/image'
import Link from 'next/link'
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

export default function Navigation() {
  return (
    <div className={`${styles.nav} ${styles.navWrapper} px-6 py-4`}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.brand}>
          <Image
            src="/images/logo.svg"
            alt="AI Safety logo"
            width={139}
            height={24}
            className="block"
          />
        </Link>

        <nav className={styles.navMenu}>
          {navItems.map(item => (
            <Link key={item.href} href={item.href} className={styles.navItem}>
              <div className={styles.navItemIcon}>
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

          <div className={styles.navItemLast}>
            <p className="paragraph-small-bold">+4</p>
          </div>
        </nav>
      </div>
    </div>
  )
}
