import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { PageHeaderGradient } from '@/components/PageHeaderGradient'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { getTenant, getPageBySlug } from '@/lib/api'
import { renderContactText } from '@/lib/contactUtils'
import SafeSections from '@/lib/SafeSections'
import PageClient from '../PageClient'

/**
 * Contact page
 * Can fetch from CMS or use static content
 */
export default async function ContactPage() {
  let sections: any[] = []
  let contactInfo: any = null

  try {
    const tenant = await getTenant()
    if (tenant) {
      const page = await getPageBySlug('contact', tenant.id)
      if (page) {
        sections = page.sections || []
        
        // Find ContactInfo section
        contactInfo = sections.find(s => 
          (s.blockType || s.block_type || s.type) === 'kallitechnia.contactInfo'
        )
      }
    }
  } catch (error) {
    // Silently fail and show fallback content
    console.error('[ContactPage] Error fetching page:', error)
  }

  const formSections = sections.filter(s => 
    (s.blockType || s.block_type || s.type) === 'kallitechnia.form'
  )

  // Extract contact info data from CMS
  const getContactItem = (type: string) => {
    if (!contactInfo?.items) return null
    return contactInfo.items.find((item: any) => item.type === type)
  }

  const addressItem = getContactItem('address')
  const phoneItem = getContactItem('phone')
  const emailItem = getContactItem('email')
  const hoursItem = getContactItem('hours')

  return (
    <div className="min-h-screen">
      <Navigation />
      <PageHeaderGradient
        title="Επικοινωνία"
        subtitle="Είμαστε πάντα στη διάθεσή σας για οποιαδήποτε πληροφορία."
      />

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form - Will be rendered from CMS sections if available */}
            <div className="md:col-span-1">
              {sections.filter(s => 
                (s.blockType || s.block_type || s.type) === 'kallitechnia.form'
              ).length > 0 ? (
                <PageClient>
                  <SafeSections
                    sections={sections.filter(s => 
                      (s.blockType || s.block_type || s.type) === 'kallitechnia.form'
                    )}
                    tenantCode="kallitechnia"
                    context={{
                      pageSlug: 'contact',
                      isHomepage: false,
                    }}
                  />
                </PageClient>
              ) : (
                <Card className="border-2 rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-3xl text-primary">Στείλτε μας Μήνυμα</CardTitle>
                    <p className="text-muted-foreground">
                      Η φόρμα επικοινωνίας θα εμφανιστεί εδώ όταν ρυθμιστεί στο CMS.
                    </p>
                  </CardHeader>
                </Card>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              {/* Address */}
              {addressItem && (
                <Card className="border-2 rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl mb-2 text-primary">
                          {addressItem.label || 'Διεύθυνση'}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                          {addressItem.content}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Phone */}
              {phoneItem && (
                <Card className="border-2 rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Phone className="h-6 w-6 text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl mb-2 text-primary">
                          {phoneItem.label || 'Τηλέφωνο'}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                          {renderContactText(phoneItem.content)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Email */}
              {emailItem && (
                <Card className="border-2 rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl mb-2 text-primary">
                          {emailItem.label || 'Email'}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                          {renderContactText(emailItem.content)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Hours */}
              {hoursItem && (
                <Card className="border-2 rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl mb-2 text-primary">
                          {hoursItem.label || 'Ώρες Λειτουργίας'}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                          {hoursItem.content}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Other CMS Sections (non-form, non-contactInfo blocks) */}
      {sections.filter(s => {
        const blockType = s.blockType || s.block_type || s.type
        return blockType !== 'kallitechnia.form' && blockType !== 'kallitechnia.contactInfo'
      }).length > 0 ? (
        <main>
          <PageClient>
            <SafeSections
              sections={sections.filter(s => {
                const blockType = s.blockType || s.block_type || s.type
                return blockType !== 'kallitechnia.form' && blockType !== 'kallitechnia.contactInfo'
              })}
              tenantCode="kallitechnia"
              context={{
                pageSlug: 'contact',
                isHomepage: false,
              }}
            />
          </PageClient>
        </main>
      ) : (
        <>
          <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-bold text-center mb-12 text-primary">Πού Βρισκόμαστε</h2>
                <div className="rounded-2xl overflow-hidden shadow-lg border-2">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d50234.89474920634!2d20.456789!3d38.176944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x135e4c3e3e3e3e3e%3A0x3e3e3e3e3e3e3e3e!2sArgostoli%2C%20Greece!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Χάρτης Τοποθεσίας"
                  />
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      <Footer />
    </div>
  )
}
