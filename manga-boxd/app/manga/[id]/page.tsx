import { createClient } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function MangaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = createClient()

  const { data: manga, error } = await supabase
    .from('manga')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !manga) {
    notFound()
  }

  return (
    <main className="min-h-screen px-6 py-12 md:px-12">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center mb-8 transition-colors hover:opacity-70"
          style={{ color: 'var(--accent-orange)' }}
        >
          ← Back to Home
        </Link>

        <div className="grid md:grid-cols-[320px_1fr] gap-10 md:gap-12">
          {/* Cover Image */}
          <div className="relative aspect-[2/3] overflow-hidden rounded-lg shadow-2xl max-w-[320px] mx-auto md:mx-0">
            <Image
              src={manga.cover_image}
              alt={`${manga.title} cover`}
              fill
              className="object-cover"
              priority
              sizes="320px"
            />
          </div>

          {/* Details */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight" style={{ color: 'var(--text-primary)' }}>
                {manga.title}
              </h1>
              <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
                by {manga.author}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm">
              <div className="px-4 py-2 rounded-full" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                {manga.total_chapters} chapters
              </div>
              <div className="px-4 py-2 rounded-full capitalize" style={{ backgroundColor: 'var(--accent-orange)', color: 'var(--bg-primary)' }}>
                {manga.status}
              </div>
            </div>

            {manga.description && (
              <div>
                <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                  Synopsis
                </h2>
                <p className="leading-relaxed text-base" style={{ color: 'var(--text-secondary)' }}>
                  {manga.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
