'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import styles from './ChapterTimeline.module.css'

interface ChapterData {
  id: string
  chapter_number: number
  title: string
  cover_image: string
  avg_rating: number | null
  review_count: number
}

interface ChapterTimelineProps {
  chapters: ChapterData[]
  selectedChapter: number | null
  onChapterSelect: (chapterNumber: number) => void
}

export default function ChapterTimeline({ chapters, selectedChapter, onChapterSelect }: ChapterTimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null)
  const selectedCardRef = useRef<HTMLDivElement>(null)

  // Scroll to selected chapter when it changes
  useEffect(() => {
    if (selectedCardRef.current && timelineRef.current) {
      const timeline = timelineRef.current
      const card = selectedCardRef.current

      const timelineRect = timeline.getBoundingClientRect()
      const cardRect = card.getBoundingClientRect()

      const scrollLeft = card.offsetLeft - (timelineRect.width / 2) + (cardRect.width / 2)

      timeline.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      })
    }
  }, [selectedChapter])

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>All Chapters</h3>
      <div ref={timelineRef} className={styles.timeline}>
        {chapters.map((chapter) => {
          const isSelected = chapter.chapter_number === selectedChapter

          return (
            <div
              key={chapter.id}
              ref={isSelected ? selectedCardRef : null}
              className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}
              onClick={() => onChapterSelect(chapter.chapter_number)}
            >
              <div className={styles.coverWrapper}>
                <Image
                  src={chapter.cover_image}
                  alt={`Chapter ${chapter.chapter_number}`}
                  fill
                  className={styles.coverImage}
                  sizes="120px"
                />
                {isSelected && <div className={styles.selectedOverlay} />}
              </div>

              <div className={styles.info}>
                <p className={styles.chapterNumber}>Ch. {chapter.chapter_number}</p>
                {chapter.avg_rating !== null && (
                  <div className={styles.rating}>
                    <span className={styles.ratingStar}>★</span>
                    <span className={styles.ratingValue}>{chapter.avg_rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
