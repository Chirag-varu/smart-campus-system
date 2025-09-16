"use client"

import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface ButtonSpinnerProps {
  text?: string
}

export function ButtonSpinner({ text = "Loading..." }: ButtonSpinnerProps) {
  return (
    <span className="flex items-center justify-center">
      <LoadingSpinner size="sm" className="mr-2" />
      {text}
    </span>
  )
}