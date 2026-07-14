import Link from 'next/link'
import UpButton from './UpButton'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className="margin-top-192px padding-bottom-24px">
      <div className="container-default">
        <div className="flex flex-col-mobile gap-56px margin-bottom-128px">
          {/* First footer column */}
          <div className="width-6-col">
            <div className="width-4-col">
              <p className="paragraph-small-bold color-white margin-bottom-24px">
                LargeAgentSystems.org
              </p>
              <p className="paragraph-small padding-bottom-32px">
                LargeAgentSystems.org is a project of Gigascale Laboratories.
              </p>
            </div>
          </div>

          {/* Second footer column */}
          <div className="width-3-col">
            <h4 className="paragraph-small-bold padding-bottom-16px">
              More resources
            </h4>
            <div
              className={`paragraph-small flex flex-col gap-8px opacity-80 ${styles.links}`}
            >
              <Link
                href="https://aisafetyeventsandtraining.substack.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                AI Safety Events &amp; Training
              </Link>
              <Link
                href="https://aisafetyfunding.substack.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                AI Safety Funding
              </Link>
              <Link
                href="https://www.LargeAgentSystems.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Join the LargeAgentSystems.org Community
              </Link>
            </div>
          </div>
        </div>
        <div className="divider margin-bottom-24px"></div>

        <div className="flex justify-between items-center flex-col-mobile gap-16px">
          <div className="flex items-center gap-8px">
            <p className="paragraph-xs">
              Maintained by Gigascale Laboratories.
            </p>
          </div>
          <p className="paragraph-xs opacity-80">
            (ɔ) 2026 · Released with permission from AISafety.com under the MIT
            Licence.
          </p>
        </div>
      </div>

      <UpButton />
    </footer>
  )
}
