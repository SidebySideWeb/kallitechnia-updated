import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { PageHeaderGradient } from '@/components/PageHeaderGradient'
import { getTenant, getPageBySlug } from '@/lib/api'
import SafeSections from '@/lib/SafeSections'
import PageClient from '../PageClient'

/**
 * Terms & Privacy Policy page
 * Can fetch from CMS or use static content
 */
export default async function TermsPage() {
  let pageTitle = 'Όροι Χρήσης'
  let sections: any[] = []

  try {
    const tenant = await getTenant()
    if (tenant) {
      const page = await getPageBySlug('terms', tenant.id)
      if (page) {
        pageTitle = page.title || pageTitle
        sections = page.sections || []
      }
    }
  } catch (error) {
    console.warn('[TermsPage] Failed to fetch CMS data:', error)
  }
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <PageHeaderGradient title={pageTitle} />

      {sections.length > 0 ? (
        <main>
          <PageClient>
            <SafeSections
              sections={sections}
              tenantCode="kallitechnia"
              context={{
                pageSlug: 'terms',
                isHomepage: false,
              }}
            />
          </PageClient>
        </main>
      ) : (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Όροι Χρήσης Ιστοσελίδας */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6">Όροι Χρήσης Ιστοσελίδας</h2>
          <div className="space-y-4 text-foreground leading-relaxed">
            <p>
              Καλώς ήρθατε στην ιστοσελίδα της Γυμναστικής Καλλιτεχνίας Κεφαλονιάς. Η χρήση της παρούσας ιστοσελίδας
              υπόκειται στους παρακάτω όρους και προϋποθέσεις. Παρακαλούμε διαβάστε τους προσεκτικά πριν από τη χρήση
              της ιστοσελίδας.
            </p>

            <h3 className="text-xl font-semibold text-primary mt-6 mb-3">1. Αποδοχή Όρων</h3>
            <p>
              Με την πρόσβαση και χρήση της ιστοσελίδας μας, αποδέχεστε και συμφωνείτε να δεσμεύεστε από τους παρόντες
              όρους χρήσης. Εάν δεν συμφωνείτε με οποιονδήποτε από τους όρους αυτούς, παρακαλούμε μην χρησιμοποιείτε την
              ιστοσελίδα μας.
            </p>

            <h3 className="text-xl font-semibold text-primary mt-6 mb-3">2. Πνευματική Ιδιοκτησία</h3>
            <p>
              Όλο το περιεχόμενο της ιστοσελίδας, συμπεριλαμβανομένων κειμένων, γραφικών, λογοτύπων, εικόνων, βίντεο και
              λογισμικού, αποτελεί πνευματική ιδιοκτησία της Γυμναστικής Καλλιτεχνίας Κεφαλονιάς και προστατεύεται από
              τους νόμους περί πνευματικής ιδιοκτησίας.
            </p>

            <h3 className="text-xl font-semibold text-primary mt-6 mb-3">3. Χρήση Περιεχομένου</h3>
            <p>
              Το περιεχόμενο της ιστοσελίδας παρέχεται αποκλειστικά για προσωπική και μη εμπορική χρήση. Δεν επιτρέπεται
              η αναπαραγωγή, διανομή, τροποποίηση ή δημοσίευση του περιεχομένου χωρίς την προηγούμενη γραπτή άδεια του
              συλλόγου.
            </p>

            <h3 className="text-xl font-semibold text-primary mt-6 mb-3">4. Περιορισμός Ευθύνης</h3>
            <p>
              Ο σύλλογος δεν φέρει ευθύνη για τυχόν ζημίες που μπορεί να προκύψουν από τη χρήση ή την αδυναμία χρήσης
              της ιστοσελίδας, συμπεριλαμβανομένων, ενδεικτικά, απώλειας δεδομένων ή διακοπής υπηρεσιών.
            </p>

            <h3 className="text-xl font-semibold text-primary mt-6 mb-3">5. Τροποποιήσεις</h3>
            <p>
              Ο σύλλογος διατηρεί το δικαίωμα να τροποποιεί τους παρόντες όρους χρήσης ανά πάσα στιγμή χωρίς προηγούμενη
              ειδοποίηση. Οι τροποποιήσεις τίθενται σε ισχύ από τη στιγμή της δημοσίευσής τους στην ιστοσελίδα.
            </p>
          </div>
        </section>

        {/* Πολιτική Απορρήτου */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6">Πολιτική Απορρήτου</h2>
          <div className="space-y-4 text-foreground leading-relaxed">
            <p>
              Η Γυμναστική Καλλιτεχνία Κεφαλονιάς δεσμεύεται για την προστασία των προσωπικών σας δεδομένων. Η παρούσα
              πολιτική απορρήτου περιγράφει τον τρόπο με τον οποίο συλλέγουμε, χρησιμοποιούμε και προστατεύουμε τις
              πληροφορίες σας.
            </p>

            <h3 className="text-xl font-semibold text-primary mt-6 mb-3">Συλλογή Πληροφοριών</h3>
            <p>
              Συλλέγουμε πληροφορίες που μας παρέχετε εθελοντικά όταν επικοινωνείτε μαζί μας μέσω της φόρμας
              επικοινωνίας, συμπεριλαμβανομένων του ονόματος, του email και του τηλεφώνου σας.
            </p>

            <h3 className="text-xl font-semibold text-primary mt-6 mb-3">Χρήση Πληροφοριών</h3>
            <p>
              Οι πληροφορίες που συλλέγουμε χρησιμοποιούνται αποκλειστικά για να απαντήσουμε στα ερωτήματά σας, να σας
              ενημερώσουμε για τα προγράμματα και τις δραστηριότητές μας, και να βελτιώσουμε τις υπηρεσίες μας.
            </p>

            <h3 className="text-xl font-semibold text-primary mt-6 mb-3">Προστασία Δεδομένων</h3>
            <p>
              Λαμβάνουμε κατάλληλα τεχνικά και οργανωτικά μέτρα για την προστασία των προσωπικών σας δεδομένων από μη
              εξουσιοδοτημένη πρόσβαση, απώλεια ή καταστροφή.
            </p>

            <h3 className="text-xl font-semibold text-primary mt-6 mb-3">Κοινοποίηση σε Τρίτους</h3>
            <p>
              Δεν πουλάμε, δεν ανταλλάσσουμε ούτε μεταβιβάζουμε τα προσωπικά σας δεδομένα σε τρίτους χωρίς τη
              συγκατάθεσή σας, εκτός εάν απαιτείται από το νόμο.
            </p>

            <h3 className="text-xl font-semibold text-primary mt-6 mb-3">Τα Δικαιώματά Σας</h3>
            <p>
              Έχετε το δικαίωμα πρόσβασης, διόρθωσης, διαγραφής και φορητότητας των προσωπικών σας δεδομένων. Για την
              άσκηση των δικαιωμάτων σας, μπορείτε να επικοινωνήσετε μαζί μας μέσω της φόρμας επικοινωνίας.
            </p>
          </div>
        </section>

        {/* GDPR */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6">Συμμόρφωση με τον GDPR</h2>
          <div className="space-y-4 text-foreground leading-relaxed">
            <p>
              Η Γυμναστική Καλλιτεχνία Κεφαλονιάς συμμορφώνεται πλήρως με τον Γενικό Κανονισμό Προστασίας Δεδομένων
              (GDPR) της Ευρωπαϊκής Ένωσης (Κανονισμός 2016/679).
            </p>

            <h3 className="text-xl font-semibold text-primary mt-6 mb-3">Νομική Βάση Επεξεργασίας</h3>
            <p>
              Η επεξεργασία των προσωπικών σας δεδομένων βασίζεται στη συγκατάθεσή σας, την εκτέλεση σύμβασης ή το
              έννομο συμφέρον του συλλόγου για την παροχή των υπηρεσιών του.
            </p>

            <h3 className="text-xl font-semibold text-primary mt-6 mb-3">Διατήρηση Δεδομένων</h3>
            <p>
              Τα προσωπικά σας δεδομένα διατηρούνται μόνο για όσο χρονικό διάστημα είναι απαραίτητο για την εκπλήρωση
              των σκοπών για τους οποίους συλλέχθηκαν ή όπως απαιτείται από το νόμο.
            </p>

            <h3 className="text-xl font-semibold text-primary mt-6 mb-3">Υπεύθυνος Προστασίας Δεδομένων</h3>
            <p>
              Για οποιαδήποτε ερώτηση σχετικά με την επεξεργασία των προσωπικών σας δεδομένων, μπορείτε να
              επικοινωνήσετε με τον υπεύθυνο προστασίας δεδομένων του συλλόγου στο email:
              privacy@kallitechnia-kefalonia.gr
            </p>

            <h3 className="text-xl font-semibold text-primary mt-6 mb-3">Δικαίωμα Καταγγελίας</h3>
            <p>
              Έχετε το δικαίωμα να υποβάλετε καταγγελία στην Αρχή Προστασίας Δεδομένων Προσωπικού Χαρακτήρα εάν θεωρείτε
              ότι η επεξεργασία των προσωπικών σας δεδομένων παραβιάζει τον GDPR.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="bg-muted rounded-lg p-8">
          <h3 className="text-2xl font-bold text-primary mb-4">Επικοινωνία</h3>
          <p className="text-foreground leading-relaxed mb-4">
            Για οποιαδήποτε ερώτηση σχετικά με τους όρους χρήσης ή την πολιτική απορρήτου, μπορείτε να επικοινωνήσετε
            μαζί μας:
          </p>
          <div className="space-y-2 text-foreground">
            <p>
              <strong>Email:</strong> info@kallitechnia-kefalonia.gr
            </p>
            <p>
              <strong>Τηλέφωνο:</strong> +30 123 456 7890
            </p>
            <p>
              <strong>Διεύθυνση:</strong> Αργοστόλι, Κεφαλονιά
            </p>
          </div>
        </section>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Τελευταία ενημέρωση: Ιανουάριος 2025</p>
        </div>
      </div>
      )}
      <Footer />
    </div>
  )
}
