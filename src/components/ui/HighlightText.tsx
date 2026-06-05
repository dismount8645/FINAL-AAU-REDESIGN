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

if (import.meta.vitest) {
  describe('HighlightText', () => {
    it('returns text if query is empty', () => {
      render(<HighlightText text="Hello World" query="" />)
      expect(screen.getByText('Hello World')).toBeInTheDocument()
      expect(document.querySelector('strong')).toBeNull()
    })

    it('highlights matches correctly', () => {
      render(<HighlightText text="Hello World" query="world" />)
      expect(screen.getByText('Hello')).toBeInTheDocument()
      const highlighted = document.querySelector('strong')
      expect(highlighted).toBeInTheDocument()
      expect(highlighted?.textContent).toBe('World')
    })
  })
}
