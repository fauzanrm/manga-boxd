'use client'

import { useMemo } from 'react'
import {
  ComposedChart,
  Bar,
  Line,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts'
import styles from './RatingChart.module.css'

interface ChapterData {
  id: string
  chapter_number: number
  title: string
  cover_image: string
  avg_rating: number | null
  review_count: number
}

interface RatingChartProps {
  chapters: ChapterData[]
  selectedChapter: number | null
  onChapterClick: (chapterNumber: number) => void
}

// Calculate 10-chapter moving average
function calculateMovingAverage(data: ChapterData[], window: number = 10) {
  return data.map((chapter, index) => {
    const start = Math.max(0, index - window + 1)
    const relevantChapters = data.slice(start, index + 1).filter(c => c.avg_rating !== null)

    if (relevantChapters.length === 0) return null

    const sum = relevantChapters.reduce((acc, c) => acc + (c.avg_rating || 0), 0)
    return sum / relevantChapters.length
  })
}

export default function RatingChart({ chapters, selectedChapter, onChapterClick }: RatingChartProps) {
  const chartData = useMemo(() => {
    const movingAvg = calculateMovingAverage(chapters)

    return chapters.map((chapter, index) => ({
      chapter: chapter.chapter_number,
      rating: chapter.avg_rating,
      reviewCount: chapter.review_count,
      movingAverage: movingAvg[index],
      isSelected: chapter.chapter_number === selectedChapter
    }))
  }, [chapters, selectedChapter])

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className={styles.tooltip}>
          <p className={styles.tooltipTitle}>Chapter {data.chapter}</p>
          {data.rating !== null && (
            <p className={styles.tooltipRating}>
              Rating: <strong>{data.rating.toFixed(1)}</strong>
            </p>
          )}
          <p className={styles.tooltipCount}>
            {data.reviewCount} {data.reviewCount === 1 ? 'review' : 'reviews'}
          </p>
          {data.movingAverage !== null && (
            <p className={styles.tooltipAvg}>
              10-ch avg: {data.movingAverage.toFixed(1)}
            </p>
          )}
        </div>
      )
    }
    return null
  }

  // Calculate max review count for right Y-axis scaling
  const maxReviewCount = Math.max(...chartData.map(d => d.reviewCount), 10)

  return (
    <div className={styles.chartContainer}>
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={styles.legendDot} style={{ backgroundColor: 'var(--accent-orange)' }} />
          <span>Chapter Rating</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendLine} style={{ backgroundColor: 'var(--accent-green)' }} />
          <span>10-Chapter Moving Avg</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendBar} />
          <span>Review Volume</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart
          data={chartData}
          onClick={(data) => {
            if (data && data.activeLabel) {
              onChapterClick(parseInt(data.activeLabel))
            }
          }}
          margin={{ top: 20, right: 60, left: 20, bottom: 20 }}
        >
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent-orange)" stopOpacity={0.2} />
              <stop offset="100%" stopColor="var(--accent-orange)" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />

          <XAxis
            dataKey="chapter"
            stroke="var(--text-muted)"
            tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
            label={{ value: 'Chapter', position: 'insideBottom', offset: -10, fill: 'var(--text-secondary)' }}
          />

          {/* Left Y-Axis: Rating (0-10) */}
          <YAxis
            yAxisId="rating"
            domain={[0, 10]}
            stroke="var(--accent-orange)"
            tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
            label={{ value: 'Rating (1-10)', angle: -90, position: 'insideLeft', fill: 'var(--text-secondary)' }}
          />

          {/* Right Y-Axis: Review Count */}
          <YAxis
            yAxisId="volume"
            orientation="right"
            domain={[0, maxReviewCount]}
            stroke="var(--text-muted)"
            tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
            label={{ value: 'Review Count', angle: 90, position: 'insideRight', fill: 'var(--text-secondary)' }}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 128, 0, 0.1)' }} />

          {/* Background bars showing review volume - using right Y-axis */}
          <Bar
            yAxisId="volume"
            dataKey="reviewCount"
            fill="url(#barGradient)"
            radius={[4, 4, 0, 0]}
            opacity={0.4}
          />

          {/* Individual chapter ratings as dots - using left Y-axis */}
          <Scatter yAxisId="rating" dataKey="rating" fill="var(--accent-orange)">
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.isSelected ? '#fff' : 'var(--accent-orange)'}
                stroke={entry.isSelected ? 'var(--accent-orange)' : 'none'}
                strokeWidth={entry.isSelected ? 3 : 0}
                r={entry.isSelected ? 8 : 6}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </Scatter>

          {/* Moving average line - using left Y-axis - render last so it's on top */}
          <Line
            yAxisId="rating"
            type="monotone"
            dataKey="movingAverage"
            stroke="#00e054"
            strokeWidth={4}
            dot={false}
            connectNulls
            strokeOpacity={1}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
