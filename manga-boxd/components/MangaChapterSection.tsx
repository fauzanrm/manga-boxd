'use client'

import { useState } from 'react'
import ChapterInfo from './ChapterInfo'
import ChapterGrid from './ChapterGrid'
import ChapterInteraction from './ChapterInteraction'
import styles from './MangaChapterSection.module.css'

interface ChapterData {
  id: string
  chapter_number: number
  title: string
  cover_image: string
  avg_rating: number | null
  review_count: number
}

interface MangaChapterSectionProps {
  chapters: ChapterData[]
}

export default function MangaChapterSection({ chapters }: MangaChapterSectionProps) {
  const [selectedChapter, setSelectedChapter] = useState<number | null>(
    chapters.length > 0 ? chapters[0].chapter_number : null
  )
  const [currentPage, setCurrentPage] = useState(0)

  const handleChapterSelect = (chapterNumber: number) => {
    setSelectedChapter(chapterNumber)
  }

  const currentChapter = chapters.find(c => c.chapter_number === selectedChapter) || null

  const VISIBLE_CELLS = 100
  const totalPages = Math.ceil(chapters.length / VISIBLE_CELLS)
  const startChapter = currentPage * VISIBLE_CELLS + 1
  const endChapter = Math.min((currentPage + 1) * VISIBLE_CELLS, chapters.length)

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  if (chapters.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No chapters available for this manga.</p>
      </div>
    )
  }

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Chapter Ratings</h2>

      <div className={styles.chapterRangeHeader}>
        <h3 className={styles.chapterRange}>Chapters {startChapter}-{endChapter}</h3>
      </div>

      <div className={styles.gridWithArrows}>
        <ChapterGrid
          chapters={chapters}
          selectedChapter={selectedChapter}
          onChapterSelect={handleChapterSelect}
          currentPage={currentPage}
        />

        {totalPages > 1 && (
          <div className={styles.arrowControls}>
            <button
              className={styles.arrowButton}
              onClick={goToPreviousPage}
              disabled={currentPage === 0}
              aria-label="Previous page"
            >
              ▲
            </button>
            <button
              className={styles.arrowButton}
              onClick={goToNextPage}
              disabled={currentPage === totalPages - 1}
              aria-label="Next page"
            >
              ▼
            </button>
          </div>
        )}
      </div>

      {/* Two-column layout for Chapter Info and Interaction */}
      <div className={styles.chapterDetailsLayout}>
        <div className={styles.chapterInfoColumn}>
          <ChapterInfo chapter={currentChapter} />
        </div>
        <div className={styles.chapterInteractionColumn}>
          {currentChapter && (
            <ChapterInteraction
              chapterNumber={currentChapter.chapter_number}
              coverImage={currentChapter.cover_image}
              title={currentChapter.title}
            />
          )}
        </div>
      </div>
    </div>
  )
}
