'use client'

import Image from 'next/image'
import { Sparkles } from 'lucide-react'

/**
 * DESIGN-LOCKED Sponsors Section
 * 
 * EXACT copy from v0.app - DO NOT MODIFY layout classes
 * CMS provides: title, subtitle, sponsors array
 * Frontend controls: ALL spacing, sizing, layout, typography
 */
interface Sponsor {
  logo?: string | null
  name?: string
}

interface SponsorsProps {
  title?: string
  subtitle?: string
  sponsors?: Sponsor[]
}

export function KallitechniaSponsors({ title, subtitle, sponsors }: SponsorsProps) {
  // Safe content extraction - layout is locked
  const safeTitle = title || ''
  const safeSubtitle = subtitle || ''
  const safeSponsors = Array.isArray(sponsors) && sponsors.length > 0 ? sponsors : []

  // If no sponsors provided, show placeholder grid (matching v0.app)
  const displayItems = safeSponsors.length > 0
    ? safeSponsors
    : Array.from({ length: 6 }, (_, i) => ({ name: `Χορηγός ${i + 1}` }))

  // EXACT v0.app structure - DO NOT MODIFY
  return (
    <section className="py-20 bg-white fade-in-section opacity-0">
      <div className="container mx-auto px-4">
        {safeTitle && (
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-balance">{safeTitle}</h2>
        )}
        {safeSubtitle && (
          <p className="text-center text-muted-foreground text-lg mb-12">{safeSubtitle}</p>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center max-w-5xl mx-auto">
          {displayItems.map((sponsor, index) => {
            const safeLogo = sponsor.logo || null
            const safeName = sponsor.name || `Χορηγός ${index + 1}`

            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 flex items-center justify-center h-32 hover:shadow-xl hover:scale-110 transition-all duration-300 border-2 border-transparent hover:border-primary cursor-pointer"
              >
                {safeLogo ? (
                  <Image
                    src={safeLogo}
                    alt={safeName}
                    width={120}
                    height={80}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="text-center">
                    <Sparkles className="h-12 w-12 text-primary mx-auto mb-2 animate-pulse" />
                    <p className="text-sm font-semibold text-muted-foreground">{safeName}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
