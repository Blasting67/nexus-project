import { createElement, useLayoutEffect, useRef } from 'react'
import type { ElementType, ReactNode } from 'react'

interface FitTextProps {
  as?: ElementType
  className?: string
  minSize?: number
  children: ReactNode
}

const FitText = ({ as = 'div', className = '', minSize = 12, children }: FitTextProps) => {
  const ref = useRef<HTMLElement | null>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    let frame = 0
    const overflows = () => {
      const range = document.createRange()
      range.selectNodeContents(el)
      const text = range.getBoundingClientRect()
      const box = el.getBoundingClientRect()
      const style = getComputedStyle(el)
      const left = box.left + parseFloat(style.borderLeftWidth) + parseFloat(style.paddingLeft)
      const right = box.right - parseFloat(style.borderRightWidth) - parseFloat(style.paddingRight)
      return text.right > right + 0.5 || text.left < left - 0.5
    }
    const fit = () => {
      el.style.fontSize = ''
      el.style.overflowWrap = ''
      const available = el.getBoundingClientRect().width
      if (!available) return
      const previousWidth = el.style.width
      el.style.width = `${available}px`
      el.style.overflowWrap = 'normal'
      let size = parseFloat(getComputedStyle(el).fontSize)
      let guard = 0
      while (overflows() && size > minSize && guard < 40) {
        size = Math.max(minSize, size * 0.94)
        el.style.fontSize = `${size}px`
        guard += 1
      }
      const fits = !overflows()
      el.style.width = previousWidth
      el.style.overflowWrap = fits ? 'normal' : 'anywhere'
    }
    fit()
    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(fit)
    }
    const observer = new ResizeObserver(schedule)
    if (el.parentElement) observer.observe(el.parentElement)
    document.fonts?.ready.then(schedule)
    document.fonts?.addEventListener?.('loadingdone', schedule)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      document.fonts?.removeEventListener?.('loadingdone', schedule)
    }
  }, [children, className, minSize])

  return createElement(as, { ref, className }, children)
}

export default FitText
