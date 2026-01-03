import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { PageHeaderGradient } from '@/components/PageHeaderGradient'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { getTenant, getPageBySlug } from '@/lib/api'
import SafeSections from '@/lib/SafeSections'
import PageClient from '../PageClient'

/**
 * Contact page
 * Can fetch from CMS or use static content
 */
export default async function ContactPage() {
  let sections: any[] = []

  try {
    const tenant = await getTenant()
    if (tenant) {
      const page = await getPageBySlug('contact', tenant.id)
      if (page) {
        sections = page.sections || []
      }
    }
  } catch (error) {
    console.warn('[ContactPage] Failed to fetch CMS data:', error)
  }

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
            {/* Contact Form */}
            <Card className="border-2 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-3xl text-primary">Στείλτε μας Μήνυμα</CardTitle>
                <p className="text-muted-foreground">
                  Συμπληρώστε τη φόρμα και θα επικοινωνήσουμε μαζί σας το συντομότερο δυνατό.
                </p>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="text-sm font-medium">
                        Όνομα *
                      </label>
                      <Input id="firstName" placeholder="Το όνομά σας" required />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="text-sm font-medium">
                        Επώνυμο *
                      </label>
                      <Input id="lastName" placeholder="Το επώνυμό σας" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email *
                    </label>
                    <Input id="email" type="email" placeholder="email@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Τηλέφωνο
                    </label>
                    <Input id="phone" type="tel" placeholder="+30 123 456 7890" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Θέμα *
                    </label>
                    <Input id="subject" placeholder="Πώς μπορούμε να σας βοηθήσουμε;" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Μήνυμα *
                    </label>
                    <Textarea id="message" placeholder="Γράψτε το μήνυμά σας εδώ..." rows={5} required />
                  </div>
                  <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-white text-lg">
                    Αποστολή Μηνύματος
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="border-2 rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl mb-2 text-primary">Διεύθυνση</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Αργοστόλι
                        <br />
                        Κεφαλονιά, 28100
                        <br />
                        Ελλάδα
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl mb-2 text-primary">Τηλέφωνο</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        +30 123 456 7890
                        <br />
                        +30 098 765 4321
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl mb-2 text-primary">Email</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        info@kallitechnia-kefalonia.gr
                        <br />
                        contact@kallitechnia-kefalonia.gr
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl mb-2 text-primary">Ώρες Λειτουργίας</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Δευτέρα - Παρασκευή: 16:00 - 21:00
                        <br />
                        Σάββατο: 10:00 - 14:00
                        <br />
                        Κυριακή: Κλειστά
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {sections.length > 0 ? (
        <main>
          <PageClient>
            <SafeSections
              sections={sections}
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
