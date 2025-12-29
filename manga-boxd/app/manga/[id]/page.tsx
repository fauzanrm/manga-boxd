import { createClient } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import styles from './page.module.css'

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
    <div>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>
          <Link href="/" className={styles.backLink}>
            ← Back to Home
          </Link>

          <div className={styles.content}>
            {/* Cover Image */}
            <div className={styles.coverWrapper}>
              <Image
                src={manga.cover_image}
                alt={`${manga.title} cover`}
                fill
                className={styles.coverImage}
                priority
                sizes="320px"
              />
            </div>

            {/* Details */}
            <div className={styles.details}>
              <div className={styles.header}>
                <h1 className={styles.title}>{manga.title}</h1>
                <p className={styles.author}>by {manga.author}</p>
              </div>

              <div className={styles.metadata}>
                <div className={`${styles.badge} ${styles.badgeDefault}`}>
                  {manga.total_chapters} chapters
                </div>
                <div className={`${styles.badge} ${styles.badgeStatus}`}>
                  {manga.status}
                </div>
              </div>

              {manga.description && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>Synopsis</h2>
                  <p className={styles.description}>{manga.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}