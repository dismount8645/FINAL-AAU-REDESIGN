interface HighlightTextProps {
  text: string
  query: string
}

export default function HighlightText({ text, query }: HighlightTextProps) {
  if (!query) return <>{text}</>
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const parts = text.split(new RegExp(`(${escapedQuery})`, 'gi'))
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <strong
            key={i}
            className="font-black text-primary dark:text-accent bg-primary/10 dark:bg-accent/20 px-0.5 rounded-[var(--radius-sm)]"
          >
            {part}
          </strong>
        ) : (
          part
        )
      )}
    </>
  )
}


