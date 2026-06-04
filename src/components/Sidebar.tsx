import { NavLink, useLocation } from "react-router-dom"
import {
  LayoutDashboard, Boxes, GitBranch, Workflow, Shield,
  Server, Activity, Users, Settings, BookOpen, ChevronDown,
  Zap, Bell, Search, LogOut, HelpCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface NavItem {
  label: string
  to: string
  icon: React.ElementType
  badge?: string
  badgeVariant?: "success" | "warning" | "info"
}

interface NavGroup {
  heading: string
  items: NavItem[]
}

const navigation: NavGroup[] = [
  {
    heading: "Platform",
    items: [
      { label: "Dashboard", to: "/", icon: LayoutDashboard },
      { label: "Service Catalog", to: "/catalog", icon: Boxes },
      { label: "Deployments", to: "/deployments", icon: GitBranch, badge: "3", badgeVariant: "warning" },
      { label: "Pipelines", to: "/pipelines", icon: Workflow },
    ],
  },
  {
    heading: "Infrastructure",
    items: [
      { label: "Clusters", to: "/clusters", icon: Server },
      { label: "Secrets & Config", to: "/secrets", icon: Shield },
      { label: "Monitoring", to: "/monitoring", icon: Activity, badge: "2", badgeVariant: "info" },
    ],
  },
  {
    heading: "Organization",
    items: [
      { label: "Teams", to: "/teams", icon: Users },
      { label: "Documentation", to: "/docs", icon: BookOpen },
      { label: "Settings", to: "/settings", icon: Settings },
    ],
  },
]

export function Sidebar() {
  const location = useLocation()
  const [projectOpen, setProjectOpen] = useState(true)

  return (
    <aside className="flex flex-col h-full w-60 flex-shrink-0" style={{ background: "hsl(var(--sidebar))", borderRight: "1px solid hsl(var(--sidebar-border))" }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b" style={{ borderColor: "hsl(var(--sidebar-border))" }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-glow-sm" style={{ background: "var(--gradient-primary)" }}>
          <Zap className="w-4 h-4" style={{ color: "hsl(var(--primary-foreground))" }} />
        </div>
        <div>
          <p className="text-sm font-bold tracking-tight" style={{ color: "hsl(var(--foreground))" }}>NexusIDP</p>
          <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>Enterprise Platform</p>
        </div>
      </div>

      {/* Project selector */}
      <div className="px-3 py-3 border-b" style={{ borderColor: "hsl(var(--sidebar-border))" }}>
        <button
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors duration-200 group"
          style={{ background: "hsl(var(--sidebar-item))", color: "hsl(var(--foreground))" }}
          onClick={() => setProjectOpen(!projectOpen)}
        >
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold" style={{ background: "hsl(var(--primary) / 0.2)", color: "hsl(var(--primary-glow))" }}>P</div>
            <span className="font-medium">Production</span>
          </div>
          <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", projectOpen && "rotate-180")} style={{ color: "hsl(var(--muted-foreground))" }} />
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-2.5 border-b" style={{ borderColor: "hsl(var(--sidebar-border))" }}>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "hsl(var(--sidebar-item))", border: "1px solid hsl(var(--sidebar-border))" }}>
          <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "hsl(var(--muted-foreground))" }} />
          <span className="text-xs flex-1" style={{ color: "hsl(var(--muted-foreground))" }}>Search... ⌘K</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
        {navigation.map((group) => (
          <div key={group.heading}>
            <p className="section-title px-3 mb-1.5">{group.heading}</p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = location.pathname === item.to
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={cn("nav-item", isActive && "active")}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <span className={cn(
                        "flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold",
                        item.badgeVariant === "warning" && "bg-warning/15 text-warning",
                        item.badgeVariant === "info" && "bg-info/15 text-info",
                        item.badgeVariant === "success" && "bg-success/15 text-success",
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom user section */}
      <div className="px-3 py-3 border-t space-y-0.5" style={{ borderColor: "hsl(var(--sidebar-border))" }}>
        <NavLink to="/docs" className="nav-item">
          <HelpCircle className="w-4 h-4" />
          <span className="flex-1">Help & Support</span>
        </NavLink>
        <div className="flex items-center gap-3 px-3 py-2 mt-1 rounded-lg cursor-pointer transition-colors"
          style={{ color: "hsl(var(--muted-foreground))" }}
          onMouseEnter={e => (e.currentTarget.style.background = "hsl(var(--sidebar-item))")}
          onMouseLeave={e => (e.currentTarget.style.background = "")}
        >
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "var(--gradient-primary)", color: "hsl(var(--primary-foreground))" }}>SV</div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate" style={{ color: "hsl(var(--foreground))" }}>Shakthi Vinayak</p>
            <p className="text-xs truncate" style={{ color: "hsl(var(--muted-foreground))" }}>Platform Admin</p>
          </div>
          <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
        </div>
      </div>
    </aside>
  )
}
