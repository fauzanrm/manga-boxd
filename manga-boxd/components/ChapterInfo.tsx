'use client'

import styles from './ChapterInfo.module.css'

interface ChapterData {
  id: string
  chapter_number: number
  title: string
  cover_image: string
  avg_rating: number | null
  review_count: number
}

interface ChapterInfoProps {
  chapter: ChapterData | null
}

export default function ChapterInfo({ chapter }: ChapterInfoProps) {
  if (!chapter) {
    return (
      <div className={styles.container}>
        <div className={styles.placeholder}>
          <p className={styles.placeholderText}>Select a chapter to view details</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          Chapter {chapter.chapter_number}
          {chapter.title && <span className={styles.subtitle}> • {chapter.title}</span>}
        </h3>
        <p className={styles.description}>
          This is where chapter synopsis or description would go. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
      </div>

      <div className={styles.stats}>
        {chapter.avg_rating !== null ? (
          <div className={styles.statItem}>
            <div className={styles.ratingBadge}>
              <span className={styles.ratingValue}>{chapter.avg_rating.toFixed(1)}</span>
              <span className={styles.ratingStar}>★</span>
            </div>
            <p className={styles.statLabel}>Average Rating</p>
          </div>
        ) : (
          <div className={styles.statItem}>
            <div className={styles.noRating}>—</div>
            <p className={styles.statLabel}>No Ratings Yet</p>
          </div>
        )}

        <div className={styles.statItem}>
          <div className={styles.reviewCount}>{chapter.review_count}</div>
          <p className={styles.statLabel}>
            {chapter.review_count === 1 ? 'Review' : 'Reviews'}
          </p>
        </div>
      </div>
    </div>
  )
}
