'use client'

import { motion } from 'framer-motion'

const SIZE = 64
const STROKE = 7
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function ScoreRing({ value }: { value: number }) {
  return (
    <div
      role="progressbar"
      aria-label="Average score"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      className="relative shrink-0"
      style={{ width: SIZE, height: SIZE }}
    >
      <svg width={SIZE} height={SIZE} className="-rotate-90" aria-hidden="true">
        <defs>
          <linearGradient id="score-ring-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
        </defs>
        <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" strokeWidth={STROKE} className="stroke-muted" />
        <motion.circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="url(#score-ring-gradient)"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          initial={{ strokeDashoffset: CIRCUMFERENCE }}
          animate={{ strokeDashoffset: CIRCUMFERENCE * (1 - value / 100) }}
          transition={{ duration: 1.1, delay: 0.4, ease: 'easeOut' }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold tabular-nums" aria-hidden="true">
        {value}
      </span>
    </div>
  )
}
