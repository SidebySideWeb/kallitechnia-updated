'use client'

import React from 'react'
import Image from 'next/image'
import { renderLexicalContent, extractParagraphs, type LexicalDocument, type LexicalNode } from '@/lib/lexical'
import { extractImageUrl } from '@/lib/imageUtils'

/**
 * DESIGN-LOCKED Welcome Section
 * 
 * EXACT copy from v0.app - DO NOT MODIFY layout classes
 * CMS provides: image, title, paragraphs (array of text or Lexical format)
 * Frontend controls: ALL spacing, sizing, layout, typography
 */
interface WelcomeProps {
  image?: string | null
  title?: string
  paragraphs?: string[] | LexicalDocument | LexicalNode[]
}

export function KallitechniaWelcome({ image, title, paragraphs }: WelcomeProps) {
  // Safe content extraction - layout is locked
  const safeImage = extractImageUrl(image) || 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_6321-EPivdvbOD9wX1IPMd2dA4e3aZlVtiE.jpeg'
  const safeTitle = title || ''
  
  // Try to render Lexical content first (preserves formatting)
  // If that doesn't work, fall back to extracting plain text paragraphs
  let renderedContent: React.ReactNode[] = []
  
  if (paragraphs) {
    // Check if it's Lexical format (object or array of objects)
    const isLexicalFormat = 
      (typeof paragraphs === 'object' && paragraphs !== null && !Array.isArray(paragraphs)) ||
      (Array.isArray(paragraphs) && paragraphs.length > 0 && typeof paragraphs[0] === 'object' && paragraphs[0] !== null && 'type' in paragraphs[0])
    
    if (isLexicalFormat) {
      // Use renderLexicalContent to properly render with formatting
      renderedContent = renderLexicalContent(paragraphs)
    } else {
      // Fall back to plain text extraction
      const safeParagraphs = extractParagraphs(paragraphs)
      renderedContent = safeParagraphs.map((paragraph, index) => (
        <p key={index} className="text-lg leading-relaxed text-muted-foreground">
          {paragraph}
        </p>
      ))
    }
  }

  // EXACT v0.app structure - DO NOT MODIFY
  return (
    <section className="py-20 bg-white fade-in-section opacity-0">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl group">
            <Image
              src={safeImage}
              alt="Ελένη Δαρδαμάνη - Ιδρύτρια"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          <div className="space-y-4">
            {safeTitle && (
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance hover:text-primary transition-colors">
                {safeTitle}
              </h2>
            )}
            {renderedContent.length > 0 ? (
              renderedContent
            ) : (
              // Fallback if no content
              <p className="text-lg leading-relaxed text-muted-foreground">
                Καλώς ήρθατε στον σύλλογό μας.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
