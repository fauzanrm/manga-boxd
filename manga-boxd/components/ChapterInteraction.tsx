'use client'

import { useState } from 'react'
import Image from 'next/image'
import styles from './ChapterInteraction.module.css'

interface ChapterInteractionProps {
  chapterNumber: number
  coverImage: string
  title?: string
}

export default function ChapterInteraction({ chapterNumber, coverImage, title }: ChapterInteractionProps) {
  const [isRead, setIsRead] = useState(false)
  const [isLoved, setIsLoved] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoveredStar, setHoveredStar] = useState(0)

  const handleStarClick = (star: number) => {
    setRating(star)
  }

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log('Share chapter', chapterNumber)
  }

  return (
    <div className={styles.container}>
      {/* Chapter Cover */}
      <div className={styles.coverWrapper}>
        <Image
          src={coverImage}
          alt={`Chapter ${chapterNumber}${title ? ` - ${title}` : ''}`}
          fill
          className={styles.coverImage}
          sizes="200px"
        />
      </div>

      {/* Interaction Box */}
      <div className={styles.interactionBox}>
        {/* Row 1: Read and Love */}
        <div className={styles.row}>
          <button
            className={`${styles.iconButton} ${isRead ? styles.iconButtonActive : ''}`}
            onClick={() => setIsRead(!isRead)}
            aria-label="Mark as read"
          >
            <span className={styles.icon}>📖</span>
            <span className={styles.label}>Read</span>
          </button>
          <button
            className={`${styles.iconButton} ${isLoved ? styles.iconButtonActive : ''}`}
            onClick={() => setIsLoved(!isLoved)}
            aria-label="Add to favorites"
          >
            <span className={styles.icon}>{isLoved ? '❤️' : '🤍'}</span>
            <span className={styles.label}>Love</span>
          </button>
        </div>

        {/* Row 2: Star Rating */}
        <div className={styles.ratingRow}>
          <div className={styles.ratingLabel}>Rate:</div>
          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className={styles.starButton}
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
              >
                <span className={star <= (hoveredStar || rating) ? styles.starFilled : styles.starEmpty}>
                  ★
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Row 3: Share */}
        <div className={styles.row}>
          <button
            className={styles.shareButton}
            onClick={handleShare}
            aria-label="Share chapter"
          >
            <span className={styles.icon}>🔗</span>
            <span className={styles.label}>Share</span>
          </button>
        </div>
      </div>
    </div>
  )
}
