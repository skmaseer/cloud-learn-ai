'use client'

import Link from 'next/link'
import { Cloud, Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useState } from 'react'
import { loginUser } from '@/lib/auth'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
function handleLogin(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault()

  if (!email || !password) {
    alert('Please enter your email and password.')
    return
  }

  const success = loginUser(email, password)

  if (!success) {
    alert('Invalid email or password.')
    return
  }

  window.location.href = '/'
}

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-background px-4 py-8">
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-indigo-100/60 to-transparent dark:from-indigo-950/40"
      />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-slate-800 text-white shadow-lg shadow-indigo-500/25 dark:to-indigo-900">
              <Cloud className="size-6" />
            </span>

            <span className="bg-gradient-to-r from-indigo-600 to-slate-700 bg-clip-text text-2xl font-semibold tracking-tight text-transparent dark:from-indigo-300 dark:to-slate-200">
              CloudLearn AI
            </span>
          </Link>

          <p className="mt-3 text-sm text-muted-foreground">
            Your AI-powered learning assistant
          </p>
        </div>

        {/* Login card */}
        <div className="rounded-2xl border border-border bg-card/90 p-6 shadow-xl backdrop-blur-xl sm:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Sign in to continue learning with CloudLearn AI.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium"
              >
                Email
              </label>

              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="h-11 w-full rounded-lg border border-border bg-background pl-10 pr-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium"
              >
                Password
              </label>

              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />

                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="h-11 w-full rounded-lg border border-border bg-background pl-10 pr-11 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Login button */}
            <button
              type="submit"
              className="h-11 w-full rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition hover:from-indigo-500 hover:to-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Sign in
            </button>
          </form>

          {/* Register */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link
              href="/register"
              className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Create account
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          CloudLearn AI · AI-Powered Cloud Learning Platform
        </p>
      </div>
    </main>
  )
}