import React from 'react'

/**
 * Converts email addresses and phone numbers in text to clickable links
 */
export function renderContactText(text: string): React.ReactNode {
  if (!text || typeof text !== 'string') {
    return text
  }

  // Email regex pattern
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi
  
  // Phone regex pattern (handles various formats)
  const phoneRegex = /(\+?[0-9]{1,4}[\s-]?[0-9]{1,4}[\s-]?[0-9]{1,9})/g

  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let textToProcess = text

  // First, find all matches (emails and phones)
  const matches: Array<{ type: 'email' | 'phone'; match: string; index: number }> = []

  // Find emails
  let emailMatch
  while ((emailMatch = emailRegex.exec(textToProcess)) !== null) {
    matches.push({
      type: 'email',
      match: emailMatch[0],
      index: emailMatch.index,
    })
  }

  // Find phones
  let phoneMatch
  while ((phoneMatch = phoneRegex.exec(textToProcess)) !== null) {
    // Check if this phone is not part of an email
    const isPartOfEmail = matches.some(
      (m) => m.type === 'email' && phoneMatch.index >= m.index && phoneMatch.index < m.index + m.match.length
    )
    if (!isPartOfEmail) {
      matches.push({
        type: 'phone',
        match: phoneMatch[0],
        index: phoneMatch.index,
      })
    }
  }

  // Sort matches by index
  matches.sort((a, b) => a.index - b.index)

  // Build React nodes
  let currentIndex = 0
  for (const match of matches) {
    // Add text before match
    if (match.index > currentIndex) {
      const beforeText = textToProcess.substring(currentIndex, match.index)
      if (beforeText) {
        parts.push(beforeText)
      }
    }

    // Add link for match
    if (match.type === 'email') {
      parts.push(
        <a
          key={`email-${match.index}`}
          href={`mailto:${match.match}`}
          className="text-primary hover:underline"
        >
          {match.match}
        </a>
      )
    } else if (match.type === 'phone') {
      // Clean phone number for tel: link (remove spaces and dashes)
      const cleanPhone = match.match.replace(/[\s-]/g, '')
      parts.push(
        <a
          key={`phone-${match.index}`}
          href={`tel:${cleanPhone}`}
          className="text-primary hover:underline"
        >
          {match.match}
        </a>
      )
    }

    currentIndex = match.index + match.match.length
  }

  // Add remaining text
  if (currentIndex < textToProcess.length) {
    parts.push(textToProcess.substring(currentIndex))
  }

  // If no matches found, return original text
  if (parts.length === 0) {
    return text
  }

  return <>{parts}</>
}
