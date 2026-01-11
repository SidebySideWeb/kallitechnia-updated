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
 * Normalizes content to the format expected by RichText (SerializedEditorState with root property)
 * Links are automatically rendered by RichText and styled via CSS
 */
export function RichTextRenderer({ content, className }: RichTextRendererProps) {
  if (!content) {
    return null
  }

  // Handle string arrays - RichText doesn't support these, so render as plain text
  if (Array.isArray(content) && content.length > 0 && typeof content[0] === 'string') {
    return (
      <div className={className}>
        {(content as string[]).map((text, index) => (
          <p key={index} className="mb-4">{text}</p>
        ))}
      </div>
    )
  }

  // Normalize content to Lexical document format with root property
  let normalizedContent: LexicalDocument

  // If it's already a LexicalDocument with root, use it as-is
  if (typeof content === 'object' && content !== null && 'root' in content) {
    normalizedContent = content as LexicalDocument
  }
  // If it's an array of LexicalNodes, wrap it in a root structure
  else if (Array.isArray(content)) {
    normalizedContent = {
      root: {
        children: content as LexicalNode[],
      },
    }
  }
  // If it's a single LexicalNode, wrap it in a root structure
  else if (typeof content === 'object' && content !== null) {
    normalizedContent = {
      root: {
        children: [content as LexicalNode],
      },
    }
  }
  // Fallback: empty document
  else {
    normalizedContent = {
      root: {
        children: [],
      },
    }
  }

  // Type assertion needed because RichText expects SerializedEditorState
  // which is compatible with our LexicalDocument structure
  // RichText automatically renders links, we style them via CSS class on wrapper
  return (
    <div className={`rich-text-content ${className || ''}`}>
      <RichText data={normalizedContent as any} />
    </div>
  )
}
