/**
 * DESIGN-LOCKED Page Header Component
 * 
 * This is a layout primitive for inner pages (NOT homepage).
 * Structure, spacing, sizing are FIXED and cannot be changed by CMS.
 * CMS may only provide: title, subtitle (text content)
 * 
 * EXACT copy from v0.app - DO NOT MODIFY layout classes
 */
interface PageHeaderGradientProps {
  title?: string
  subtitle?: string
}

export function PageHeaderGradient({ title, subtitle }: PageHeaderGradientProps) {
  // Safe content extraction - layout is locked
  const safeTitle = title || ''
  const safeSubtitle = subtitle || ''

  // EXACT v0.app structure - DO NOT MODIFY
  return (
    <section className="relative bg-gradient-to-br from-accent via-primary to-secondary py-24 overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 right-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-10 left-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {safeTitle && (
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white text-balance drop-shadow-lg animate-fade-in-up">
              {safeTitle}
            </h1>
          )}
          {safeSubtitle && (
            <p className="text-xl leading-relaxed text-white/90 drop-shadow-md">
              {safeSubtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

