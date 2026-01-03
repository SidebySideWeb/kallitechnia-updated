'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { extractText, type LexicalDocument, type LexicalNode } from '@/lib/lexical'

/**
 * DESIGN-LOCKED Hero Section
 * 
 * EXACT copy from v0.app - DO NOT MODIFY layout classes
 * CMS provides: title, subtitle (string or Lexical format), backgroundImage, ctaLabel, ctaUrl
 * Frontend controls: ALL spacing, sizing, layout, typography
 * 
 * Two variants:
 * - With backgroundImage: Full hero with image (homepage style)
 * - Without backgroundImage: Gradient hero with decorative blur circles (other pages style)
 */
interface HeroProps {
  title?: string | LexicalDocument | LexicalNode[]
  subtitle?: string | LexicalDocument | LexicalNode[]
  backgroundImage?: string | null
  ctaLabel?: string
  ctaUrl?: string
}

export function KallitechniaHero({ title, subtitle, backgroundImage, ctaLabel, ctaUrl }: HeroProps) {
  // Safe content extraction - extract text from Lexical format if needed
  const safeTitle = extractText(title)
  const safeSubtitle = extractText(subtitle)
  const safeBackgroundImage = backgroundImage || null
  const safeCtaLabel = ctaLabel || ''
  const safeCtaUrl = ctaUrl || ''
  
  // Sanitize URL
  const sanitizedUrl = safeCtaUrl && (safeCtaUrl.startsWith('http') || safeCtaUrl.startsWith('/'))
    ? safeCtaUrl
    : ''

  // If backgroundImage is provided, use homepage hero style
  if (safeBackgroundImage) {
    // EXACT v0.app homepage hero structure - DO NOT MODIFY
    return (
      <section className="relative overflow-hidden min-h-[600px] flex items-center">
        <div className="absolute inset-0">
          <Image
            src={safeBackgroundImage}
            alt="Προπόνηση γυμναστικής"
            fill
            className="object-cover animate-ken-burns"
            priority
            fetchPriority="high"
            sizes="100vw"
            quality={85}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-transparent" />
        </div>
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-2xl text-white animate-fade-in-up">
            {safeTitle && (
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-balance">
                {safeTitle}
              </h1>
            )}
            {safeSubtitle && (
              <p className="text-xl md:text-2xl mb-8 leading-relaxed text-white/90">
                {safeSubtitle}
              </p>
            )}
            {safeCtaLabel && sanitizedUrl && (
              <Button
                size="lg"
                className="bg-secondary text-white hover:bg-secondary/90 hover:scale-105 transition-all text-lg px-8 shadow-lg"
                asChild
              >
                <Link href={sanitizedUrl}>{safeCtaLabel}</Link>
              </Button>
            )}
          </div>
        </div>
      </section>
    )
  }

  // If no backgroundImage, use gradient hero style (other pages)
  // EXACT v0.app gradient hero structure - DO NOT MODIFY
  return (
    <section className="relative bg-gradient-to-br from-accent via-primary to-secondary py-24 overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 right-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-10 left-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {safeTitle && (
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white text-balance drop-shadow-lg animate-fade-in-up">
              {safeTitle}
            </h1>
          )}
          {safeSubtitle && (
            <p className="text-xl leading-relaxed text-white/90 drop-shadow-md">
              {safeSubtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
