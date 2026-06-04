import { Bell, Plus, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TopBarProps {
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function TopBar({ title, description, action }: TopBarProps) {
  return (
    <div
      className="flex items-center justify-between px-6 py-3.5 border-b flex-shrink-0"
      style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
    >
      <div>
        <h1 className="text-base font-semibold" style={{ color: "hsl(var(--foreground))" }}>{title}</h1>
        {description && (
          <p className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{description}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon-sm" title="Refresh">
          <RefreshCw className="w-3.5 h-3.5" />
        </Button>
        <div className="relative">
          <Button variant="ghost" size="icon-sm" title="Notifications">
            <Bell className="w-3.5 h-3.5" />
          </Button>
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-warning" />
        </div>
        {action && (
          <Button variant="gradient" size="sm" onClick={action.onClick} className="gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            {action.label}
          </Button>
        )}
      </div>
    </div>
  )
}
