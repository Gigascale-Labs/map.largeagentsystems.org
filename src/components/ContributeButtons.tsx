import styles from './ContributeButtons.module.css'

interface ContributeButtonsProps {
  suggestEntryUrl: string
  suggestCorrectionUrl: string
  noun: string
}

export default function ContributeButtons({
  suggestEntryUrl,
  suggestCorrectionUrl,
  noun,
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
    </div>
  )
}
