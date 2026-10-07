'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'

export function WelcomeBanner() {
  return (
    <motion.section
      aria-labelledby="welcome-heading"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 px-6 py-10 text-white shadow-xl shadow-indigo-900/20 sm:px-10 sm:py-12"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.15] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-16 size-72 rounded-full bg-indigo-400/30 blur-3xl"
      />

      <div className="relative flex max-w-2xl flex-col gap-5">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
          <Sparkles className="size-3.5" aria-hidden="true" />
          Good to see you again, Masheer
        </span>
        <div className="flex flex-col gap-2">
          <h1 id="welcome-heading" className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Welcome to CloudLearn AI
          </h1>
          <p className="text-base text-pretty text-indigo-100 sm:text-lg">
            Your intelligent cloud-based learning partner
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href="#materials"
            className="group inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-indigo-700 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Continue learning
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </a>
          <a
            href="#ai-tutor"
            className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold backdrop-blur transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Ask AI Tutor
          </a>
        </div>
      </div>
    </motion.section>
  )
}
