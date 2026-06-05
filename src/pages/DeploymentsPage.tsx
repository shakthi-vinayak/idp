import React, { useState } from "react"
import { TopBar } from "@/components/TopBar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { LoadingState, ErrorState } from "@/components/LoadingErrorStates"
import { useDeployments, useRetryDeployment, useRollbackDeployment } from "@/hooks/useApi"
import type { Deployment } from "@/lib/api"
import { Search, GitBranch, RefreshCw, CheckCircle2, XCircle, Clock, AlertTriangle, ChevronDown, ChevronRight, ArrowUpRight } from "lucide-react"

const envColors = { production: "destructive", staging: "warning", development: "info" } as const

function StatusIcon({ status }: { status: Deployment["status"] }) {
  if (status === "succeeded") return <CheckCircle2 className="w-4 h-4" style={{ color: "hsl(var(--success))" }} />
  if (status === "failed") return <XCircle className="w-4 h-4" style={{ color: "hsl(var(--destructive))" }} />
  if (status === "pending") return <Clock className="w-4 h-4 animate-blink" style={{ color: "hsl(var(--muted-foreground))" }} />
  if (status === "rolling") return <RefreshCw className="w-4 h-4 animate-spin" style={{ color: "hsl(var(--info))" }} />
  if (status === "running") return <RefreshCw className="w-4 h-4 animate-spin" style={{ color: "hsl(var(--primary))" }} />
  return <AlertTriangle className="w-4 h-4" style={{ color: "hsl(var(--warning))" }} />
}

const statusVariant = { succeeded: "success", failed: "destructive", pending: "neutral", rolling: "info", running: "info", cancelled: "neutral" } as const

export function DeploymentsPage() {
  const [search, setSearch] = useState("")
  const [envFilter, setEnvFilter] = useState<string>("all")
  const [expanded, setExpanded] = useState<string | null>(null)

  const { data: deployments = [], isLoading, isError, error, refetch } = useDeployments()
  const retryMutation = useRetryDeployment()
  const rollbackMutation = useRollbackDeployment()

  const filtered = deployments.filter(d => {
    const matchSearch = d.service.includes(search.toLowerCase()) || d.version.includes(search)
    const matchEnv = envFilter === "all" || d.environment === envFilter
    return matchSearch && matchEnv
  })

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Deployments" description="GitOps-driven continuous delivery across all environments" action={{ label: "New Deployment", onClick: () => {} }} />
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
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

        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "hsl(var(--muted-foreground))" }} />
            <Input placeholder="Search service or version..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex items-center gap-1.5">
            {["all", "production", "staging", "development"].map(e => (
              <Button key={e} variant={envFilter === e ? "default" : "outline"} size="sm" onClick={() => setEnvFilter(e)} className="capitalize">{e}</Button>
            ))}
          </div>
        </div>

        {isLoading && <LoadingState />}
        {isError && <ErrorState message={error?.message || "Unknown error"} onRetry={() => refetch()} />}

        {!isLoading && !isError && (
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
                    <TableRow className="cursor-pointer" onClick={() => setExpanded(expanded === d.id ? null : d.id)}>
                      <TableCell className="w-8 pl-3">
                        {expanded === d.id ? <ChevronDown className="w-3.5 h-3.5" style={{ color: "hsl(var(--muted-foreground))" }} /> : <ChevronRight className="w-3.5 h-3.5" style={{ color: "hsl(var(--muted-foreground))" }} />}
                      </TableCell>
                      <TableCell><span className="font-mono text-sm font-medium" style={{ color: "hsl(var(--foreground))" }}>{d.service}</span></TableCell>
                      <TableCell><span className="code-text">{d.version}</span></TableCell>
                      <TableCell><Badge variant={envColors[d.environment as keyof typeof envColors] || "neutral"}>{d.environment}</Badge></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <StatusIcon status={d.status} />
                          <Badge variant={statusVariant[d.status as keyof typeof statusVariant] || "neutral"}>{d.status}</Badge>
                        </div>
                      </TableCell>
                      <TableCell><span className="font-mono text-sm" style={{ color: d.replicas.startsWith("0") ? "hsl(var(--destructive))" : "hsl(var(--success))" }}>{d.replicas}</span></TableCell>
                      <TableCell><span className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>{d.triggeredBy}</span></TableCell>
                      <TableCell><span className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>{d.duration}</span></TableCell>
                      <TableCell><span className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>{d.startedAt}</span></TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon-sm" onClick={e => e.stopPropagation()}><ArrowUpRight className="w-3.5 h-3.5" /></Button>
                      </TableCell>
                    </TableRow>
                    {expanded === d.id && (
                      <TableRow>
                        <TableCell colSpan={10} className="bg-surface/40 px-6 py-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                            <div><p className="section-title mb-1">Branch</p><span className="code-text">{d.branch}</span></div>
                            <div><p className="section-title mb-1">Commit</p><span className="code-text">{d.commit}</span></div>
                            <div><p className="section-title mb-1">Image</p><span className="code-text truncate block max-w-xs">{d.image}</span></div>
                            <div className="flex items-start gap-2">
                              <Button variant="outline" size="sm">View Logs</Button>
                              {d.status === "failed" && (
                                <Button variant="warning" size="sm" onClick={() => rollbackMutation.mutate(d.id)} disabled={rollbackMutation.isPending}>
                                  {rollbackMutation.isPending ? "Rolling back..." : "Rollback"}
                                </Button>
                              )}
                              {(d.status === "failed" || d.status === "cancelled") && (
                                <Button variant="outline" size="sm" onClick={() => retryMutation.mutate(d.id)} disabled={retryMutation.isPending}>
                                  {retryMutation.isPending ? "Retrying..." : "Retry"}
                                </Button>
                              )}
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
        )}
      </div>
    </div>
  )
}
