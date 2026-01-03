'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Calendar, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { extractText, type LexicalDocument, type LexicalNode } from '@/lib/lexical'
import { extractImageUrl } from '@/lib/imageUtils'

/**
 * DESIGN-LOCKED News Grid Section
 * 
 * EXACT copy from v0.app - DO NOT MODIFY layout classes
 * CMS provides: title, subtitle, buttonLabel, buttonUrl, newsItems array
 * Frontend controls: ALL spacing, sizing, layout, typography
 */
interface NewsItem {
  title?: string
  date?: string
  excerpt?: string | LexicalDocument | LexicalNode[]
  image?: string | null
  imageAlt?: string
  readMoreLabel?: string
  readMoreUrl?: string
}

interface NewsGridProps {
  title?: string
  subtitle?: string
  buttonLabel?: string
  buttonUrl?: string
  newsItems?: NewsItem[]
}

export function KallitechniaNewsGrid({
  title,
  subtitle,
  buttonLabel,
  buttonUrl,
  newsItems,
}: NewsGridProps) {
  // Safe content extraction - layout is locked
  const safeTitle = title || ''
  const safeSubtitle = subtitle || ''
  const safeButtonLabel = buttonLabel || 'Όλα τα Νέα'
  const safeButtonUrl = buttonUrl || '/news'
  const safeNewsItems = Array.isArray(newsItems) ? newsItems : []

  if (safeNewsItems.length === 0) {
    return null
  }

  const sanitizedButtonUrl =
    safeButtonUrl && (safeButtonUrl.startsWith('http') || safeButtonUrl.startsWith('/'))
      ? safeButtonUrl
      : '/news'

  // EXACT v0.app structure - DO NOT MODIFY
  return (
    <section className="py-20 bg-background fade-in-section opacity-0">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            {safeTitle && (
              <h2 className="text-4xl md:text-5xl font-bold mb-2 text-balance">{safeTitle}</h2>
            )}
            {safeSubtitle && (
              <p className="text-muted-foreground text-lg">{safeSubtitle}</p>
            )}
          </div>
          <Button
            variant="outline"
            asChild
            className="hidden md:flex bg-transparent hover:scale-105 transition-transform"
          >
            <Link href={sanitizedButtonUrl}>
              {safeButtonLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {safeNewsItems.map((item, index) => {
            const safeItemTitle = item.title || ''
            const safeItemDate = item.date || ''
            // Extract text from Lexical format if needed
            const safeItemExcerpt = extractText(item.excerpt)
            // Extract and normalize image URL to absolute URL for Next.js Image component
            const safeItemImage = extractImageUrl(item.image)
            const safeItemImageAlt = item.imageAlt || safeItemTitle
            const safeItemReadMoreUrl = item.readMoreUrl || sanitizedButtonUrl
            const sanitizedItemReadMoreUrl =
              safeItemReadMoreUrl && (safeItemReadMoreUrl.startsWith('http') || safeItemReadMoreUrl.startsWith('/'))
                ? safeItemReadMoreUrl
                : sanitizedButtonUrl
            const safeReadMoreLabel = item.readMoreLabel || 'Διαβάστε περισσότερα'

            return (
              <Card
                key={index}
                className="rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="relative h-56 overflow-hidden group">
                  {safeItemImage ? (
                    <Image
                      src={safeItemImage}
                      alt={safeItemImageAlt}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20" />
                  )}
                </div>
                <CardContent className="p-6">
                  {safeItemDate && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Calendar className="h-4 w-4" />
                      <span>{safeItemDate}</span>
                    </div>
                  )}
                  {safeItemTitle && (
                    <h3 className="text-xl font-bold mb-3 hover:text-primary transition-colors">
                      {safeItemTitle}
                    </h3>
                  )}
                  {safeItemExcerpt && (
                    <p className="text-muted-foreground leading-relaxed mb-4">{safeItemExcerpt}</p>
                  )}
                  <Button variant="link" className="p-0 hover:translate-x-2 transition-transform" asChild>
                    <Link href={sanitizedItemReadMoreUrl}>
                      {safeReadMoreLabel}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
        <div className="text-center mt-8 md:hidden">
          <Button variant="outline" asChild>
            <Link href={sanitizedButtonUrl}>
              {safeButtonLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
