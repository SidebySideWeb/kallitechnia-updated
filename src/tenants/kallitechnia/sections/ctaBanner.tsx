'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { extractText, type LexicalDocument, type LexicalNode } from '@/lib/lexical'

/**
 * DESIGN-LOCKED CTA Banner Section
 * 
 * EXACT copy from v0.app - DO NOT MODIFY layout classes
 * CMS provides: title, description (string or Lexical format), buttonLabel, buttonUrl
 * Frontend controls: ALL spacing, sizing, layout, typography
 */
interface CtaBannerProps {
  title?: string
  description?: string | LexicalDocument | LexicalNode[]
  buttonLabel?: string
  buttonUrl?: string
}

export function KallitechniaCtaBanner({ title, description, buttonLabel, buttonUrl }: CtaBannerProps) {
  // Safe content extraction - layout is locked
  const safeTitle = title || ''
  // Extract text from Lexical format if needed
  const safeDescription = extractText(description)
  const safeButtonLabel = buttonLabel || ''
  const safeButtonUrl = buttonUrl || ''
  
  // Sanitize URL
  const sanitizedUrl = safeButtonUrl && (safeButtonUrl.startsWith('http') || safeButtonUrl.startsWith('/'))
    ? safeButtonUrl
    : ''

  // EXACT v0.app structure - DO NOT MODIFY
  return (
    <section className="py-20 bg-background fade-in-section opacity-0">
      <div className="container mx-auto px-4">
        <div className="gradient-purple-orange rounded-3xl p-12 md:p-16 text-center text-white relative overflow-hidden hover:scale-[1.02] transition-transform duration-500">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse" />
            <div
              className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: '1s' }}
            />
          </div>
          <div className="relative z-10">
            {safeTitle && (
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance animate-fade-in-up">
                {safeTitle}
              </h2>
            )}
            {safeDescription && (
              <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
                {safeDescription}
              </p>
            )}
            {safeButtonLabel && sanitizedUrl && (
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 hover:scale-110 transition-all duration-300 text-lg px-8 shadow-2xl"
                asChild
              >
                <Link href={sanitizedUrl} className="flex items-center gap-2">
                  {safeButtonLabel}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
