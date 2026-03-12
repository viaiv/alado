import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, ...props }, ref) => {
    const clamped = Math.min(100, Math.max(0, value))
    return (
      <div
        ref={ref}
        className={cn("relative h-2 w-full overflow-hidden rounded-full bg-secondary", className)}
        {...props}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber to-amber-dim transition-all duration-500 ease-out animate-progress-glow"
          style={{ width: `${clamped}%` }}
        />
        {clamped > 0 && clamped < 100 && (
          <div
            className="absolute top-0 h-full w-8 rounded-full bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer"
            style={{ backgroundSize: "200% 100%" }}
          />
        )}
      </div>
    )
  }
)
Progress.displayName = "Progress"

export { Progress }
