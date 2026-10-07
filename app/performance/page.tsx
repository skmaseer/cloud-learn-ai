'use client'

import Link from 'next/link'
import { ArrowLeft, BarChart3, Cloud, Trophy } from 'lucide-react'
import { useEffect, useState } from 'react'

type QuizResult = {
  id: number
  score: number
  totalQuestions: number
  percentage: number
  date: string
}

export default function PerformancePage() {
  const [results, setResults] = useState<QuizResult[]>([])

  useEffect(() => {
    const storedResults = localStorage.getItem(
      'cloudlearn_quiz_results',
    )

    if (storedResults) {
      try {
        setResults(JSON.parse(storedResults))
      } catch (error) {
        console.error(
          'Failed to load quiz results:',
          error,
        )
      }
    }
  }, [])

  const attempts = results.length

  const averageScore =
    attempts > 0
      ? Math.round(
          results.reduce(
            (total, result) =>
              total + result.percentage,
            0,
          ) / attempts,
        )
      : 0

  const bestScore =
    attempts > 0
      ? Math.max(
          ...results.map(
            (result) => result.percentage,
          ),
        )
      : 0

  const latestResult =
    results.length > 0
      ? results[results.length - 1]
      : null

  return (
    <main className="relative min-h-dvh overflow-hidden bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-indigo-100/60 to-transparent dark:from-indigo-950/40"
      />

      <div className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-slate-800 text-white">
              <Cloud className="size-4" />
            </span>

            <span className="text-sm font-semibold">
              CloudLearn AI
            </span>
          </div>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
            Analytics
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            My Performance
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Track your quiz performance and monitor
            your learning progress.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card/90 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
                <BarChart3 className="size-6" />
              </div>

              <div>
                <p className="text-3xl font-semibold">
                  {attempts}
                </p>

                <p className="text-sm text-muted-foreground">
                  Quiz Attempts
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/90 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
                <BarChart3 className="size-6" />
              </div>

              <div>
                <p className="text-3xl font-semibold">
                  {averageScore}%
                </p>

                <p className="text-sm text-muted-foreground">
                  Average Score
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/90 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
                <Trophy className="size-6" />
              </div>

              <div>
                <p className="text-3xl font-semibold">
                  {bestScore}%
                </p>

                <p className="text-sm text-muted-foreground">
                  Best Score
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Result */}
        <div className="mt-8 rounded-2xl border border-border bg-card/90 shadow-xl">
          <div className="border-b border-border p-6">
            <h2 className="font-semibold">
              Latest Quiz Result
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Your most recent assessment result.
            </p>
          </div>

          {latestResult ? (
            <div className="p-6">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Score
                  </p>

                  <p className="mt-1 text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                    {latestResult.percentage}%
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Correct Answers
                  </p>

                  <p className="mt-1 text-xl font-semibold">
                    {latestResult.score}/
                    {latestResult.totalQuestions}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Date
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {new Date(
                      latestResult.date,
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-10 text-center">
              <p className="font-medium">
                No quiz results yet
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Complete a quiz to see your performance
                here.
              </p>

              <Link
                href="/quiz"
                className="mt-5 inline-flex rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
              >
                Take a Quiz
              </Link>
            </div>
          )}
        </div>

        {/* Quiz History */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card/90 shadow-xl">
          <div className="border-b border-border p-6">
            <h2 className="font-semibold">
              Quiz History
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Your previous quiz attempts.
            </p>
          </div>

          {results.length > 0 ? (
            <div className="divide-y divide-border">
              {[...results]
                .reverse()
                .map((result, index) => (
                  <div
                    key={result.id}
                    className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium">
                        Quiz Attempt #{results.length - index}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(
                          result.date,
                        ).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-6">
                      <span className="text-sm text-muted-foreground">
                        {result.score}/
                        {result.totalQuestions}
                      </span>

                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                        {result.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No quiz attempts available.
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          CloudLearn AI · AI-Powered Cloud Learning Platform
        </p>
      </div>
    </main>
  )
}