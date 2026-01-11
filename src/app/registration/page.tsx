import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { PageHeaderGradient } from '@/components/PageHeaderGradient'
import { Button } from '@/components/ui/button'
import { MapPin, Phone, Mail, Clock, FileText, Download } from 'lucide-react'
import Link from 'next/link'
import { getTenant, getPageBySlug } from '@/lib/api'
import { renderLexicalContent, extractText, extractParagraphs } from '@/lib/lexical'
import { getProxyDownloadUrl } from '@/lib/imageUtils'
import SafeSections from '@/lib/SafeSections'
import PageClient from '../PageClient'

/**
 * Registration page
 * Uses CMS data to populate the page design
 */
export default async function RegistrationPage() {
  let sections: any[] = []
  let welcomeContent: any = null
  let documentsContent: any = null
  let downloadButton: any = null
  let contactInfo: any = null
  let formSection: any = null
  let otherSections: any[] = []

  try {
    const tenant = await getTenant()
    if (tenant) {
      const page = await getPageBySlug('registration', tenant.id)
      if (page) {
        sections = page.sections || []
        
        // Extract specific sections for the page design
        const richTextSections = sections.filter(s => 
          (s.blockType || s.block_type || s.type) === 'kallitechnia.richText'
        )
        
        // First richText is welcome message
        if (richTextSections.length > 0) {
          welcomeContent = richTextSections[0].content
        }
        
        // Second richText is required documents
        if (richTextSections.length > 1) {
          documentsContent = richTextSections[1].content
        }
        
        // Find downloadButton
        downloadButton = sections.find(s => 
          (s.blockType || s.block_type || s.type) === 'kallitechnia.downloadButton'
        )
        
        // Find contactInfo
        contactInfo = sections.find(s => 
          (s.blockType || s.block_type || s.type) === 'kallitechnia.contactInfo'
        )
        
        // Find form
        formSection = sections.find(s => 
          (s.blockType || s.block_type || s.type) === 'kallitechnia.form'
        )
        
        // Other sections (CTA, etc.) that should be rendered separately
        otherSections = sections.filter(s => {
          const blockType = s.blockType || s.block_type || s.type
          return blockType !== 'kallitechnia.richText' &&
                 blockType !== 'kallitechnia.downloadButton' &&
                 blockType !== 'kallitechnia.contactInfo' &&
                 blockType !== 'kallitechnia.form'
        })
      }
    }
  } catch (error) {
    console.warn('[RegistrationPage] Failed to fetch CMS data:', error)
  }

  // Extract contact info data
  const getContactItem = (type: string) => {
    if (!contactInfo?.items) return null
    return contactInfo.items.find((item: any) => item.type === type)
  }

  const addressItem = getContactItem('address')
  const phoneItem = getContactItem('phone')
  const emailItem = getContactItem('email')
  const hoursItem = getContactItem('hours')

  // Extract welcome paragraphs
  const welcomeParagraphs = welcomeContent ? extractParagraphs(welcomeContent) : []
  const welcomeHeading = welcomeParagraphs.find(p => p.length > 50) || welcomeParagraphs[0] || ''
  const welcomeSubheading = welcomeParagraphs.find((p, i) => i > 0 || (i === 0 && p !== welcomeHeading)) || ''

  // Extract document paragraphs
  const documentParagraphs = documentsContent ? extractParagraphs(documentsContent) : []
  const documentHeading = documentParagraphs.find(p => p.includes('ΑΠΑΡΑΙΤΗΤΑ') || p.includes('ΕΓΓΡΑΦΑ')) || ''
  const applicationText = documentParagraphs.find(p => p.includes('Αίτηση') || p.includes('αίτηση')) || ''
  const documentsList = documentParagraphs.filter(p => 
    p.startsWith('•') || 
    p.includes('Ιατρική') || 
    p.includes('Πιστοποιητικό') || 
    p.includes('Φωτοτυπία') || 
    p.includes('ΑΜΚΑ')
  )

  return (
    <div className="min-h-screen">
      <Navigation />
      <PageHeaderGradient
        title="Εγγραφές"
        subtitle="Γίνε μέλος της οικογένειας της Καλλιτεχνίας!"
      />

      {/* Welcome Message and Start Date */}
      {welcomeContent && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              {welcomeParagraphs.length > 0 ? (
                welcomeParagraphs.map((paragraph, index) => {
                  // Check if it's a heading (usually first paragraph or contains specific text)
                  const isHeading = index === 0 || paragraph.length < 100
                  if (isHeading) {
                    return (
                      <p key={index} className="text-2xl md:text-3xl font-bold text-primary">
                        {paragraph}
                      </p>
                    )
                  }
                  return (
                    <p key={index} className="text-xl md:text-2xl text-secondary font-semibold">
                      {paragraph}
                    </p>
                  )
                })
              ) : (
                <div className="prose prose-lg max-w-none">
                  {renderLexicalContent(welcomeContent)}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Required Documents Section */}
      {documentsContent && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-card rounded-3xl p-8 md:p-12 shadow-lg border border-border">
                {documentHeading && (
                  <div className="flex items-center gap-3 mb-8">
                    <FileText className="w-10 h-10 text-primary" />
                    <h2 className="text-3xl md:text-4xl font-bold text-primary">
                      {documentHeading}
                    </h2>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Application Form Download */}
                  {downloadButton && (
                    <div className="bg-primary/5 rounded-xl p-6">
                      {downloadButton.title && (
                        <h3 className="text-xl font-bold text-primary mb-4">{downloadButton.title}</h3>
                      )}
                      {downloadButton.description && (
                        <div className="text-muted-foreground mb-4">
                          {renderLexicalContent(downloadButton.description)}
                        </div>
                      )}
                      {downloadButton.fileUrl && (
                        <Button className="bg-secondary hover:bg-secondary/90" asChild>
                          <a 
                            href={getProxyDownloadUrl(downloadButton.fileUrl) || downloadButton.fileUrl} 
                            download={downloadButton.fileName}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Download className="mr-2 h-4 w-4" />
                            {downloadButton.buttonLabel || 'Κατέβασε την Αίτηση (PDF)'}
                          </a>
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Required Documents List */}
                  {documentsList.length > 0 && (
                    <div className="bg-accent/5 rounded-xl p-6">
                      <h3 className="text-xl font-bold text-primary mb-4">Δικαιολογητικά Εγγραφής</h3>
                      <ul className="space-y-3 text-muted-foreground">
                        {documentsList.map((item, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="text-primary font-bold mt-1">•</span>
                            <span>{item.replace(/^•\s*/, '')}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Fallback: Render full documents content if parsing didn't work */}
                  {documentsList.length === 0 && !downloadButton && (
                    <div className="prose prose-lg max-w-none">
                      {renderLexicalContent(documentsContent)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Registration Information */}
      {contactInfo && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center">
                {contactInfo.title || 'Πληροφορίες Εγγραφής'}
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                {/* Address */}
                {addressItem && (
                  <div className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{addressItem.label || 'Διεύθυνση'}</h3>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {addressItem.content}
                    </p>
                  </div>
                )}

                {/* Phone */}
                {phoneItem && (
                  <div className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                      <Phone className="w-6 h-6 text-secondary" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{phoneItem.label || 'Τηλέφωνο'}</h3>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {phoneItem.content}
                    </p>
                  </div>
                )}

                {/* Email */}
                {emailItem && (
                  <div className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                      <Mail className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{emailItem.label || 'Email'}</h3>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {emailItem.content}
                    </p>
                  </div>
                )}

                {/* Hours */}
                {hoursItem && (
                  <div className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{hoursItem.label || 'Ωράριο'}</h3>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {hoursItem.content}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Form Section */}
      {formSection && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <PageClient>
              <SafeSections
                sections={[formSection]}
                tenantCode="kallitechnia"
                context={{
                  pageSlug: 'registration',
                  isHomepage: false,
                }}
              />
            </PageClient>
          </div>
        </section>
      )}

      {/* Other CMS Sections (CTA, etc.) */}
      {otherSections.length > 0 && (
        <main>
          <PageClient>
            <SafeSections
              sections={otherSections}
              tenantCode="kallitechnia"
              context={{
                pageSlug: 'registration',
                isHomepage: false,
              }}
            />
          </PageClient>
        </main>
      )}

      {/* CTA Banner - Only show if no CTA section from CMS */}
      {otherSections.filter(s => (s.blockType || s.block_type || s.type) === 'kallitechnia.cta' || (s.blockType || s.block_type || s.type) === 'kallitechnia.ctaBanner').length === 0 && (
        <section className="py-20 bg-gradient-to-r from-primary via-secondary to-accent">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Κάνε την εγγραφή σου σήμερα!</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Ξεκίνα το ταξίδι σου στον κόσμο της γυμναστικής με την Καλλιτεχνία Κεφαλονιάς
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="h-14 px-8 text-lg font-bold bg-white text-primary hover:bg-white/90"
              asChild
            >
              <Link href="/contact">Επικοινώνησε μαζί μας</Link>
            </Button>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
