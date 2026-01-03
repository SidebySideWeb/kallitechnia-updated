import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { PageHeaderGradient } from '@/components/PageHeaderGradient'
import { Button } from '@/components/ui/button'
import { MapPin, Phone, Mail, Clock, FileText, Download } from 'lucide-react'
import Link from 'next/link'
import { getTenant, getPageBySlug } from '@/lib/api'
import SafeSections from '@/lib/SafeSections'
import PageClient from '../PageClient'

/**
 * Registration page
 * Can fetch from CMS or use static content
 */
export default async function RegistrationPage() {
  let sections: any[] = []

  try {
    const tenant = await getTenant()
    if (tenant) {
      const page = await getPageBySlug('registration', tenant.id)
      if (page) {
        sections = page.sections || []
        // Debug: Log sections for troubleshooting
        if (process.env.NODE_ENV === 'development') {
          console.log('[RegistrationPage] Fetched page:', page.slug)
          console.log('[RegistrationPage] Sections count:', sections.length)
          console.log('[RegistrationPage] Section types:', sections.map(s => s.blockType || s.block_type || s.type))
          const formSections = sections.filter(s => 
            (s.blockType || s.block_type || s.type) === 'kallitechnia.form'
          )
          console.log('[RegistrationPage] Form blocks found:', formSections.length)
          if (formSections.length > 0) {
            console.log('[RegistrationPage] Form block data:', JSON.stringify(formSections[0], null, 2))
          }
        }
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[RegistrationPage] Page not found in CMS for slug: registration')
        }
      }
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[RegistrationPage] Tenant not found')
      }
    }
  } catch (error) {
    console.warn('[RegistrationPage] Failed to fetch CMS data:', error)
  }
  return (
    <div className="min-h-screen">
      <Navigation />
      <PageHeaderGradient
        title="Εγγραφές"
        subtitle="Γίνε μέλος της οικογένειας της Καλλιτεχνίας!"
      />

      {/* Welcome Message and Start Date */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <p className="text-2xl md:text-3xl font-bold text-primary">
              H Kallitechnia Gymnastics Kefalonia σας καλωσορίζει στην ομάδα της.
            </p>
            <p className="text-xl md:text-2xl text-secondary font-semibold">
              Τα μαθήματά ξεκινούν από τη Δευτέρα 1 Δεκεμβρίου 2025!
            </p>
          </div>
        </div>
      </section>

      {/* Required Documents Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-3xl p-8 md:p-12 shadow-lg border border-border">
              <div className="flex items-center gap-3 mb-8">
                <FileText className="w-10 h-10 text-primary" />
                <h2 className="text-3xl md:text-4xl font-bold text-primary">
                  ΑΠΑΡΑΙΤΗΤΑ ΕΓΓΡΑΦΑ ΓΙΑ ΤΗΝ ΣΥΜΜΕΤΟΧΗ ΣΑΣ
                </h2>
              </div>

              <div className="space-y-6">
                <div className="bg-primary/5 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-primary mb-4">Αίτηση Εγγραφής</h3>
                  <p className="text-muted-foreground mb-4">
                    Μπορείτε να παραλάβετε την αίτηση εγγραφής από τη Γραμματεία του Συλλόγου ή να την κατεβάσετε σε
                    μορφή PDF και να την τυπώσετε.
                  </p>
                  <Button className="bg-secondary hover:bg-secondary/90">
                    <Download className="mr-2 h-4 w-4" />
                    Κατέβασε την Αίτηση (PDF)
                  </Button>
                </div>

                <div className="bg-accent/5 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-primary mb-4">Δικαιολογητικά Εγγραφής</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span>Ιατρική βεβαίωση (πρωτότυπη)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span>Πιστοποιητικό γέννησης (πρωτότυπο)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span>Φωτοτυπία ταυτότητας για όσους έχουν εκδώσει</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span>Το ΑΜΚΑ της αθλήτριας</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Information */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center">Πληροφορίες Εγγραφής</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {/* Address */}
              <div className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">Διεύθυνση</h3>
                <p className="text-muted-foreground">
                  Αργοστόλι
                  <br />
                  Κεφαλονιά, 28100
                </p>
              </div>

              {/* Phone */}
              <div className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                  <Phone className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-bold text-lg mb-2">Τηλέφωνο</h3>
                <p className="text-muted-foreground">+30 123 456 7890</p>
              </div>

              {/* Email */}
              <div className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-bold text-lg mb-2">Email</h3>
                <p className="text-muted-foreground">info@kallitechnia.gr</p>
              </div>

              {/* Hours */}
              <div className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">Ωράριο</h3>
                <p className="text-muted-foreground">
                  Δευτέρα - Παρασκευή
                  <br />
                  17:00 - 21:00
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CMS Sections (includes form if configured) */}
      <main>
        <PageClient>
          {sections.length > 0 ? (
            <SafeSections
              sections={sections}
              tenantCode="kallitechnia"
              context={{
                pageSlug: 'registration',
                isHomepage: false,
              }}
            />
          ) : (
            <section className="py-16 bg-muted/30">
              <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center">
                  <p className="text-lg text-muted-foreground">
                    Η φόρμα εγγραφής θα εμφανιστεί εδώ όταν ρυθμιστεί στο CMS.
                  </p>
                  {process.env.NODE_ENV === 'development' && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Debug: No sections found. Check CMS for registration page.
                    </p>
                  )}
                </div>
              </div>
            </section>
          )}
        </PageClient>
      </main>

      {/* CTA Banner */}
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

      <Footer />
    </div>
  )
}

