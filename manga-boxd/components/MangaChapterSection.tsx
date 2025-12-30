'use client'

import { useState } from 'react'
import RatingChart from './RatingChart'
import ChapterInfo from './ChapterInfo'
import ChapterTimeline from './ChapterTimeline'
import ChapterGrid from './ChapterGrid'
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

  const handleChapterSelect = (chapterNumber: number) => {
    setSelectedChapter(chapterNumber)
  }

  const currentChapter = chapters.find(c => c.chapter_number === selectedChapter) || null

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

      {/* GitHub-style Chapter Grid */}
      <ChapterGrid
        chapters={chapters}
        selectedChapter={selectedChapter}
        onChapterSelect={handleChapterSelect}
      />

      <ChapterInfo chapter={currentChapter} />

      <RatingChart
        chapters={chapters}
        selectedChapter={selectedChapter}
        onChapterClick={handleChapterSelect}
      />

      <ChapterTimeline
        chapters={chapters}
        selectedChapter={selectedChapter}
        onChapterSelect={handleChapterSelect}
      />
    </div>
  )
}
