"use client"

import { LoadingSpinner } from "./loading-spinner"
import { cn } from "@/lib/utils"

interface LoadingStateProps {
  fullScreen?: boolean
  text?: string
  className?: string
  spinnerSize?: "sm" | "md" | "lg"
}

export function LoadingState({ 
  fullScreen = false, 
  text = "Loading...", 
  className,
  spinnerSize = "md" 
}: LoadingStateProps) {
  const containerClasses = fullScreen 
    ? "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    : "flex flex-col items-center justify-center p-8"
  
  return (
    <div className={cn(containerClasses, className)}>
      <div className="flex flex-col items-center space-y-4">
        <LoadingSpinner size={spinnerSize} className="text-primary" />
        {text && <p className="text-center text-sm font-medium text-muted-foreground">{text}</p>}
      </div>
    </div>
  )
}