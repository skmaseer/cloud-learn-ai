'use client'

import { useEffect, useState } from 'react'
import { MotionProvider } from '@/components/motion-provider'
import { isLoggedIn } from '@/lib/auth'
import { Header } from '@/components/dashboard/header'
import { PerformanceWidget } from '@/components/dashboard/performance-widget'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { WelcomeBanner } from '@/components/dashboard/welcome-banner'

export default function Page() {
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    const loggedIn = isLoggedIn()

    if (!loggedIn) {
      window.location.href = '/login'
      return
    }

    setAuthenticated(true)
    setCheckingAuth(false)
  }, [])

  if (checkingAuth || !authenticated) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">
          Loading CloudLearn AI...
        </p>
      </div>
    )
  }

  return (
    <MotionProvider>
      <div className="relative min-h-dvh bg-background">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-indigo-100/60 to-transparent dark:from-indigo-950/40"
        />

        <Header />

        <main className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <WelcomeBanner />
          <QuickActions />
          <PerformanceWidget />
        </main>
      </div>
    </MotionProvider>
  )
}