import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Mail, Phone, MapPin, Youtube } from 'lucide-react'

/**
 * DESIGN-LOCKED Footer Component
 * 
 * This is a layout primitive - NOT a CMS block.
 * Structure, spacing, sizing are FIXED and cannot be changed by CMS.
 * CMS may only provide: logo image URL, description text, contact info, social links
 * 
 * Exact copy from v0.app - DO NOT MODIFY layout classes
 */
interface FooterProps {
  logo?: string | null
  logoAlt?: string
  description?: string
  address?: string
  phone?: string
  email?: string
  socialLinks?: Array<{ platform?: string; url?: string }>
  copyrightText?: string
}

export function Footer({
  logo,
  logoAlt,
  description,
  address,
  phone,
  email,
  socialLinks,
  copyrightText,
}: FooterProps) {
  // Safe defaults - CMS can override but structure is locked
  const safeLogo = logo || 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo%20KGK%20%CF%85%CF%88%CE%B7%CE%BB%CE%AE%CF%82%20%CE%B1%CE%BD%CE%AC%CE%BB%CF%85%CF%83%CE%B7%CF%82-YP2dWdAD9HKxgCBQOBLccXnxTydRcQ.png'
  const safeLogoAlt = logoAlt || 'Kallitechnia Gymnastics Kefalonia'
  const safeDescription = description || 'Σύλλογος Γυμναστικής Καλλιτεχνίας στην Κεφαλονιά. Προάγουμε την αθλητική αριστεία και την υγιή ανάπτυξη των παιδιών.'
  const safeAddress = address || 'Αργοστόλι, Κεφαλονιά'
  const safePhone = phone || '+30 123 456 7890'
  const safeEmail = email || 'info@kallitechnia-kefalonia.gr'
  const safeSocialLinks = Array.isArray(socialLinks) && socialLinks.length > 0 ? socialLinks : [
    { platform: 'facebook', url: 'https://www.facebook.com/share/1CrWN7pqCy/?mibextid=wwXIfr' },
    {
      platform: 'instagram',
      url: 'https://www.instagram.com/kallitechniagymnastics?igsh=MTRodDdpdW02c3MyYg%3D%3D&utm_source=qr',
    },
    { platform: 'youtube', url: 'https://youtube.com/@kallitechniagymnastics?si=sZvo_JM4gkKPu0Lp' },
  ]
  const safeCopyrightText = copyrightText || '2025 Γυμναστική Καλλιτεχνία Κεφαλονιάς. Όλα τα δικαιώματα διατηρούνται.'

  const getSocialIcon = (platform?: string) => {
    const platformLower = (platform || '').toLowerCase()
    if (platformLower.includes('facebook')) return Facebook
    if (platformLower.includes('instagram')) return Instagram
    if (platformLower.includes('youtube')) return Youtube
    return null
  }

  return (
    <footer className="bg-[#311B92] text-[#E0F7FA] mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo & Description - EXACT v0.app structure */}
          <div>
            <Image
              src={safeLogo}
              alt={safeLogoAlt}
              width={180}
              height={60}
              className="h-12 w-auto mb-4 brightness-0 invert"
            />
            <p className="text-sm leading-relaxed">
              {safeDescription}
            </p>
          </div>

          {/* Quick Links - EXACT v0.app structure */}
          <div>
            <h3 className="font-bold text-lg mb-4">Γρήγοροι Σύνδεσμοι</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-secondary transition-colors">
                  Αρχική
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-secondary transition-colors">
                  Ο Σύλλογος
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-secondary transition-colors">
                  Νέα
                </Link>
              </li>
              <li>
                <Link href="/programs" className="hover:text-secondary transition-colors">
                  Αθλήματα – Τμήματα
                </Link>
              </li>
              <li>
                <Link href="/registration" className="hover:text-secondary transition-colors">
                  Εγγραφές
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-secondary transition-colors">
                  Επικοινωνία
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info - EXACT v0.app structure */}
          <div>
            <h3 className="font-bold text-lg mb-4">Επικοινωνία</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{safeAddress}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm">{safePhone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm">{safeEmail}</span>
              </li>
            </ul>
            <div className="flex gap-4 mt-4">
              {safeSocialLinks.map((link, index) => {
                const safeLinkUrl = link.url || ''
                const sanitizedUrl =
                  safeLinkUrl && (safeLinkUrl.startsWith('http') || safeLinkUrl.startsWith('/'))
                    ? safeLinkUrl
                    : ''
                const Icon = getSocialIcon(link.platform)

                if (!Icon || !sanitizedUrl) return null

                return (
                  <a
                    key={index}
                    href={sanitizedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-secondary transition-colors"
                    aria-label={link.platform || 'Social link'}
                  >
                    <Icon className="h-6 w-6" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        {/* External Links - EXACT v0.app structure */}
        <div className="border-t border-[#4527A0] pt-6 mb-6">
          <div className="flex flex-wrap gap-6 justify-center">
            <a
              href="https://www.gymnastics.sport/site/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-secondary transition-colors text-sm"
            >
              FIG - International Gymnastics Federation
            </a>
            <a
              href="https://www.ego-gymnastics.gr/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-secondary transition-colors text-sm"
            >
              ΕΓΟ - Ελληνική Γυμναστική Ομοσπονδία
            </a>
          </div>
        </div>

        {/* Copyright - EXACT v0.app structure */}
        <div className="border-t border-[#4527A0] pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p>&copy; {safeCopyrightText}</p>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-secondary transition-colors">
              Όροι Χρήσης
            </Link>
            <Link href="/terms" className="hover:text-secondary transition-colors">
              Πολιτική Απορρήτου
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
