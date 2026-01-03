'use client'

import { extractText, type LexicalDocument, type LexicalNode } from '@/lib/lexical'

/**
 * DESIGN-LOCKED Quote Section
 * 
 * EXACT copy from v0.app - DO NOT MODIFY layout classes
 * CMS provides: text (string or Lexical format)
 * Frontend controls: ALL spacing, sizing, layout, typography
 */
interface QuoteProps {
  text?: string | LexicalDocument | LexicalNode[]
}

export function KallitechniaQuote({ text }: QuoteProps) {
  // Safe content extraction - extract text from Lexical format if needed
  const safeText = extractText(text)

  if (!safeText) {
    return null
  }

  // EXACT v0.app structure - DO NOT MODIFY
  return (
    <section className="py-20 bg-white fade-in-section opacity-0">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="py-8">
            <p className="text-2xl md:text-3xl font-semibold text-primary italic hover:scale-105 transition-transform duration-300">
              {safeText}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
