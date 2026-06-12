'use client'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { useEffect, useRef } from 'react'

interface MathRendererProps {
  latex: string
  displayMode?: boolean
  className?: string
}

export function MathRenderer({ latex, displayMode = false, className }: MathRendererProps) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (ref.current) {
      try {
        katex.render(latex, ref.current, { displayMode, throwOnError: false })
      } catch {
        if (ref.current) ref.current.textContent = latex
      }
    }
  }, [latex, displayMode])
  return <span ref={ref} className={className} />
}

export function parseMathContent(text: string): { type: 'text'|'math'|'display_math', content: string }[] {
  const parts: { type: 'text'|'math'|'display_math', content: string }[] = []
  const regex = /\$\$([^$]+)\$\$|\$([^$]+)\$/g
  let lastIndex = 0
  let match: RegExpExecArray | null
  
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) })
    }
    if (match[1] !== undefined) {
      parts.push({ type: 'display_math', content: match[1] })
    } else if (match[2] !== undefined) {
      parts.push({ type: 'math', content: match[2] })
    }
    lastIndex = match.index + match[0].length
  }
  
  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) })
  }
  return parts
}