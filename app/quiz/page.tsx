'use client'

import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Cloud, Sparkles } from 'lucide-react'
import { useState } from 'react'

type QuizQuestion = {
  question: string
  options: string[]
  answer: string
  explanation: string
}

export default function QuizPage() {
  const [subject, setSubject] = useState('DBMS')
  const [difficulty, setDifficulty] = useState('Medium')

  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [finalScore, setFinalScore] = useState(0)

  const [quizStarted, setQuizStarted] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const saveQuizResult = (
    finalQuizScore: number,
    totalQuestions: number,
  ) => {
    const existingResults = JSON.parse(
      localStorage.getItem('cloudlearn_quiz_results') || '[]',
    )

    const newResult = {
  id: Date.now(),

  quizId: subject.trim().toLowerCase(),

  subject,
  difficulty,

  score,

  totalQuestions: questions.length,

  percentage: Math.round(
    (score / questions.length) * 100,
  ),

  date: new Date().toISOString(),
}

    localStorage.setItem(
  'cloudlearn_quiz_results',
  JSON.stringify([
    ...existingResults,
    newResult,
  ]),
)

window.dispatchEvent(
  new Event('cloudlearn:quiz-completed'),
)
  }

  const generateQuiz = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          difficulty,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || 'Failed to generate quiz.',
        )
      }

      if (
        !data.questions ||
        data.questions.length !== 15
      ) {
        throw new Error(
          'The AI did not generate exactly 15 questions.',
        )
      }

      setQuestions(data.questions)
      setCurrentQuestion(0)
      setSelectedAnswer('')
      setScore(0)
      setFinalScore(0)
      setSubmitted(false)
      setQuizStarted(true)
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to generate quiz.',
      )
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    if (!selectedAnswer) {
      alert('Please select an answer first.')
      return
    }

    const question = questions[currentQuestion]

    const isCorrect =
      selectedAnswer === question.answer

    const updatedScore =
      score + (isCorrect ? 1 : 0)

    setScore(updatedScore)

    if (
      currentQuestion ===
      questions.length - 1
    ) {
      setFinalScore(updatedScore)

      saveQuizResult(
        updatedScore,
        questions.length,
      )

      setSubmitted(true)
      return
    }

    setCurrentQuestion(
      (current) => current + 1,
    )

    setSelectedAnswer('')
  }

  const restartQuiz = () => {
    setQuestions([])
    setCurrentQuestion(0)
    setSelectedAnswer('')
    setScore(0)
    setFinalScore(0)
    setSubmitted(false)
    setQuizStarted(false)
    setError('')
  }

  /*
   * --------------------------------------------------
   * RESULT SCREEN
   * --------------------------------------------------
   */

  if (submitted) {
    const percentage = Math.round(
      (finalScore / questions.length) * 100,
    )

    return (
      <main className="relative min-h-dvh overflow-hidden bg-background">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-indigo-100/60 to-transparent dark:from-indigo-950/40"
        />

        <div className="relative mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
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

          <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-xl">
            <CheckCircle2 className="mx-auto size-16 text-green-500" />

            <h1 className="mt-5 text-3xl font-semibold">
              Quiz Completed!
            </h1>

            <p className="mt-2 text-muted-foreground">
              Your AI-generated quiz has been completed.
            </p>

            <div className="mt-4 text-sm text-muted-foreground">
              {subject} • {difficulty}
            </div>

            <div className="mx-auto mt-8 flex size-36 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-950">
              <div className="text-center">
                <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                  {finalScore}/{questions.length}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {percentage}% Score
                </p>
              </div>
            </div>

            <p className="mt-6 text-lg font-medium">
              {percentage >= 80
                ? 'Excellent work! 🔥'
                : percentage >= 60
                  ? 'Good job! Keep improving. 💪'
                  : 'Keep practicing. You can do better! 📚'}
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={generateQuiz}
                className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-indigo-700"
              >
                Generate New Quiz
              </button>

              <button
                type="button"
                onClick={restartQuiz}
                className="rounded-xl border border-border px-6 py-3 text-sm font-medium transition hover:bg-accent"
              >
                Change Subject
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  /*
   * --------------------------------------------------
   * QUIZ SCREEN
   * --------------------------------------------------
   */

  if (quizStarted && questions.length > 0) {
    const question = questions[currentQuestion]

    return (
      <main className="relative min-h-dvh overflow-hidden bg-background">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-indigo-100/60 to-transparent dark:from-indigo-950/40"
        />

        <div className="relative mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
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

          <div className="mb-6">
            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
              AI-Powered Assessment
            </p>

            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              {subject} Quiz
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Difficulty: {difficulty} • 15 AI-generated questions
            </p>
          </div>

          <div className="mb-6 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all"
              style={{
                width: `${
                  ((currentQuestion + 1) /
                    questions.length) *
                  100
                }%`,
              }}
            />
          </div>

          <div className="mb-4 flex justify-between text-sm text-muted-foreground">
            <span>
              Question {currentQuestion + 1} of{' '}
              {questions.length}
            </span>

            <span>
              Score: {score}
            </span>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-8">
            <h2 className="text-xl font-semibold leading-relaxed">
              {question.question}
            </h2>

            <div className="mt-6 space-y-3">
              {question.options.map((option) => {
                const selected =
                  selectedAnswer === option

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      setSelectedAnswer(option)
                    }
                    className={`w-full rounded-xl border p-4 text-left text-sm transition ${
                      selected
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-950 dark:text-indigo-300'
                        : 'border-border hover:bg-accent'
                    }`}
                  >
                    {option}
                  </button>
                )
              })}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-indigo-700"
              >
                {currentQuestion ===
                questions.length - 1
                  ? 'Submit Quiz'
                  : 'Next Question'}
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  /*
   * --------------------------------------------------
   * AI QUIZ GENERATOR SCREEN
   * --------------------------------------------------
   */

  return (
    <main className="relative min-h-dvh overflow-hidden bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-indigo-100/60 to-transparent dark:from-indigo-950/40"
      />

      <div className="relative mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
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

        <div className="mb-6">
          <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
            AI-Powered Assessment
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            AI Quiz Generator
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Generate a fresh set of exactly 15 questions
            using artificial intelligence.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-8">
          <div className="mb-6 flex items-center gap-3 rounded-xl bg-indigo-50 p-4 dark:bg-indigo-950">
            <Sparkles className="size-5 text-indigo-600 dark:text-indigo-400" />

            <div>
              <p className="font-medium">
                AI-Powered Quiz
              </p>

              <p className="text-sm text-muted-foreground">
                Every attempt generates 15 fresh questions.
              </p>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Select Subject
            </label>

            <select
              value={subject}
              onChange={(e) =>
                setSubject(e.target.value)
              }
              disabled={loading}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-indigo-500"
            >
              <option value="DBMS">
                DBMS
              </option>

              <option value="Java">
                Java
              </option>

              <option value="Operating Systems">
                Operating Systems
              </option>

              <option value="Data Structures">
                Data Structures
              </option>

              <option value="Computer Organization">
                Computer Organization
              </option>

              <option value="C++">
                C++
              </option>

              <option value="Computer Networks">
                Computer Networks
              </option>

              <option value="Cloud Computing">
                Cloud Computing
              </option>

              <option value="Machine Learning">
                Machine Learning
              </option>

              <option value="Artificial Intelligence">
                Artificial Intelligence
              </option>
            </select>
          </div>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-medium">
              Difficulty
            </label>

            <div className="grid grid-cols-3 gap-3">
              {['Easy', 'Medium', 'Hard'].map(
                (level) => (
                  <button
                    key={level}
                    type="button"
                    disabled={loading}
                    onClick={() =>
                      setDifficulty(level)
                    }
                    className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                      difficulty === level
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-950 dark:text-indigo-300'
                        : 'border-border hover:bg-accent'
                    }`}
                  >
                    {level}
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-border bg-muted/30 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Questions per quiz
              </span>

              <span className="font-semibold">
                15
              </span>
            </div>
          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={generateQuiz}
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Generating 15 Questions...
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                Generate AI Quiz
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  )
}