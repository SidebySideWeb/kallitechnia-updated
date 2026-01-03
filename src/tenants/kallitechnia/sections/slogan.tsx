'use client'

import { extractText, type LexicalDocument, type LexicalNode } from '@/lib/lexical'

/**
 * DESIGN-LOCKED Slogan Section
 * 
 * EXACT copy from v0.app - DO NOT MODIFY layout classes
 * CMS provides: text (string or Lexical format)
 * Frontend controls: ALL spacing, sizing, layout, typography
 */
interface SloganProps {
  text?: string | LexicalDocument | LexicalNode[]
}

export function KallitechniaSlogan({ text }: SloganProps) {
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
          <div className="bg-gradient-to-r from-primary via-secondary to-accent p-8 rounded-2xl hover:scale-105 transition-transform duration-500 shadow-xl hover:shadow-2xl">
            <p className="text-xl md:text-2xl font-bold text-white">Σύνθημά του συλλόγου μας είναι:</p>
            <p className="text-2xl md:text-3xl font-bold text-white mt-4">
              {safeText.split(',').map((part, index, array) => (
                <span key={index}>
                  {part.trim()}
                  {index < array.length - 1 && <br />}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
