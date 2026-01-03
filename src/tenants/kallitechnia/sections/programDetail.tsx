'use client'

import Image from 'next/image'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { extractText, type LexicalDocument, type LexicalNode } from '@/lib/lexical'

/**
 * DESIGN-LOCKED Program Detail Section
 * 
 * EXACT copy from v0.app - DO NOT MODIFY layout classes
 * CMS provides: title, image, imagePosition, description, schedule, coach info, additionalInfo
 * Frontend controls: ALL spacing, sizing, layout, typography
 */
interface ScheduleSlot {
  day?: string
  time?: string
  level?: string
}

interface CoachInfo {
  name?: string
  photo?: string | null
  studies?: string
  bio?: string
}

interface ProgramDetailProps {
  title?: string
  image?: string | null
  imagePosition?: 'left' | 'right'
  description?: string | LexicalDocument | LexicalNode[]
  schedule?: ScheduleSlot[]
  coachName?: string
  coachPhoto?: string | null
  coachStudies?: string
  coachBio?: string | LexicalDocument | LexicalNode[]
  additionalInfo?: string | null | LexicalDocument | LexicalNode[]
  downloadLabel?: string
  downloadUrl?: string
}

export function KallitechniaProgramDetail({
  title,
  image,
  imagePosition = 'left',
  description,
  schedule,
  coachName,
  coachPhoto,
  coachStudies,
  coachBio,
  additionalInfo,
  downloadLabel,
  downloadUrl,
}: ProgramDetailProps) {
  // Safe content extraction - layout is locked
  const safeTitle = title || ''
  const safeImage = image || null
  // Extract text from Lexical format if needed
  const safeDescription = extractText(description)
  const safeSchedule = Array.isArray(schedule) ? schedule : []
  const safeCoachName = coachName || ''
  const safeCoachPhoto = coachPhoto || null
  const safeCoachStudies = coachStudies || ''
  // Extract text from Lexical format if needed
  const safeCoachBio = extractText(coachBio)
  const safeAdditionalInfo = extractText(additionalInfo)
  const safeDownloadLabel = downloadLabel || 'Κατέβασε το Πρόγραμμα (PDF)'
  const safeDownloadUrl = downloadUrl || ''
  const sanitizedDownloadUrl =
    safeDownloadUrl && (safeDownloadUrl.startsWith('http') || safeDownloadUrl.startsWith('/'))
      ? safeDownloadUrl
      : ''

  // EXACT v0.app structure - DO NOT MODIFY
  return (
    <section className="py-20 bg-background fade-in-section opacity-0">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Title */}
          {safeTitle && (
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-12 text-center text-balance">
              {safeTitle}
            </h2>
          )}

          {/* Content Layout - Alternating */}
          <div
            className={`grid md:grid-cols-2 gap-12 items-start mb-8 ${
              imagePosition === 'right' ? 'md:flex-row-reverse' : ''
            }`}
          >
            {/* Image */}
            {safeImage && (
              <div className={`${imagePosition === 'right' ? 'md:order-2' : 'md:order-1'}`}>
                <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src={safeImage}
                    alt={safeTitle}
                    fill
                    className="object-cover"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            )}

            {/* Description */}
            <div className={`space-y-6 ${imagePosition === 'right' ? 'md:order-1' : 'md:order-2'}`}>
              {safeDescription && (
                <p className="text-lg leading-relaxed text-muted-foreground">{safeDescription}</p>
              )}

              {/* Additional Info */}
              {safeAdditionalInfo && (
                <p className="text-base leading-relaxed text-muted-foreground bg-primary/5 p-4 rounded-xl">
                  {safeAdditionalInfo}
                </p>
              )}

              {/* Schedule Table */}
              {safeSchedule.length > 0 && (
                <div className="bg-background/50 rounded-xl p-6 border">
                  <h3 className="text-2xl font-bold text-primary mb-4">Εβδομαδιαίο Πρόγραμμα</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-2 font-semibold">Ημέρα</th>
                          <th className="text-left py-3 px-2 font-semibold">Ώρα</th>
                          <th className="text-left py-3 px-2 font-semibold">Επίπεδο</th>
                        </tr>
                      </thead>
                      <tbody>
                        {safeSchedule.map((slot, idx) => (
                          <tr key={idx} className="border-b last:border-0">
                            <td className="py-3 px-2">{slot.day || ''}</td>
                            <td className="py-3 px-2">{slot.time || ''}</td>
                            <td className="py-3 px-2">{slot.level || ''}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Download Button */}
              {sanitizedDownloadUrl && (
                <Button className="w-full md:w-auto bg-secondary hover:bg-secondary/90 text-white" asChild>
                  <a href={sanitizedDownloadUrl} download>
                    <Download className="mr-2 h-4 w-4" />
                    {safeDownloadLabel}
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Coach Info */}
          {safeCoachName && (
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 md:p-12">
              <h3 className="text-3xl font-bold text-primary mb-8 text-center">Προπονητής/τρια</h3>
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                {/* Coach Photo */}
                {safeCoachPhoto && (
                  <div className="relative w-48 h-48 rounded-full overflow-hidden shadow-lg flex-shrink-0">
                    <Image
                      src={safeCoachPhoto}
                      alt={safeCoachName}
                      fill
                      className="object-cover"
                      loading="lazy"
                      sizes="192px"
                    />
                  </div>
                )}

                {/* Coach Details */}
                <div className="flex-1 text-center md:text-left space-y-4">
                  <h4 className="text-2xl font-bold text-primary">{safeCoachName}</h4>
                  {safeCoachStudies && (
                    <p className="text-accent font-semibold">{safeCoachStudies}</p>
                  )}
                  {safeCoachBio && (
                    <p className="text-lg leading-relaxed text-muted-foreground">{safeCoachBio}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
