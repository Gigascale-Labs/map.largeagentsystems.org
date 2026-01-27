import Link from 'next/link'
import Image from 'next/image'
import UpButton from './UpButton'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.siteFooter}>
      <div className="container-default">
        <div className={styles.footerGrid}>
          <div className={styles.footerMain}>
            <Image
              src="/images/logo.svg"
              alt="AI Safety logo"
              width={150}
              height={50}
              className={styles.footerLogo}
            />
            <p className={styles.footerDescription}>
              We&apos;re a global team of volunteers and professionals from
              various disciplines who believe AI poses a grave risk of
              extinction to humanity.
            </p>
            <Link href="/about" className={styles.footerButton}>
              Learn more about us
            </Link>
          </div>

          <div className={styles.footerColumn}>
            <h4 className={styles.footerHeading}>Help us out</h4>
            <Link
              href="https://airtable.com/appF8XfZUGXtfi40E/pagndDvdya1DSqoxN/form"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footerLink}
            >
              Suggest a correction
            </Link>
            <Link href="/feedback" className={styles.footerLink}>
              Give anonymous feedback
            </Link>
            <Link
              href="https://www.every.org/alignment-ecosystem-development"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footerLink}
            >
              Donate
            </Link>
          </div>

          <div className={styles.footerColumn}>
            <h4 className={styles.footerHeading}>Newsletters</h4>
            <Link
              href="https://aisafetyeventsandtraining.substack.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footerLink}
            >
              AI Safety Events &amp; Training
            </Link>
            <Link
              href="https://aisafetyfunding.substack.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footerLink}
            >
              AI Safety Funding (coming soon)
            </Link>
            <Link
              href="https://aisafetycom.substack.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footerLink}
            >
              AISafety.com Updates
            </Link>
          </div>
        </div>

        <div className={styles.footerDivider}></div>

        <div className={styles.footerBottom}>
          <div className={styles.footerAttribution}>
            <Image
              width={80}
              height={32}
              alt="Community thumbnails"
              src="/images/thumbnails.png"
            />
            <p className={styles.footerCredit}>
              Maintained by AI safety community-builders
            </p>
          </div>
          <p className={styles.footerCopyright}>
            (ɔ) 2025 · This site is released under a CC BY-SA license
          </p>
        </div>
      </div>

      <UpButton />
    </footer>
  )
}
