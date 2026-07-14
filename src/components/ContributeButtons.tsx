import styles from './ContributeButtons.module.css'

interface ExtraLink {
  label: string
  description: string
  url: string
}

interface ContributeButtonsProps {
  suggestUrl: string
  suggestDescription: string
  extraLinks?: ExtraLink[]
}

export default function ContributeButtons({
  suggestUrl,
  suggestDescription,
  extraLinks,
}: ContributeButtonsProps) {
  return (
    <div className={styles.wrapper}>
      <a href={suggestUrl} target="_blank" rel="noopener noreferrer">
        <p className="paragraph-default-bold padding-bottom-8px">
          Suggest listing or correction{' '}
          <span className="color-teal-400">&rarr;</span>
        </p>
        <p className="paragraph-small color-teal-300">{suggestDescription}</p>
      </a>
      {extraLinks?.map(link => (
        <a
          key={link.url}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <p className="paragraph-default-bold padding-bottom-8px">
            {link.label} <span className="color-teal-400">&rarr;</span>
          </p>
          <p className="paragraph-small color-teal-300">{link.description}</p>
        </a>
      ))}
    </div>
  )
}
