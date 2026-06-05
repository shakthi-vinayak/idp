import { useState } from "react"
import { TopBar } from "@/components/TopBar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LoadingState, ErrorState } from "@/components/LoadingErrorStates"
import { useServices } from "@/hooks/useApi"
import type { Service } from "@/lib/api"
import { Search, ExternalLink, GitBranch, Users, Clock, Star, Filter } from "lucide-react"

const typeColors: Record<string, string> = {
  api: "info", worker: "neutral", frontend: "primary", database: "warning", ml: "success",
}

const langIcons: Record<string, string> = {
  Go: "🐹", "Node.js": "🟢", Java: "☕", Python: "🐍", React: "⚛️", PostgreSQL: "🐘", "Cloudflare Workers": "🔥",
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <Card className="hover:shadow-card-hover transition-all duration-200 cursor-pointer group">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {service.starred && <Star className="w-3 h-3 flex-shrink-0" style={{ color: "hsl(var(--warning))", fill: "hsl(var(--warning))" }} />}
              <span className="font-mono text-sm font-semibold truncate" style={{ color: "hsl(var(--foreground))" }}>{service.name}</span>
            </div>
            <p className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{service.description}</p>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <Badge variant={service.status === "healthy" ? "success" : service.status === "degraded" ? "warning" : "destructive"}>
              {service.status}
            </Badge>
            <Badge variant={(typeColors[service.type] || "neutral") as "info" | "neutral" | "primary" | "warning" | "success"}>
              {service.type}
            </Badge>
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          {service.tags.map(tag => (<span key={tag} className="code-text">{tag}</span>))}
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
          <div className="flex items-center gap-1.5"><span>{langIcons[service.language] || "🔧"}</span><span>{service.language}</span></div>
          <div className="flex items-center gap-1.5"><Users className="w-3 h-3" /><span>{service.team}</span></div>
          <div className="flex items-center gap-1.5"><GitBranch className="w-3 h-3" /><span>{service.version}</span></div>
          <div className="flex items-center gap-1.5"><Clock className="w-3 h-3" /><span>{service.lastDeploy}</span></div>
        </div>
        <div className="flex items-center justify-between pt-1 border-t" style={{ borderColor: "hsl(var(--border))" }}>
          <div className="flex items-center gap-2 text-xs">
            <span style={{ color: "hsl(var(--success))" }}>{service.uptime} uptime</span>
            <span style={{ color: "hsl(var(--muted-foreground))" }}>·</span>
            <span style={{ color: "hsl(var(--muted-foreground))" }}>{service.replicas} replicas</span>
          </div>
          <button className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "hsl(var(--primary))" }}>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

export function CatalogPage() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<string>("all")
  const [starredFilter, setStarredFilter] = useState(false)

  const { data: services = [], isLoading, isError, error, refetch } = useServices()

  const filtered = services.filter(s => {
    const matchSearch = s.name.includes(search.toLowerCase()) || s.team.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === "all" || s.type === filter
    const matchStarred = !starredFilter || s.starred
    return matchSearch && matchFilter && matchStarred
  })

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Service Catalog" description={`${services.length} services registered across all teams`} action={{ label: "Register Service", onClick: () => {} }} />
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        <div className="relative rounded-xl overflow-hidden h-32" style={{ border: "1px solid hsl(var(--border))" }}>
          <img src="/images/service-catalog.png" alt="Service catalog" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 flex items-center px-6" style={{ background: "linear-gradient(90deg, hsl(var(--card)) 30%, transparent)" }}>
            <div>
              <h2 className="text-lg font-bold" style={{ color: "hsl(var(--foreground))" }}>Service Catalog</h2>
              <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>Discover, explore, and manage all microservices with full ownership metadata</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "hsl(var(--muted-foreground))" }} />
            <Input placeholder="Search services, teams, tags..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex items-center gap-1.5">
            {["all", "api", "worker", "frontend", "database", "ml"].map(f => (
              <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)} className="capitalize">{f}</Button>
            ))}
          </div>
          <Button variant={starredFilter ? "gradient" : "outline"} size="sm" onClick={() => setStarredFilter(v => !v)}>
            <Star className="w-3.5 h-3.5 mr-1" />Starred
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Healthy", value: services.filter(s => s.status === "healthy").length, color: "hsl(var(--success))" },
            { label: "Degraded", value: services.filter(s => s.status === "degraded").length, color: "hsl(var(--warning))" },
            { label: "Down", value: services.filter(s => s.status === "down").length, color: "hsl(var(--destructive))" },
            { label: "Total", value: services.length, color: "hsl(var(--primary))" },
          ].map(s => (
            <div key={s.label} className="panel px-4 py-3 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
              <span className="text-sm font-semibold" style={{ color: "hsl(var(--foreground))" }}>{s.value}</span>
              <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{s.label}</span>
            </div>
          ))}
        </div>

        {isLoading && <LoadingState />}
        {isError && <ErrorState message={error?.message || "Unknown error"} onRetry={() => refetch()} />}

        {!isLoading && !isError && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {filtered.map(service => (<ServiceCard key={service.id} service={service} />))}
          </div>
        )}
        {!isLoading && !isError && filtered.length === 0 && (
          <div className="text-center py-16" style={{ color: "hsl(var(--muted-foreground))" }}>
            <Filter className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No services match your filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
