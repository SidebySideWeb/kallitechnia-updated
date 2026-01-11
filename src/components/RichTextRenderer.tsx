'use client'

import { RichText } from '@payloadcms/richtext-lexical/react'
import type { LexicalDocument, LexicalNode } from '@/lib/lexical'

interface RichTextRendererProps {
  content: LexicalDocument | LexicalNode[] | string[] | null | undefined
  className?: string
}

/**
 * Client component wrapper for Payload's RichText component
 * Allows using RichText in server components
 */
export function RichTextRenderer({ content, className }: RichTextRendererProps) {
  if (!content) {
    return null
  }

  return (
    <div className={className}>
      <RichText content={content} />
    </div>
  )
}
