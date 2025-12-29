import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import styles from './page.module.css'

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
    <div>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Popular Manga</h1>

          <div className={styles.grid}>
            {manga && manga.length > 0 ? (
              manga.map((m) => (
                <Link
                  key={m.id}
                  href={`/manga/${m.id}`}
                  className={styles.mangaCard}
                >
                  <div className={styles.coverWrapper}>
                    <Image
                      src={m.cover_image}
                      alt={`${m.title} cover`}
                      fill
                      className={styles.coverImage}
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />
                    <div className={styles.hoverGradient} />
                  </div>
                  <div className={styles.info}>
                    <h2 className={styles.mangaTitle}>{m.title}</h2>
                    <p className={styles.author}>{m.author}</p>
                  </div>
                </Link>
              ))
            ) : (
              <p className={styles.emptyState}>No manga found</p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}