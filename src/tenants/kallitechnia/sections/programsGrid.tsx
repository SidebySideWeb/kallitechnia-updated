'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { extractText, type LexicalDocument, type LexicalNode } from '@/lib/lexical'

/**
 * DESIGN-LOCKED Programs Grid Section
 * 
 * EXACT copy from v0.app - DO NOT MODIFY layout classes
 * CMS provides: title, subtitle, programs array
 * Frontend controls: ALL spacing, sizing, layout, typography
 */
interface ProgramCard {
  title?: string
  description?: string | LexicalDocument | LexicalNode[]
  image?: string | null
  imageAlt?: string
  buttonLabel?: string
  buttonUrl?: string
}

interface ProgramsGridProps {
  title?: string
  subtitle?: string
  programs?: ProgramCard[]
}

export function KallitechniaProgramsGrid({ title, subtitle, programs }: ProgramsGridProps) {
  // Safe content extraction - layout is locked
  const safeTitle = title || ''
  const safeSubtitle = subtitle || ''
  const safePrograms = Array.isArray(programs) ? programs : []

  if (safePrograms.length === 0) {
    return null
  }

  // EXACT v0.app structure - DO NOT MODIFY
  return (
    <section className="py-20 bg-background fade-in-section opacity-0">
      <div className="container mx-auto px-4">
        {safeTitle && (
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-balance">{safeTitle}</h2>
        )}
        {safeSubtitle && (
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            {safeSubtitle}
          </p>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {safePrograms.map((program, index) => {
            const safeProgramTitle = program.title || ''
            // Extract text from Lexical format if needed
            const safeProgramDesc = extractText(program.description)
            const safeProgramImage = program.image || null
            const safeProgramImageAlt = program.imageAlt || safeProgramTitle
            const safeButtonLabel = program.buttonLabel || 'Μάθετε Περισσότερα'
            const safeButtonUrl = program.buttonUrl || ''
            const sanitizedButtonUrl =
              safeButtonUrl && (safeButtonUrl.startsWith('http') || safeButtonUrl.startsWith('/'))
                ? safeButtonUrl
                : ''

            // Determine border color based on index (matching v0.app pattern)
            const borderColors = [
              'hover:border-primary',
              'hover:border-secondary',
              'hover:border-accent',
              'hover:border-primary',
            ]
            const gradientColors = [
              'from-primary/80',
              'from-secondary/80',
              'from-accent/80',
              'from-primary/80',
            ]
            const hoverColors = [
              'hover:bg-primary',
              'hover:bg-secondary',
              'hover:bg-accent',
              'hover:bg-primary',
            ]

            return (
              <Card
                key={index}
                className={`border-2 ${borderColors[index % 4]} transition-all hover:shadow-2xl hover:-translate-y-2 duration-300 rounded-2xl overflow-hidden group animate-fade-in-up`}
                style={{ animationDelay: `${(index + 1) * 0.1}s` }}
              >
                <div className="relative h-48 overflow-hidden">
                  {safeProgramImage ? (
                    <Image
                      src={safeProgramImage}
                      alt={safeProgramImageAlt}
                      fill
                      className="object-cover group-hover:scale-125 group-hover:rotate-2 transition-all duration-700"
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20" />
                  )}
                  <div className={`absolute inset-0 bg-gradient-to-t ${gradientColors[index % 4]} to-transparent`} />
                </div>
                <CardContent className="p-6">
                  {safeProgramTitle && (
                    <h3 className="text-2xl font-bold mb-3">{safeProgramTitle}</h3>
                  )}
                  {safeProgramDesc && (
                    <p className="text-muted-foreground leading-relaxed mb-4">{safeProgramDesc}</p>
                  )}
                  {sanitizedButtonUrl && (
                    <Button
                      variant="outline"
                      className={`w-full bg-transparent ${hoverColors[index % 4]} hover:text-white transition-all`}
                      asChild
                    >
                      <Link href={sanitizedButtonUrl}>{safeButtonLabel}</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
