'use client'

import styles from './ChapterInfo.module.css'

interface ChapterData {
  id: string
  chapter_number: number
  title: string
  cover_image: string
  avg_rating: number | null
  review_count: number
  ratings?: number[]
}

interface ChapterInfoProps {
  chapter: ChapterData | null
}

// Calculate histogram buckets (10 buckets for ratings 1-10)
function calculateHistogram(ratings: number[]) {
  const buckets = Array(10).fill(0)

  ratings.forEach(rating => {
    // Map rating (0-10) to bucket index (0-9)
    const bucketIndex = Math.min(Math.floor(rating) - 1, 9)
    if (bucketIndex >= 0) {
      buckets[bucketIndex]++
    }
  })

  return buckets
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

  const ratings = chapter.ratings || []
  const histogram = calculateHistogram(ratings)
  const maxCount = Math.max(...histogram, 1)

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

      {/* Rating Histogram */}
      {chapter.review_count > 0 ? (
        <div className={styles.ratingsChart}>
          <div className={styles.ratingsHeader}>
            <h4 className={styles.ratingsTitle}>RATINGS</h4>
            <div className={styles.fansCount}>
              {chapter.review_count} {chapter.review_count === 1 ? 'RATING' : 'RATINGS'}
            </div>
          </div>

          <div className={styles.ratingsBody}>
            {/* Left: Star indicator */}
            <div className={styles.starIndicator}>
              <span className={styles.starIcon}>★</span>
            </div>

            {/* Center: Vertical histogram bars */}
            <div className={styles.histogram}>
              {histogram.map((count, index) => {
                const heightPercentage = maxCount > 0 ? (count / maxCount) * 100 : 0
                const starRating = index + 1
                return (
                  <div
                    key={index}
                    className={styles.histogramBarContainer}
                    title={`${starRating} star${starRating !== 1 ? 's' : ''}: ${count} rating${count !== 1 ? 's' : ''}`}
                  >
                    <div
                      className={styles.histogramBar}
                      style={{
                        height: `${heightPercentage}%`,
                        opacity: 0.3 + (heightPercentage / 100) * 0.7
                      }}
                    />
                  </div>
                )
              })}
            </div>

            {/* Right: Average rating with stars */}
            <div className={styles.averageRatingSection}>
              <div className={styles.averageNumber}>{chapter.avg_rating?.toFixed(1)}</div>
              <div className={styles.starDisplay}>
                {[...Array(5)].map((_, index) => (
                  <span key={index} className={styles.starIconSmall}>★</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.noRatings}>
          <p>No ratings yet</p>
        </div>
      )}
    </div>
  )
}
