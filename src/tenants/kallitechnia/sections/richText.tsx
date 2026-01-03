'use client'

import React from 'react'
import { renderLexicalContent, type LexicalDocument, type LexicalNode } from '@/lib/lexical'

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

  const renderedContent = renderLexicalContent(safeContent)

  if (renderedContent.length === 0) {
    return null
  }

  // Reduce padding for first 3 sections on about page
  const isAboutPage = _context?.pageSlug === 'about'
  const isFirstThree = _context?.sectionIndex !== undefined && _context.sectionIndex < 3
  const paddingClass = isAboutPage && isFirstThree ? 'py-8' : 'py-20'

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
          <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
            {renderedContent}
          </div>
        </div>
      </div>
    </section>
  )
}
