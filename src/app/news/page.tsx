import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { PageHeaderGradient } from '@/components/PageHeaderGradient'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from 'lucide-react'
import Image from 'next/image'
import { getTenant, getPosts } from '@/lib/api'
import Link from 'next/link'

/**
 * News page
 * Fetches posts from CMS and displays them
 * Falls back to empty state if CMS data is not available
 */
export default async function NewsPage() {
  let newsItems: any[] = []

  try {
    const tenant = await getTenant()
    if (tenant) {
      const postsData = await getPosts(tenant.id, 20)
      // Format posts for display
      newsItems = postsData.docs.map((post) => ({
        id: post.id,
        title: post.title,
        date: post.publishedAt
          ? new Date(post.publishedAt).toLocaleDateString('el-GR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : '',
        excerpt: post.excerpt || '',
        image:
          post.featuredImage?.url ||
          'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_6341-lYd2EHQV08gx6DxJdWhs3MXKIhJs8l.jpeg',
        slug: post.slug,
      }))
    }
  } catch (error) {
    console.warn('[NewsPage] Failed to fetch CMS data:', error)
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <PageHeaderGradient
        title="Νέα & Ανακοινώσεις"
        subtitle="Μείνετε ενημερωμένοι με τα τελευταία νέα, εκδηλώσεις και επιτυχίες του συλλόγου μας."
      />

      {/* News Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {newsItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                Δεν υπάρχουν διαθέσιμες δημοσιεύσεις αυτή τη στιγμή.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {newsItems.map((item, index) => (
                <Link key={item.id || index} href={`/news/${item.slug}`}>
                  <Card
                    className="border-2 hover:border-primary transition-all hover:shadow-lg rounded-2xl overflow-hidden animate-fade-in-up cursor-pointer h-full"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative h-64">
                      <Image
                        src={item.image || '/placeholder.svg'}
                        alt={item.title}
                        fill
                        className="object-cover"
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                        <Calendar className="h-4 w-4" />
                        <span>{item.date}</span>
                      </div>
                      <CardTitle className="text-2xl text-balance">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {item.excerpt}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

