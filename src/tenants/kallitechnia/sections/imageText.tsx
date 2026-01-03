'use client'

import Image from 'next/image'
import { extractParagraphs, type LexicalDocument, type LexicalNode } from '@/lib/lexical'
import { extractImageUrl } from '@/lib/imageUtils'

/**
 * DESIGN-LOCKED Image Text Section
 * 
 * EXACT copy from v0.app - DO NOT MODIFY layout classes
 * CMS provides: image, imagePosition, title, content (string, array, or Lexical format)
 * Frontend controls: ALL spacing, sizing, layout, typography
 */
interface ImageTextProps {
  title?: string
  content?: string | string[] | LexicalDocument | LexicalNode[]
  image?: string | null
  imageAlt?: string
  imagePosition?: 'left' | 'right'
  _context?: {
    pageSlug?: string
    isHomepage?: boolean
    sectionIndex?: number
  }
}

export function KallitechniaImageText({
  title,
  content,
  image,
  imageAlt,
  imagePosition = 'left',
  _context,
}: ImageTextProps) {
  // Safe content extraction - layout is locked
  const safeTitle = title || ''
  // Extract paragraphs from Lexical format if needed
  const safeContent = extractParagraphs(content)
  // Extract and normalize image URL to absolute URL for Next.js Image component
  const safeImage = extractImageUrl(image)
  const safeImageAlt = imageAlt || safeTitle

  if (!safeTitle && safeContent.length === 0) {
    return null
  }

  // Reduce padding for first 5 sections on about page
  const isAboutPage = _context?.pageSlug === 'about'
  const isFirstFive = _context?.sectionIndex !== undefined && _context.sectionIndex < 5
  const paddingClass = isAboutPage && isFirstFive ? 'py-4' : 'py-20'

  // EXACT v0.app structure - DO NOT MODIFY
  return (
    <section className={`${paddingClass} bg-background fade-in-section opacity-0`}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {safeImage && imagePosition === 'left' && (
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-lg group">
                <Image
                  src={safeImage}
                  alt={safeImageAlt}
                  fill
                  className="object-cover group-hover:scale-110 group-hover:rotate-1 transition-all duration-700"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            )}
            <div className="space-y-6">
              {safeTitle && (
                <h2 className="text-4xl md:text-5xl font-bold text-balance hover:text-primary transition-colors">
                  {safeTitle}
                </h2>
              )}
              {safeContent.map((paragraph, index) => (
                <p key={index} className="text-lg leading-relaxed text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </div>
            {safeImage && imagePosition === 'right' && (
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-lg group">
                <Image
                  src={safeImage}
                  alt={safeImageAlt}
                  fill
                  className="object-cover group-hover:scale-110 group-hover:rotate-1 transition-all duration-700"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
