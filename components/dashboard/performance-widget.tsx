'use client'

import { motion } from 'framer-motion'
import { Award, ClipboardList, TrendingUp } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import { ProgressChart, type Range } from './progress-chart'
import { ScoreRing } from './score-ring'

const ranges: { value: Range; label: string }[] = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
]

const TOTAL_QUIZZES = 3

type QuizResult = {
  id?: number | string
  quizId?: string
  subject?: string
  difficulty?: string
  score?: number
  totalQuestions?: number
  percentage?: number
  date?: string
}

function getQuizResults(): QuizResult[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const stored = localStorage.getItem('cloudlearn_quiz_results')

    if (!stored) {
      return []
    }

    const parsed = JSON.parse(stored)

    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.error('Failed to read quiz results:', error)
    return []
  }
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
    return Math.round((result.score / result.totalQuestions) * 100)
  }

  return 0
}

function getQuizId(result: QuizResult) {
  return (
    result.quizId?.trim() ||
    result.subject?.trim().toLowerCase() ||
    ''
  )
}

export function PerformanceWidget() {
  const [range, setRange] = useState<Range>('weekly')
  const [results, setResults] = useState<QuizResult[]>([])
  const panelId = useId()

  useEffect(() => {
    const refreshResults = () => {
      setResults(getQuizResults())
    }

    refreshResults()

    window.addEventListener('cloudlearn:quiz-completed', refreshResults)
    window.addEventListener('storage', refreshResults)

    return () => {
      window.removeEventListener(
        'cloudlearn:quiz-completed',
        refreshResults,
      )
      window.removeEventListener('storage', refreshResults)
    }
  }, [])

  const attempts = results.length

  const uniqueQuizIds = new Set(
    results
      .map(getQuizId)
      .filter(Boolean),
  )

  const completedQuizzes = Math.min(
    uniqueQuizIds.size,
    TOTAL_QUIZZES,
  )

  const progressPercentage =
    TOTAL_QUIZZES > 0
      ? Math.round((completedQuizzes / TOTAL_QUIZZES) * 100)
      : 0

  const averageScore =
    results.length > 0
      ? Math.round(
          results.reduce(
            (total, result) => total + getPercentage(result),
            0,
          ) / results.length,
        )
      : 0

  const strongestSubject = (() => {
    const subjectScores: Record<
      string,
      { total: number; count: number }
    > = {}

    results.forEach((result) => {
      const subject = result.subject?.trim()

      if (!subject) {
        return
      }

      if (!subjectScores[subject]) {
        subjectScores[subject] = {
          total: 0,
          count: 0,
        }
      }

      subjectScores[subject].total += getPercentage(result)
      subjectScores[subject].count += 1
    })

    const subjects = Object.entries(subjectScores)

    if (subjects.length === 0) {
      return {
        name: 'Not available',
        average: 0,
        count: 0,
      }
    }

    const strongest = subjects.reduce((best, current) => {
      const bestAverage =
        best[1].total / best[1].count

      const currentAverage =
        current[1].total / current[1].count

      return currentAverage > bestAverage
        ? current
        : best
    })

    return {
      name: strongest[0],
      average: Math.round(
        strongest[1].total / strongest[1].count,
      ),
      count: strongest[1].count,
    }
  })()

  return (
    <motion.section
      aria-labelledby="performance-heading"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: 0.3,
        ease: 'easeOut',
      }}
      className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-card p-5 shadow-sm sm:p-6 dark:border-white/10"
    >
      <div className="flex flex-col gap-1">
        <h2
          id="performance-heading"
          className="text-lg font-semibold tracking-tight"
        >
          Your Performance
        </h2>

        <p className="text-sm text-muted-foreground">
          A snapshot of your quiz results and learning progress.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Average Score */}
        <div className="flex items-center gap-4 rounded-xl border border-border bg-background/60 p-4">
          <ScoreRing value={averageScore} />

          <div className="flex flex-col gap-1">
            <p className="text-sm text-muted-foreground">
              Average Score
            </p>

            <p className="text-2xl font-semibold tabular-nums">
              {averageScore}%
            </p>

            {results.length > 0 ? (
              <p className="inline-flex items-center gap-1 text-xs font-medium text-success">
                <TrendingUp
                  className="size-3.5"
                  aria-hidden="true"
                />
                Based on {attempts} attempt
                {attempts === 1 ? '' : 's'}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                No quiz attempts yet
              </p>
            )}
          </div>
        </div>

        {/* Quiz Attempts / Progress */}
        <div className="flex flex-col justify-between gap-3 rounded-xl border border-border bg-background/60 p-4">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">
                Quiz Attempts
              </p>

              <p className="text-2xl font-semibold tabular-nums">
                {attempts}
              </p>
            </div>

            <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <ClipboardList
                className="size-4"
                aria-hidden="true"
              />
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <div
              role="progressbar"
              aria-label="Quiz completion progress"
              aria-valuemin={0}
              aria-valuemax={TOTAL_QUIZZES}
              aria-valuenow={completedQuizzes}
              className="h-2 overflow-hidden rounded-full bg-muted"
            >
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400"
                initial={{ width: 0 }}
                animate={{
                  width: `${progressPercentage}%`,
                }}
                transition={{
                  duration: 0.7,
                  ease: 'easeOut',
                }}
              />
            </div>

            <span className="text-xs text-muted-foreground">
              {completedQuizzes} of {TOTAL_QUIZZES} quizzes completed
              {' · '}
              {progressPercentage}% progress
            </span>
          </div>
        </div>

        {/* Strongest Subject */}
        <div className="flex flex-col justify-between gap-3 rounded-xl border border-border bg-background/60 p-4">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-2">
              <p className="text-sm text-muted-foreground">
                Strongest Subject
              </p>

              <div>
                <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700 dark:border-indigo-400/30 dark:bg-indigo-400/10 dark:text-indigo-200">
                  {strongestSubject.name}
                </span>
              </div>
            </div>

            <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <Award
                className="size-4"
                aria-hidden="true"
              />
            </span>
          </div>

          <p className="text-xs text-muted-foreground">
            {strongestSubject.count > 0
              ? `${strongestSubject.average}% average across ${strongestSubject.count} quiz ${
                  strongestSubject.count === 1
                    ? 'attempt'
                    : 'attempts'
                }`
              : 'Complete a quiz to see your strongest subject.'}
          </p>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-semibold">
            Progress over time
          </h3>

          <div
            role="tablist"
            aria-label="Chart time range"
            className="relative inline-flex rounded-lg border border-border bg-muted p-1"
          >
            {ranges.map((option) => {
              const selected = range === option.value

              return (
                <button
                  key={option.value}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={panelId}
                  onClick={() => setRange(option.value)}
                  className={`relative rounded-md px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                    selected
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {selected && (
                    <motion.span
                      layoutId="range-pill"
                      className="absolute inset-0 rounded-md bg-card shadow-sm"
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 32,
                      }}
                    />
                  )}

                  <span className="relative">
                    {option.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div
          id={panelId}
          role="tabpanel"
          aria-label={`${range} progress chart`}
        >
          <ProgressChart range={range} />
        </div>
      </div>
    </motion.section>
  )
}