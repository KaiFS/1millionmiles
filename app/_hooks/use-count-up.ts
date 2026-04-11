import { useEffect, useRef, useState } from 'react'

export function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0)
  const startRef = useRef<number | null>(null)
  const frameRef = useRef<number | null>(null)
  const prevTarget = useRef(0)

  useEffect(() => {
    if (target === 0) return

    const start = prevTarget.current
    startRef.current = null

    const animate = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp

      const progress = Math.min((timestamp - startRef.current) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(start + eased * (target - start)))

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
        return
      }

      prevTarget.current = target
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [target, duration])

  return count
}
