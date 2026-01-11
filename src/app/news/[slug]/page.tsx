import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { PageHeaderGradient } from '@/components/PageHeaderGradient'
import { Calendar, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { getTenant, getPostBySlug } from '@/lib/api'
import { extractImageUrl } from '@/lib/imageUtils'
import { RichTextRenderer } from '@/components/RichTextRenderer'
import { notFound } from 'next/navigation'

interface PostPageProps {
  params: Promise<{
    slug: string
  }>
}

/**
 * Individual post/news page
 * Fetches post by slug from CMS and displays it
 */
export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params

  let post: any = null

  try {
    const tenant = await getTenant()
    if (tenant) {
      post = await getPostBySlug(slug, tenant.id)
    }
  } catch (error) {
    console.warn('[PostPage] Failed to fetch CMS data:', error)
  }

  // If post not found, show 404
  if (!post) {
    notFound()
  }

  // Format date
  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('el-GR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''

  // Get featured image URL - normalize to absolute URL for Next.js Image
  const featuredImageUrl =
    extractImageUrl(post.featuredImage) ||
    'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_6341-lYd2EHQV08gx6DxJdWhs3MXKIhJs8l.jpeg'

  return (
    <div className="min-h-screen">
      <Navigation />
      <PageHeaderGradient
        title={post.title || 'Νέα'}
        subtitle={post.excerpt || ''}
      />

      {/* Back Button */}
      <section className="py-6 bg-white border-b">
        <div className="container mx-auto px-4">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Πίσω στα Νέα</span>
          </Link>
        </div>
      </section>

      {/* Post Content */}
      <article className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Featured Image */}
            {featuredImageUrl && (
              <div className="relative w-full h-96 mb-8 rounded-2xl overflow-hidden">
                <Image
                  src={featuredImageUrl}
                  alt={post.title || 'Post image'}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 896px"
                />
              </div>
            )}

            {/* Post Meta */}
            <div className="flex items-center gap-4 text-muted-foreground mb-6">
              {formattedDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formattedDate}</span>
                </div>
              )}
            </div>

            {/* Post Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-8">
              {post.title}
            </h1>

            {/* Post Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {/* Post Content */}
            {post.content && (
              <div className="prose prose-lg max-w-none">
                <div className="space-y-6">
                  <RichTextRenderer content={post.content} />
                </div>
              </div>
            )}

            {/* If no content, show excerpt */}
            {!post.content && post.excerpt && (
              <div className="prose prose-lg max-w-none">
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {post.excerpt}
                </p>
              </div>
            )}
          </div>
        </div>
      </article>

      {/* Back to News Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 text-center">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-lg font-semibold"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Πίσω στα Νέα</span>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
