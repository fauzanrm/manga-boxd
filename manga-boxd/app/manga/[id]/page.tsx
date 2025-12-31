import { createClient } from '@/lib/supabase'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import MangaChapterSection from '@/components/MangaChapterSection'
import styles from './page.module.css'

export default async function MangaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = createClient()

  // Fetch manga details
  const { data: manga, error } = await supabase
    .from('manga')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !manga) {
    notFound()
  }

  // Fetch all chapters for this manga
  const { data: chapters } = await supabase
    .from('chapters')
    .select('id, chapter_number, title, cover_image, release_date, volume_number, arc')
    .eq('manga_id', id)
    .order('chapter_number', { ascending: true })

  // Fetch review statistics per chapter
  const { data: reviewStats } = await supabase
    .from('chapter_reviews')
    .select('chapter_id, rating')
    .in('chapter_id', chapters?.map(c => c.id) || [])

  // Aggregate review data by chapter
  const chapterData = chapters?.map(chapter => {
    const chapterReviews = reviewStats?.filter(r => r.chapter_id === chapter.id) || []
    const avgRating = chapterReviews.length > 0
      ? chapterReviews.reduce((sum, r) => sum + r.rating, 0) / chapterReviews.length
      : null

    return {
      ...chapter,
      avg_rating: avgRating,
      review_count: chapterReviews.length
    }
  }) || []

  return (
    <div>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.layout}>
            {/* Sidebar - Left Column (sticky) */}
            <div className={styles.sidebar}>
              <div className={styles.sidebarContent}>
                {/* Cover Image */}
                <div className={styles.coverWrapper}>
                  <Image
                    src={manga.cover_image}
                    alt={`${manga.title} cover`}
                    fill
                    className={styles.coverImage}
                    priority
                    sizes="230px"
                  />
                </div>

                {/* Manga Details */}
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

            {/* Main Content - Right Column (wider, scrollable) */}
            <div className={styles.mainContent}>
              <MangaChapterSection chapters={chapterData} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}