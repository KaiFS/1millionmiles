'use client'

import { useEffect, useState } from 'react'

type ProgressRingProps = {
  percent: number
  size?: number
  stroke?: number
}

export default function ProgressRing({
  percent,
  size = 140,
  stroke = 12,
}: ProgressRingProps) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const [offset, setOffset] = useState(circumference)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setOffset(circumference - (percent / 100) * circumference)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [percent, circumference])

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#ED8B00"
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1.8s cubic-bezier(0.4,0,0.2,1)' }}
      />
    </svg>
  )
}
