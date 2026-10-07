'use client'

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useEffect, useState } from 'react'

export type Range = 'weekly' | 'monthly'

type QuizResult = {
  percentage?: number
  score?: number
  totalQuestions?: number
  date?: string
}

type ChartPoint = {
  label: string
  score: number
  quizzes: number
}

function getPercentage(result: QuizResult) {
  if (typeof result.percentage === 'number') {
    return result.percentage
  }

  if (
    typeof result.score === 'number' &&
    typeof result.totalQuestions === 'number' &&
    result.totalQuestions > 0
  ) {
    return Math.round(
      (result.score / result.totalQuestions) * 100,
    )
  }

  return 0
}

function getResults(): QuizResult[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const stored = localStorage.getItem(
      'cloudlearn_quiz_results',
    )

    if (!stored) {
      return []
    }

    const parsed = JSON.parse(stored)

    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function createWeeklyData(
  results: QuizResult[],
): ChartPoint[] {
  const now = new Date()

  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now)

    date.setHours(0, 0, 0, 0)
    date.setDate(
      now.getDate() - (6 - index),
    )

    return date
  })

  return days.map((day) => {
    const dayResults = results.filter((result) => {
      if (!result.date) return false

      const resultDate = new Date(result.date)

      return (
        resultDate.getFullYear() === day.getFullYear() &&
        resultDate.getMonth() === day.getMonth() &&
        resultDate.getDate() === day.getDate()
      )
    })

    const score =
      dayResults.length > 0
        ? Math.round(
            dayResults.reduce(
              (total, result) =>
                total + getPercentage(result),
              0,
            ) / dayResults.length,
          )
        : 0

    return {
      label: day.toLocaleDateString('en-US', {
        weekday: 'short',
      }),
      score,
      quizzes: dayResults.length,
    }
  })
}

function createMonthlyData(
  results: QuizResult[],
): ChartPoint[] {
  const now = new Date()

  const months = Array.from(
    { length: 6 },
    (_, index) => {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - (5 - index),
        1,
      )

      return date
    },
  )

  return months.map((month) => {
    const monthResults = results.filter((result) => {
      if (!result.date) return false

      const resultDate = new Date(result.date)

      return (
        resultDate.getFullYear() ===
          month.getFullYear() &&
        resultDate.getMonth() ===
          month.getMonth()
      )
    })

    const score =
      monthResults.length > 0
        ? Math.round(
            monthResults.reduce(
              (total, result) =>
                total + getPercentage(result),
              0,
            ) / monthResults.length,
          )
        : 0

    return {
      label: month.toLocaleDateString('en-US', {
        month: 'short',
      }),
      score,
      quizzes: monthResults.length,
    }
  })
}

type TooltipPayload = {
  payload: ChartPoint
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: TooltipPayload[]
}) {
  if (!active || !payload?.length) {
    return null
  }

  const point = payload[0].payload

  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md">
      <p className="font-semibold text-popover-foreground">
        {point.label}
      </p>

      <p className="text-muted-foreground">
        Score:{' '}
        <span className="font-medium text-foreground tabular-nums">
          {point.score}%
        </span>
      </p>

      <p className="text-muted-foreground">
        Quizzes:{' '}
        <span className="font-medium text-foreground tabular-nums">
          {point.quizzes}
        </span>
      </p>
    </div>
  )
}

export function ProgressChart({
  range,
}: {
  range: Range
}) {
  const [results, setResults] = useState<QuizResult[]>([])

  useEffect(() => {
    const refreshResults = () => {
      setResults(getResults())
    }

    refreshResults()

    window.addEventListener(
      'cloudlearn:quiz-completed',
      refreshResults,
    )

    window.addEventListener(
      'storage',
      refreshResults,
    )

    return () => {
      window.removeEventListener(
        'cloudlearn:quiz-completed',
        refreshResults,
      )

      window.removeEventListener(
        'storage',
        refreshResults,
      )
    }
  }, [])

  const points =
    range === 'weekly'
      ? createWeeklyData(results)
      : createMonthlyData(results)

  const hasResults = results.length > 0

  const summary = points
    .map(
      (point) =>
        `${point.label} ${point.score}%`,
    )
    .join(', ')

  return (
    <figure className="h-64 w-full sm:h-72">
      <figcaption className="sr-only">
        {range === 'weekly'
          ? 'Weekly'
          : 'Monthly'}{' '}
        average score: {summary}
      </figcaption>

      {!hasResults ? (
        <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
          Complete a quiz to see your real progress.
        </div>
      ) : (
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <AreaChart
            data={points}
            margin={{
              top: 8,
              right: 8,
              left: -16,
              bottom: 0,
            }}
            accessibilityLayer
          >
            <defs>
              <linearGradient
                id="score-fill"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.35}
                />

                <stop
                  offset="100%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              stroke="var(--border)"
              strokeDasharray="4 4"
            />

            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tick={{
                fill: 'var(--muted-foreground)',
                fontSize: 12,
              }}
            />

            <YAxis
              domain={[0, 100]}
              ticks={[
                0,
                20,
                40,
                60,
                80,
                100,
              ]}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) =>
                `${value}%`
              }
              tick={{
                fill: 'var(--muted-foreground)',
                fontSize: 12,
              }}
            />

            <Tooltip
              content={
                <ChartTooltip />
              }
              cursor={{
                stroke: 'var(--border)',
                strokeWidth: 1,
              }}
            />

            <Area
              key={range}
              type="monotone"
              dataKey="score"
              stroke="var(--chart-1)"
              strokeWidth={2.5}
              fill="url(#score-fill)"
              activeDot={{
                r: 5,
                strokeWidth: 2,
                stroke: 'var(--card)',
              }}
              animationDuration={700}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </figure>
  )
}