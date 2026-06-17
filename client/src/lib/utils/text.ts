import React, { type ReactNode } from 'react';

export function linkifyText(text: string): ReactNode {
  const urlPattern = /(https?:\/\/[^\s]+|[a-zA-Z0-9][a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/g
  const parts = text.split(urlPattern)
  return parts.map((part, i) => {
    if (urlPattern.test(part)) {
      const href = part.startsWith('http') ? part : `https://${part}`
      return React.createElement(
        'a',
        {
          key: i,
          href,
          target: '_blank',
          rel: 'noopener noreferrer',
          className: 'text-primary hover:underline'
        },
        part
      )
    }
    return part
  })
}
