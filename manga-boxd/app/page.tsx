import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'

export default async function Home() {
  const supabase = createClient()

  const { data: manga, error } = await supabase
    .from('manga')
    .select('id, title, author, cover_image')
    .order('title')

  if (error) {
    console.error('Error fetching manga:', error)
  }

  return (
    <main className="min-h-screen px-6 py-12 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-12 tracking-tight">
          Manga Boxd
        </h1>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4 md:gap-6">
          {manga && manga.length > 0 ? (
            manga.map((m) => (
              <Link
                key={m.id}
                href={`/manga/${m.id}`}
                className="group cursor-pointer block"
              >
                <div className="relative aspect-[2/3] overflow-hidden rounded-md shadow-lg transition-all duration-200 group-hover:scale-105 group-hover:shadow-2xl">
                  <Image
                    src={m.cover_image}
                    alt={`${m.title} cover`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, (max-width: 1280px) 16vw, 14vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
                <div className="mt-3">
                  <h2 className="font-medium text-sm line-clamp-2 transition-colors" style={{ color: 'var(--text-primary)' }}>
                    {m.title}
                  </h2>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    {m.author}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p className="col-span-full text-center py-20" style={{ color: 'var(--text-muted)' }}>
              No manga found
            </p>
          )}
        </div>
      </div>
    </main>
  )
}