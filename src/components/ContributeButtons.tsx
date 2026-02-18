import styles from './ContributeButtons.module.css'

interface ExtraLink {
  label: string
  description: string
  url: string
}

interface ContributeButtonsProps {
  suggestEntryUrl: string
  suggestCorrectionUrl: string
  noun: string
  extraLinks?: ExtraLink[]
}

export default function ContributeButtons({
  suggestEntryUrl,
  suggestCorrectionUrl,
  noun,
  extraLinks,
}: ContributeButtonsProps) {
  return (
    <div className={styles.wrapper}>
      <a href={suggestEntryUrl} target="_blank" rel="noopener noreferrer">
        <p className="paragraph-default-bold padding-bottom-8px">
          Suggest entry <span className="color-teal-300">&rarr;</span>
        </p>
        <p className="paragraph-small color-teal-300">
          Suggest a {noun} to be listed here
        </p>
      </a>
      <a href={suggestCorrectionUrl} target="_blank" rel="noopener noreferrer">
        <p className="paragraph-default-bold padding-bottom-8px">
          Suggest correction <span className="color-teal-300">&rarr;</span>
        </p>
        <p className="paragraph-small color-teal-300">
          Let us know of changes to a {noun}
        </p>
      </a>
      {extraLinks?.map(link => (
        <a
          key={link.url}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <p className="paragraph-default-bold padding-bottom-8px">
            {link.label} <span className="color-teal-300">&rarr;</span>
          </p>
          <p className="paragraph-small color-teal-300">{link.description}</p>
        </a>
      ))}
    </div>
  )
}
