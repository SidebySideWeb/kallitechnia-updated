import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { PageHeaderGradient } from '@/components/PageHeaderGradient'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { MapPin, Phone, Mail, Clock, FileText, Download } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'

/**
 * Registration page
 * Inner page - uses PageHeaderGradient (NOT hero block)
 * 
 * EXACT copy from v0.app structure
 */
export default function RegistrationPage() {
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

      {/* Registration Form */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-card rounded-3xl p-8 md:p-12 shadow-lg border border-border">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center">Φόρμα Εγγραφής</h2>

              <form className="space-y-6">
                {/* Child's First Name */}
                <div className="space-y-2">
                  <Label htmlFor="childFirstName" className="text-base font-semibold">
                    Όνομα Παιδιού *
                  </Label>
                  <Input id="childFirstName" placeholder="Εισάγετε το όνομα του παιδιού" required className="h-12" />
                </div>

                {/* Child's Last Name */}
                <div className="space-y-2">
                  <Label htmlFor="childLastName" className="text-base font-semibold">
                    Επώνυμο *
                  </Label>
                  <Input id="childLastName" placeholder="Εισάγετε το επώνυμο του παιδιού" required className="h-12" />
                </div>

                {/* Age */}
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-base font-semibold">
                    Ηλικία *
                  </Label>
                  <Input id="age" type="number" placeholder="Εισάγετε την ηλικία" required className="h-12" />
                </div>

                {/* Parent's Name */}
                <div className="space-y-2">
                  <Label htmlFor="parentName" className="text-base font-semibold">
                    Όνομα Γονέα *
                  </Label>
                  <Input id="parentName" placeholder="Εισάγετε το όνομα του γονέα" required className="h-12" />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-base font-semibold">
                    Τηλέφωνο *
                  </Label>
                  <Input id="phone" type="tel" placeholder="+30 123 456 7890" required className="h-12" />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base font-semibold">
                    Email *
                  </Label>
                  <Input id="email" type="email" placeholder="email@example.com" required className="h-12" />
                </div>

                {/* Department Selection */}
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-base font-semibold">
                    Επιλογή Τμήματος *
                  </Label>
                  <Select required>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Επιλέξτε τμήμα" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="artistic">Καλλιτεχνική Γυμναστική</SelectItem>
                      <SelectItem value="rhythmic">Ρυθμική Γυμναστική</SelectItem>
                      <SelectItem value="precompetitive">Προαγωνιστικά Τμήματα</SelectItem>
                      <SelectItem value="children">Παιδικά Τμήματα</SelectItem>
                      <SelectItem value="gfa">Γυμναστική για Όλους</SelectItem>
                      <SelectItem value="adults">Adults Group GfA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-base font-semibold">
                    Μήνυμα
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Πείτε μας περισσότερα για το παιδί σας ή τυχόν ερωτήσεις..."
                    rows={5}
                    className="resize-none"
                  />
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start gap-3 pt-4">
                  <Checkbox id="terms" required className="mt-1" />
                  <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                    Αποδέχομαι τους{' '}
                    <Link href="/terms" className="text-accent hover:underline font-semibold">
                      Όρους Χρήσης
                    </Link>{' '}
                    και την{' '}
                    <Link href="/terms" className="text-accent hover:underline font-semibold">
                      Πολιτική Απορρήτου
                    </Link>
                    . Συμφωνώ με την επεξεργασία των προσωπικών μου δεδομένων σύμφωνα με τον GDPR.
                  </Label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-14 text-lg font-bold bg-secondary hover:bg-secondary/90"
                >
                  Υποβολή Εγγραφής
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

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

