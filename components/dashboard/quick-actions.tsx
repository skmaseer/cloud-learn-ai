'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowUpRight,
  BookOpen,
  Bot,
  ClipboardCheck,
  type LucideIcon,
} from 'lucide-react'

type QuickAction = {
  id: string
  title: string
  description: string
  meta: string
  cta: string
  icon: LucideIcon
  iconClass: string
  href?: string
  shortcuts?: string[]
}

const actions: QuickAction[] = [
  {
    id: 'materials',
    title: 'Materials',
    description:
      'Access course notes, PDFs, and recorded lectures in one place.',
    meta: 'Study resources',
    cta: 'Browse materials',
    icon: BookOpen,
    iconClass: 'from-indigo-500 to-indigo-700',
    href: '/materials',
  },
  {
    id: 'ai-tutor',
    title: 'AI Tutor',
    description:
      'Interactive 24/7 AI learning assistant that explains, quizzes, and guides.',
    meta: 'Online now',
    cta: 'Start a session',
    icon: Bot,
    iconClass: 'from-teal-500 to-cyan-700',
    shortcuts: [
      'Explain normalization',
      'Summarize Unit 3',
      'Practice SQL joins',
    ],
  },
  {
    id: 'quiz',
    title: 'Quiz',
    description:
      'Adaptive practice assessments and flashcards tuned to your weak spots.',
    meta: 'AI generated',
    cta: 'Take a quiz',
    icon: ClipboardCheck,
    iconClass: 'from-slate-600 to-slate-900',
    href: '/quiz',
  },
]

export function QuickActions() {
  return (
    <section
      aria-labelledby="quick-actions-heading"
      className="flex flex-col gap-4"
    >
      <h2
        id="quick-actions-heading"
        className="text-lg font-semibold tracking-tight"
      >
        Quick actions
      </h2>

      <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {actions.map((action, index) => (
          <motion.li
            key={action.id}
            id={action.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: 0.1 + index * 0.08,
              ease: 'easeOut',
            }}
            whileHover={{ y: -4, scale: 1.015 }}
            className="group relative flex scroll-mt-24 flex-col gap-4 rounded-xl border border-slate-200 bg-white/60 p-5 shadow-sm backdrop-blur-xl transition-[border-color,box-shadow] duration-300 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/10 dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-indigo-400/50"
          >
            <div className="flex items-start justify-between">
              <span
                className={`flex size-11 items-center justify-center rounded-xl bg-gradient-to-br ${action.iconClass} text-white shadow-md`}
              >
                <action.icon className="size-5" aria-hidden="true" />
              </span>

              <span className="text-xs font-medium text-muted-foreground">
                {action.meta}
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <h3 className="text-base font-semibold">{action.title}</h3>

              <p className="text-sm leading-relaxed text-muted-foreground">
                {action.description}
              </p>
            </div>

            {action.shortcuts && (
              <div
                className="flex flex-wrap gap-1.5"
                role="group"
                aria-label="AI Tutor prompt shortcuts"
              >
                {action.shortcuts.map((shortcut) => (
                  <button
                    key={shortcut}
                    type="button"
                    className="rounded-full border border-border bg-background/70 px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    {shortcut}
                  </button>
                ))}
              </div>
            )}

            {action.href ? (
              <Link
                href={action.href}
                className="mt-auto inline-flex w-fit items-center gap-1 rounded-md text-sm font-semibold text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {action.cta}

                <ArrowUpRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </Link>
            ) : (
              <button
                type="button"
                className="mt-auto inline-flex w-fit items-center gap-1 rounded-md text-sm font-semibold text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {action.cta}

                <ArrowUpRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </button>
            )}
          </motion.li>
        ))}
      </ul>
    </section>
  )
}