'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  GraduationCap,
  Mail,
  User,
  Hash,
  LogOut,
  Cloud,
} from 'lucide-react'

import {
  getUser,
  isLoggedIn,
  logoutUser,
  type CloudLearnUser,
} from '@/lib/auth'
export default function ProfilePage() {
  const [user, setUser] = useState<CloudLearnUser | null>(null)

 useEffect(() => {
  if (!isLoggedIn()) {
    window.location.href = '/login'
    return
  }

  const currentUser = getUser()

  if (!currentUser) {
    window.location.href = '/login'
    return
  }

  setUser(currentUser)
}, [])

  if (!user) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">
          Loading profile...
        </p>
      </main>
    )
  }

  const initial = user.name.charAt(0).toUpperCase()

  return (
    <main className="relative min-h-dvh overflow-hidden bg-background">
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-indigo-100/60 to-transparent dark:from-indigo-950/40"
      />

      <div className="relative mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Top navigation */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-slate-800 text-white shadow-md shadow-indigo-500/20 dark:to-indigo-900">
              <Cloud className="size-4" />
            </span>

            <span className="hidden text-sm font-semibold sm:inline">
              CloudLearn AI
            </span>
          </div>
        </div>

        {/* Profile heading */}
        <div className="mb-8">
          <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
            Student Account
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            View your CloudLearn AI account and academic information.
          </p>
        </div>

        {/* Profile card */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card/90 shadow-xl backdrop-blur-xl">
          {/* Profile header */}
          <div className="border-b border-border bg-gradient-to-r from-indigo-500/10 to-transparent p-6 sm:p-8">
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-2xl font-bold text-white shadow-lg shadow-indigo-500/20">
                {initial}
              </div>

              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-semibold">
                  {user.name}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Student
                </p>

                <div className="mt-2 inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-300">
                  Active Account
                </div>
              </div>
            </div>
          </div>

          {/* Account information */}
          <div className="p-6 sm:p-8">
            <h3 className="mb-5 text-lg font-semibold">
              Account Information
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Full name */}
              <div className="rounded-xl border border-border bg-background/60 p-4">
                <div className="mb-3 flex items-center gap-2 text-muted-foreground">
                  <User className="size-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">
                    Full Name
                  </span>
                </div>

                <p className="font-medium">
                  {user.name}
                </p>
              </div>

              {/* Register number */}
              <div className="rounded-xl border border-border bg-background/60 p-4">
                <div className="mb-3 flex items-center gap-2 text-muted-foreground">
                  <Hash className="size-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">
                    College Register Number
                  </span>
                </div>

                <p className="font-medium">
                  {user.registerNumber}
                </p>
              </div>

              {/* Email */}
              <div className="rounded-xl border border-border bg-background/60 p-4 sm:col-span-2">
                <div className="mb-3 flex items-center gap-2 text-muted-foreground">
                  <Mail className="size-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">
                    Email Address
                  </span>
                </div>

                <p className="font-medium break-all">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Academic status */}
            <div className="mt-8">
              <h3 className="mb-5 text-lg font-semibold">
                Academic Profile
              </h3>

              <div className="rounded-xl border border-border bg-background/60 p-5">
                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
                    <GraduationCap className="size-5" />
                  </div>

                  <div>
                    <p className="font-medium">
                      Student Account
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Your academic information will be connected to
                      CloudLearn AI features as the platform develops.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sign out */}
            <div className="mt-8 border-t border-border pt-6">
              <button
                type="button"
                onClick={() => {
                  logoutUser()
                  window.location.href = '/login'
                }}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-destructive/30 px-4 text-sm font-medium text-destructive transition hover:bg-destructive/10"
              >
                <LogOut className="size-4" />
                Sign out
              </button>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          CloudLearn AI · AI-Powered Cloud Learning Platform
        </p>
      </div>
    </main>
  )
}