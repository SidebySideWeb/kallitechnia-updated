'use client'

import { renderLexicalContent } from '@/lib/lexical'
import type { LexicalDocument, LexicalNode } from '@/lib/lexical'

interface RichTextRendererProps {
  content: LexicalDocument | LexicalNode[] | string[] | null | undefined
  className?: string
}

/**
 * Client component wrapper for custom Lexical renderer
 * Uses our custom renderLexicalContent function which properly handles links
 */
export function RichTextRenderer({ content, className }: RichTextRendererProps) {
  if (!content) {
    return null
  }

  const rendered = renderLexicalContent(content)

  if (!rendered || rendered.length === 0) {
    return null
  }

  return (
    <div className={`rich-text-content ${className || ''}`}>
      {rendered}
    </div>
  )
}
