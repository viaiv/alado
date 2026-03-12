import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-mono font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-amber/30 bg-amber/10 text-amber",
        secondary: "border-border bg-secondary text-secondary-foreground",
        destructive: "border-destructive/30 bg-destructive/10 text-destructive",
        outline: "text-foreground border-border",
        success: "border-success/30 bg-success/10 text-success",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
