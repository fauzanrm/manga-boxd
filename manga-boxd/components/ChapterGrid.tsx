'use client'

import { useState, useMemo } from 'react'
import styles from './ChapterGrid.module.css'

interface ChapterData {
  id: string
  chapter_number: number
  title: string
  cover_image: string
  avg_rating: number | null
  review_count: number
  release_date?: string
  volume_number?: number
  arc?: string
}

interface ChapterGridProps {
  chapters: ChapterData[]
  selectedChapter: number | null
  onChapterSelect: (chapterNumber: number) => void
  currentPage: number
}

type MetricType = 'rating' | 'volume' | 'arc' | 'year'
type GroupingType = 'none' | 'volume' | 'arc' | 'year'

// Distinct color palettes for categorical data - high contrast, non-gradating
const VOLUME_COLORS = [
  '#ef4444', // Red
  '#3b82f6', // Blue
  '#22c55e', // Green
  '#f59e0b', // Orange
  '#a855f7', // Purple
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#eab308', // Yellow
  '#8b5cf6', // Violet
  '#10b981', // Emerald
  '#f97316', // Deep Orange
  '#6366f1', // Indigo
  '#84cc16', // Lime
  '#d946ef', // Fuchsia
  '#14b8a6', // Teal
  '#fb923c', // Light Orange
  '#0ea5e9', // Sky Blue
]

const ARC_COLORS = [
  '#7c3aed', // Purple
  '#f59e0b', // Amber
  '#06b6d4', // Cyan
  '#ef4444', // Red
  '#10b981', // Emerald
  '#ec4899', // Pink
  '#3b82f6', // Blue
  '#eab308', // Yellow
  '#8b5cf6', // Violet
  '#22c55e', // Green
  '#f97316', // Orange
  '#0ea5e9', // Sky
  '#a855f7', // Fuchsia-Purple
  '#84cc16', // Lime
  '#d946ef', // Magenta
  '#14b8a6', // Teal
  '#fb7185', // Rose
]

const YEAR_COLORS = [
  '#0ea5e9', // Sky Blue
  '#ec4899', // Pink
  '#22c55e', // Green
  '#8b5cf6', // Violet
  '#f59e0b', // Amber
  '#06b6d4', // Cyan
  '#ef4444', // Red
  '#a855f7', // Purple
  '#eab308', // Yellow
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#f97316', // Orange
  '#d946ef', // Fuchsia
  '#14b8a6', // Teal
  '#84cc16', // Lime
  '#fb923c', // Light Orange
  '#6366f1', // Indigo
]

export default function ChapterGrid({ chapters, selectedChapter, onChapterSelect, currentPage }: ChapterGridProps) {
  const [hoveredChapter, setHoveredChapter] = useState<number | null>(null)
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('rating')
  const [grouping, setGrouping] = useState<GroupingType>('none')

  const ROWS = 5
  const VISIBLE_CELLS = 100

  // Calculate pagination
  const totalPages = Math.ceil(chapters.length / VISIBLE_CELLS)
  const startIndex = currentPage * VISIBLE_CELLS
  const endIndex = Math.min(startIndex + VISIBLE_CELLS, chapters.length)
  const paginatedChapters = chapters.slice(startIndex, endIndex)

  // Get unique values for categorical metrics
  const uniqueVolumes = useMemo(() =>
    [...new Set(chapters.map(c => c.volume_number).filter(v => v !== null && v !== undefined))].sort((a, b) => a! - b!),
    [chapters]
  )

  const uniqueArcs = useMemo(() =>
    [...new Set(chapters.map(c => c.arc).filter(a => a !== null && a !== undefined))],
    [chapters]
  )

  const uniqueYears = useMemo(() =>
    [...new Set(chapters.map(c => {
      if (!c.release_date) return null
      return new Date(c.release_date).getFullYear()
    }).filter(y => y !== null))].sort((a, b) => a! - b!),
    [chapters]
  )

  // Create color mappings for categorical data
  const volumeColorMap = useMemo(() => {
    const map = new Map<number, string>()
    uniqueVolumes.forEach((vol, index) => {
      map.set(vol!, VOLUME_COLORS[index % VOLUME_COLORS.length])
    })
    return map
  }, [uniqueVolumes])

  const arcColorMap = useMemo(() => {
    const map = new Map<string, string>()
    uniqueArcs.forEach((arc, index) => {
      map.set(arc!, ARC_COLORS[index % ARC_COLORS.length])
    })
    return map
  }, [uniqueArcs])

  const yearColorMap = useMemo(() => {
    const map = new Map<number, string>()
    uniqueYears.forEach((year, index) => {
      map.set(year!, YEAR_COLORS[index % YEAR_COLORS.length])
    })
    return map
  }, [uniqueYears])

  // Calculate grid layout with grouping support
  const { gridData, chapterPositions, totalColumns } = useMemo(() => {
    // Determine total columns based on paginated chapters
    const totalChapters = paginatedChapters.length
    const baseColumns = Math.ceil(totalChapters / ROWS)
    const minCols = Math.ceil(VISIBLE_CELLS / ROWS)
    const gridColumns = Math.max(baseColumns, minCols)

    // Get grouping value for a chapter
    const getGroupValue = (chapter: ChapterData): string | number => {
      switch (grouping) {
        case 'volume':
          return chapter.volume_number ?? 'none'
        case 'arc':
          return chapter.arc ?? 'none'
        case 'year':
          return chapter.release_date ? new Date(chapter.release_date).getFullYear() : 'none'
        default:
          return 'all'
      }
    }

    // Calculate positions - filling left-to-right across full grid width, with gaps at group boundaries
    const positions = new Map<string, { row: number; col: number }>()
    let currentRow = 0
    let currentCol = 0
    let lastGroupValue: string | number | null = null
    let totalCols = 0

    paginatedChapters.forEach((chapter, index) => {
      const groupValue = getGroupValue(chapter)

      // If we're starting a new group (and not the first chapter), add a 1-cell gap
      if (grouping !== 'none' && lastGroupValue !== null && groupValue !== lastGroupValue) {
        currentCol += 1
        // Check if we need to wrap to next row
        if (currentCol >= gridColumns) {
          currentCol = 0
          currentRow += 1
        }
      }

      // Place the chapter
      positions.set(chapter.id, { row: currentRow, col: currentCol })
      totalCols = Math.max(totalCols, currentCol + 1)

      // Update last group value
      lastGroupValue = groupValue

      // Move to next position (left-to-right)
      currentCol += 1
      if (currentCol >= gridColumns) {
        currentCol = 0
        currentRow += 1
      }
    })

    totalCols = Math.max(totalCols, gridColumns)

    // Build grid structure
    const grid: (ChapterData | null)[][] = Array.from({ length: ROWS }, () =>
      Array.from({ length: totalCols }, () => null)
    )

    positions.forEach((pos, chapterId) => {
      const chapter = paginatedChapters.find(c => c.id === chapterId)
      if (chapter && pos.row < ROWS && pos.col < totalCols) {
        grid[pos.row][pos.col] = chapter
      }
    })

    return {
      gridData: grid,
      chapterPositions: positions,
      totalColumns: totalCols
    }
  }, [paginatedChapters, grouping, ROWS, VISIBLE_CELLS])

  // Color function for rating gradient - Red (0) to Green (10)
  const getColorForRating = (rating: number | null) => {
    if (rating === null) return 'var(--bg-card)'

    // Red to Green scale based on rating value
    if (rating >= 9) return '#22c55e'  // Bright Green (9-10)
    if (rating >= 8) return '#4ade80'  // Light Green (8-9)
    if (rating >= 7) return '#84cc16'  // Lime Green (7-8)
    if (rating >= 6) return '#eab308'  // Yellow (6-7)
    if (rating >= 5) return '#f59e0b'  // Amber (5-6)
    if (rating >= 4) return '#fb923c'  // Light Orange (4-5)
    if (rating >= 3) return '#f97316'  // Orange (3-4)
    if (rating >= 2) return '#ef4444'  // Red (2-3)
    if (rating >= 1) return '#dc2626'  // Deep Red (1-2)
    return '#991b1b'  // Very Deep Red (0-1)
  }

  // Get color based on selected metric
  const getCellColor = (chapter: ChapterData | null) => {
    if (!chapter) return 'var(--bg-tertiary)'

    switch (selectedMetric) {
      case 'rating':
        return getColorForRating(chapter.avg_rating)
      case 'volume':
        if (chapter.volume_number === null || chapter.volume_number === undefined) return 'var(--bg-card)'
        return volumeColorMap.get(chapter.volume_number) || 'var(--bg-card)'
      case 'arc':
        if (!chapter.arc) return 'var(--bg-card)'
        return arcColorMap.get(chapter.arc) || 'var(--bg-card)'
      case 'year':
        if (!chapter.release_date) return 'var(--bg-card)'
        const year = new Date(chapter.release_date).getFullYear()
        return yearColorMap.get(year) || 'var(--bg-card)'
      default:
        return 'var(--bg-card)'
    }
  }

  // Get subtle text color based on cell background
  const getTextColor = (bgColor: string) => {
    // For CSS variables, return a semi-transparent white
    if (bgColor.startsWith('var(')) {
      return 'rgba(255, 255, 255, 0.25)'
    }

    // Parse hex color to RGB
    const hex = bgColor.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)

    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

    // Return subtle color based on brightness
    if (luminance > 0.5) {
      // Light background - use dark subtle text
      return 'rgba(0, 0, 0, 0.3)'
    } else {
      // Dark background - use light subtle text
      return 'rgba(255, 255, 255, 0.25)'
    }
  }

  const hoveredChapterData = chapters.find(c => c.chapter_number === hoveredChapter)

  // Generate legend data based on metric type
  const getLegendData = () => {
    switch (selectedMetric) {
      case 'rating':
        // Gradient scale for rating - Red to Green
        return {
          type: 'gradient' as const,
          colors: ['var(--bg-card)', '#991b1b', '#dc2626', '#ef4444', '#f97316', '#fb923c', '#f59e0b', '#eab308', '#84cc16', '#4ade80', '#22c55e'],
          labels: { left: 'Low (0)', right: 'High (10)' }
        }
      case 'volume':
        // Discrete mapping for volumes
        return {
          type: 'discrete' as const,
          items: Array.from(volumeColorMap.entries()).map(([vol, color]) => ({
            label: `Vol. ${vol}`,
            color
          }))
        }
      case 'arc':
        // Discrete mapping for arcs
        return {
          type: 'discrete' as const,
          items: Array.from(arcColorMap.entries()).map(([arc, color]) => ({
            label: arc,
            color
          }))
        }
      case 'year':
        // Discrete mapping for years
        return {
          type: 'discrete' as const,
          items: Array.from(yearColorMap.entries()).map(([year, color]) => ({
            label: year.toString(),
            color
          }))
        }
      default:
        return null
    }
  }

  const legendData = getLegendData()

  return (
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <div className={styles.header}>
          {/* HIDDEN - Chapter Overview title */}
          {false && <h3 className={styles.title}>Chapter Overview</h3>}

          {/* HIDDEN FOR NOW - Metric Selection Chips */}
          {false && (
            <div className={styles.controlGroup}>
              <span className={styles.controlLabel}>Color by:</span>
              <div className={styles.chipGroup}>
                <button
                  className={`${styles.chip} ${selectedMetric === 'rating' ? styles.chipActive : ''}`}
                  onClick={() => setSelectedMetric('rating')}
                >
                  Rating
                </button>
                <button
                  className={`${styles.chip} ${selectedMetric === 'volume' ? styles.chipActive : ''}`}
                  onClick={() => setSelectedMetric('volume')}
                >
                  Volume
                </button>
                <button
                  className={`${styles.chip} ${selectedMetric === 'arc' ? styles.chipActive : ''}`}
                  onClick={() => setSelectedMetric('arc')}
                >
                  Arc
                </button>
                <button
                  className={`${styles.chip} ${selectedMetric === 'year' ? styles.chipActive : ''}`}
                  onClick={() => setSelectedMetric('year')}
                >
                  Year
                </button>
              </div>
            </div>
          )}
        </div>

        {/* HIDDEN FOR NOW - Grouping Selection */}
        {false && (
          <div className={styles.groupingControl}>
            <span className={styles.controlLabel}>Group by:</span>
            <div className={styles.chipGroup}>
              <button
                className={`${styles.chip} ${grouping === 'none' ? styles.chipActive : ''}`}
                onClick={() => setGrouping('none')}
              >
                None
              </button>
              <button
                className={`${styles.chip} ${grouping === 'volume' ? styles.chipActive : ''}`}
                onClick={() => setGrouping('volume')}
              >
                Volume
              </button>
              <button
                className={`${styles.chip} ${grouping === 'arc' ? styles.chipActive : ''}`}
                onClick={() => setGrouping('arc')}
              >
                Arc
              </button>
              <button
                className={`${styles.chip} ${grouping === 'year' ? styles.chipActive : ''}`}
                onClick={() => setGrouping('year')}
              >
                Year
              </button>
            </div>
          </div>
        )}

        {/* HIDDEN FOR NOW - Horizontal Pagination Controls */}
        {false && totalPages > 1 && (
          <div className={styles.paginationControl}>
            <button
              className={styles.paginationButton}
              disabled={currentPage === 0}
            >
              ← Previous
            </button>
            <span className={styles.pageIndicator}>
              Chapters {startIndex + 1}-{endIndex} of {chapters.length}
              <span className={styles.pageNumber}> (Page {currentPage + 1} of {totalPages})</span>
            </span>
            <button
              className={styles.paginationButton}
              disabled={currentPage === totalPages - 1}
            >
              Next →
            </button>
          </div>
        )}
      </div>

      <div className={styles.gridWrapper}>
        <div className={styles.grid}>
          {gridData.map((row, rowIndex) => (
            <div key={rowIndex} className={styles.row}>
              {row.map((chapter, colIndex) => {
                const bgColor = getCellColor(chapter)
                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`${styles.cell} ${
                      chapter && chapter.chapter_number === selectedChapter ? styles.cellSelected : ''
                    }`}
                    style={{
                      backgroundColor: bgColor,
                      color: getTextColor(bgColor),
                      cursor: chapter ? 'pointer' : 'default'
                    }}
                    onClick={() => chapter && onChapterSelect(chapter.chapter_number)}
                    onMouseEnter={() => chapter && setHoveredChapter(chapter.chapter_number)}
                    onMouseLeave={() => setHoveredChapter(null)}
                  >
                    {chapter && chapter.chapter_number}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Tooltip */}
        {hoveredChapterData && (
          <div className={styles.tooltip}>
            <p className={styles.tooltipTitle}>
              Chapter {hoveredChapterData.chapter_number}
              {hoveredChapterData.title && ` • ${hoveredChapterData.title}`}
            </p>
            {hoveredChapterData.avg_rating !== null ? (
              <>
                <p className={styles.tooltipRating}>
                  Rating: <strong>{hoveredChapterData.avg_rating.toFixed(1)}</strong> / 10
                </p>
                <p className={styles.tooltipCount}>
                  {hoveredChapterData.review_count} {hoveredChapterData.review_count === 1 ? 'review' : 'reviews'}
                </p>
              </>
            ) : (
              <p className={styles.tooltipNoRating}>No ratings yet</p>
            )}
          </div>
        )}
      </div>

      {/* HIDDEN FOR NOW - Dynamic Legend */}
      {false && legendData && (
        <div className={styles.legendContainer}>
          {legendData.type === 'gradient' ? (
            <div className={styles.legend}>
              <span className={styles.legendLabel}>{legendData.labels.left}</span>
              <div className={styles.legendColors}>
                {legendData.colors.map((color, index) => (
                  <div key={index} className={styles.legendCell} style={{ backgroundColor: color }} />
                ))}
              </div>
              <span className={styles.legendLabel}>{legendData.labels.right}</span>
            </div>
          ) : (
            <div className={styles.discreteLegend}>
              {legendData.items.map((item, index) => (
                <div key={index} className={styles.discreteLegendItem}>
                  <div className={styles.discreteColor} style={{ backgroundColor: item.color }} />
                  <span className={styles.discreteLabel}>{item.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
