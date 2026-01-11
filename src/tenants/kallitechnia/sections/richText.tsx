'use client'

import React from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { LexicalDocument, LexicalNode } from '@/lib/lexical'

/**
 * DESIGN-LOCKED Rich Text Section
 * 
 * EXACT copy from v0.app - DO NOT MODIFY layout classes
 * CMS provides: title, subtitle, content (Lexical format or string array)
 * Frontend controls: ALL spacing, sizing, layout, typography
 */
interface RichTextProps {
  title?: string
  subtitle?: string
  content?: LexicalDocument | LexicalNode[] | string[] | null
  _context?: {
    pageSlug?: string
    isHomepage?: boolean
    sectionIndex?: number
  }
}

export function KallitechniaRichText({ title, subtitle, content, _context }: RichTextProps) {
  const safeTitle = title || ''
  const safeSubtitle = subtitle || ''
  const safeContent = content || null

  if (!safeContent) {
    return null
  }

  // Reduce padding for first 5 sections on about page
  const isAboutPage = _context?.pageSlug === 'about'
  const isFirstFive = _context?.sectionIndex !== undefined && _context.sectionIndex < 5
  const paddingClass = isAboutPage && isFirstFive ? 'py-4' : 'py-20'

  // Normalize content to Lexical document format with root property
  let normalizedContent: LexicalDocument

  // Handle string arrays - render as plain text paragraphs
  if (Array.isArray(safeContent) && safeContent.length > 0 && typeof safeContent[0] === 'string') {
    return (
      <section className={`${paddingClass} bg-white fade-in-section opacity-0`}>
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {safeTitle && (
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 hover:scale-105 transition-transform">
                  {safeTitle}
                </h2>
                {safeSubtitle && (
                  <p className="text-2xl md:text-3xl font-semibold text-secondary">{safeSubtitle}</p>
                )}
              </div>
            )}
            <div className="space-y-6 text-lg leading-relaxed text-muted-foreground prose prose-lg max-w-none">
              {(safeContent as string[]).map((text, index) => (
                <p key={index} className="mb-4">{text}</p>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  // If it's already a LexicalDocument with root, use it as-is
  if (typeof safeContent === 'object' && safeContent !== null && 'root' in safeContent) {
    normalizedContent = safeContent as LexicalDocument
  }
  // If it's an array of LexicalNodes, wrap it in a root structure
  else if (Array.isArray(safeContent)) {
    normalizedContent = {
      root: {
        children: safeContent as LexicalNode[],
      },
    }
  }
  // If it's a single LexicalNode, wrap it in a root structure
  else if (typeof safeContent === 'object' && safeContent !== null) {
    normalizedContent = {
      root: {
        children: [safeContent as LexicalNode],
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

  // EXACT v0.app structure - DO NOT MODIFY
  return (
    <section className={`${paddingClass} bg-white fade-in-section opacity-0`}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {safeTitle && (
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 hover:scale-105 transition-transform">
                {safeTitle}
              </h2>
              {safeSubtitle && (
                <p className="text-2xl md:text-3xl font-semibold text-secondary">{safeSubtitle}</p>
              )}
            </div>
          )}
          <div className="space-y-6 text-lg leading-relaxed text-muted-foreground prose prose-lg max-w-none">
            <RichText data={normalizedContent as any} />
          </div>
        </div>
      </div>
    </section>
  )
}
