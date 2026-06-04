import * as React from "react"
import { cn } from "@/lib/utils"

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "warning" | "destructive" | "info" | "neutral" | "primary"
}

function Badge({ className, variant = "neutral", children, ...props }: BadgeProps) {
  const variantClass = {
    success: "badge-success",
    warning: "badge-warning",
    destructive: "badge-destructive",
    info: "badge-info",
    neutral: "badge-neutral",
    primary: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary-glow border border-primary/20",
  }[variant]
  return (
    <span className={cn(variantClass, className)} {...props}>
      {children}
    </span>
  )
}

export { Badge }
