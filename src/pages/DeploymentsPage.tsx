import React, { useState } from "react"
import { TopBar } from "@/components/TopBar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Search, GitBranch, RefreshCw, CheckCircle2, XCircle, Clock, AlertTriangle, ChevronDown, ChevronRight, ArrowUpRight } from "lucide-react"

interface Deployment {
  id: string
  service: string
  version: string
  environment: "production" | "staging" | "development"
  status: "running" | "succeeded" | "failed" | "pending" | "rolling"
  triggeredBy: string
  branch: string
  commit: string
  startedAt: string
  duration: string
  replicas: string
  image: string
}

const deployments: Deployment[] = [
  { id: "d-1", service: "payment-service", version: "v2.4.1", environment: "production", status: "succeeded", triggeredBy: "CI/CD", branch: "main", commit: "a3f8c12", startedAt: "2m ago", duration: "3m 12s", replicas: "3/3", image: "registry.io/payment:v2.4.1" },
  { id: "d-2", service: "api-gateway", version: "v3.2.2-rc1", environment: "staging", status: "rolling", triggeredBy: "PR #502", branch: "feat/rate-limit", commit: "7e9b2a1", startedAt: "5m ago", duration: "~2m", replicas: "4/6", image: "registry.io/api-gw:v3.2.2-rc1" },
  { id: "d-3", service: "order-service", version: "v3.0.0-rc1", environment: "production", status: "failed", triggeredBy: "CI/CD", branch: "main", commit: "c1d4f89", startedAt: "15m ago", duration: "1m 44s", replicas: "0/3", image: "registry.io/orders:v3.0.0-rc1" },
  { id: "d-4", service: "web-app", version: "v5.1.0", environment: "production", status: "succeeded", triggeredBy: "shakthi.v", branch: "main", commit: "b8a2e3f", startedAt: "30m ago", duration: "2m 58s", replicas: "3/3", image: "registry.io/webapp:v5.1.0" },
  { id: "d-5", service: "user-service", version: "v1.9.0", environment: "production", status: "succeeded", triggeredBy: "CI/CD", branch: "main", commit: "d5f7c91", startedAt: "3h ago", duration: "4m 2s", replicas: "4/4", image: "registry.io/users:v1.9.0" },
  { id: "d-6", service: "auth-service", version: "v2.8.5-beta", environment: "staging", status: "pending", triggeredBy: "PR #498", branch: "fix/token-refresh", commit: "e2a9b3c", startedAt: "just now", duration: "—", replicas: "0/3", image: "registry.io/auth:v2.8.5-beta" },
  { id: "d-7", service: "search-service", version: "v2.1.0", environment: "production", status: "succeeded", triggeredBy: "CI/CD", branch: "main", commit: "f1b3d4a", startedAt: "1h ago", duration: "3m 35s", replicas: "3/3", image: "registry.io/search:v2.1.0" },
  { id: "d-8", service: "notification-svc", version: "v1.4.2", environment: "development", status: "succeeded", triggeredBy: "dev.user", branch: "dev", commit: "9c5e2f1", startedAt: "6h ago", duration: "1m 22s", replicas: "1/1", image: "registry.io/notifs:v1.4.2" },
]

const envColors = { production: "destructive", staging: "warning", development: "info" } as const

function StatusIcon({ status }: { status: Deployment["status"] }) {
  if (status === "succeeded") return <CheckCircle2 className="w-4 h-4" style={{ color: "hsl(var(--success))" }} />
  if (status === "failed") return <XCircle className="w-4 h-4" style={{ color: "hsl(var(--destructive))" }} />
  if (status === "pending") return <Clock className="w-4 h-4 animate-blink" style={{ color: "hsl(var(--muted-foreground))" }} />
  if (status === "rolling") return <RefreshCw className="w-4 h-4 animate-spin" style={{ color: "hsl(var(--info))" }} />
  if (status === "running") return <RefreshCw className="w-4 h-4 animate-spin" style={{ color: "hsl(var(--primary))" }} />
  return <AlertTriangle className="w-4 h-4" style={{ color: "hsl(var(--warning))" }} />
}

const statusVariant = { succeeded: "success", failed: "destructive", pending: "neutral", rolling: "info", running: "info" } as const

export function DeploymentsPage() {
  const [search, setSearch] = useState("")
  const [envFilter, setEnvFilter] = useState<string>("all")
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = deployments.filter(d => {
    const matchSearch = d.service.includes(search.toLowerCase()) || d.version.includes(search)
    const matchEnv = envFilter === "all" || d.environment === envFilter
    return matchSearch && matchEnv
  })

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Deployments" description="GitOps-driven continuous delivery across all environments" action={{ label: "New Deployment", onClick: () => {} }} />
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Running / Rolling", value: deployments.filter(d => ["running", "rolling"].includes(d.status)).length, color: "hsl(var(--info))", icon: RefreshCw },
            { label: "Succeeded (24h)", value: deployments.filter(d => d.status === "succeeded").length, color: "hsl(var(--success))", icon: CheckCircle2 },
            { label: "Failed (24h)", value: deployments.filter(d => d.status === "failed").length, color: "hsl(var(--destructive))", icon: XCircle },
            { label: "Pending", value: deployments.filter(d => d.status === "pending").length, color: "hsl(var(--muted-foreground))", icon: Clock },
          ].map(s => (
            <div key={s.label} className="panel px-4 py-3.5 flex items-center gap-3">
              <s.icon className="w-5 h-5 flex-shrink-0" style={{ color: s.color }} />
              <div>
                <p className="text-xl font-bold" style={{ color: "hsl(var(--foreground))" }}>{s.value}</p>
                <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "hsl(var(--muted-foreground))" }} />
            <Input placeholder="Search service or version..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex items-center gap-1.5">
            {["all", "production", "staging", "development"].map(e => (
              <Button key={e} variant={envFilter === e ? "default" : "outline"} size="sm" onClick={() => setEnvFilter(e)} className="capitalize">
                {e}
              </Button>
            ))}
          </div>
        </div>

        {/* Deployments table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Environment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Replicas</TableHead>
                <TableHead>Triggered by</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Started</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(d => (
                <React.Fragment key={d.id}>
                  <TableRow
                    className="cursor-pointer"
                    className="cursor-pointer"
                    onClick={() => setExpanded(expanded === d.id ? null : d.id)}
                  >
                    <TableCell className="w-8 pl-3">
                      {expanded === d.id
                        ? <ChevronDown className="w-3.5 h-3.5" style={{ color: "hsl(var(--muted-foreground))" }} />
                        : <ChevronRight className="w-3.5 h-3.5" style={{ color: "hsl(var(--muted-foreground))" }} />}
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm font-medium" style={{ color: "hsl(var(--foreground))" }}>{d.service}</span>
                    </TableCell>
                    <TableCell>
                      <span className="code-text">{d.version}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={envColors[d.environment]}>{d.environment}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <StatusIcon status={d.status} />
                        <Badge variant={statusVariant[d.status] as "success" | "destructive" | "neutral" | "info"}>{d.status}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm" style={{ color: d.replicas.startsWith("0") ? "hsl(var(--destructive))" : "hsl(var(--success))" }}>{d.replicas}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>{d.triggeredBy}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>{d.duration}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>{d.startedAt}</span>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon-sm" onClick={e => e.stopPropagation()}>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  {expanded === d.id && (
                    <TableRow key={`${d.id}-expanded`}>
                      <TableCell colSpan={10} className="bg-surface/40 px-6 py-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                          <div><p className="section-title mb-1">Branch</p><span className="code-text">{d.branch}</span></div>
                          <div><p className="section-title mb-1">Commit</p><span className="code-text">{d.commit}</span></div>
                          <div><p className="section-title mb-1">Image</p><span className="code-text truncate block max-w-xs">{d.image}</span></div>
                          <div className="flex items-start gap-2">
                            <Button variant="outline" size="sm">View Logs</Button>
                            {d.status === "failed" && <Button variant="warning" size="sm">Rollback</Button>}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  )
}
