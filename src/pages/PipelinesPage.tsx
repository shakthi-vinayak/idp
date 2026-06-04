import { useState } from "react"
import { TopBar } from "@/components/TopBar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Clock, Play, RefreshCw, GitBranch, Zap, ChevronRight } from "lucide-react"

interface PipelineRun {
  id: string
  pipeline: string
  service: string
  branch: string
  trigger: string
  status: "success" | "failed" | "running" | "queued" | "cancelled"
  startedAt: string
  duration: string
  stages: Stage[]
}

interface Stage {
  name: string
  status: "success" | "failed" | "running" | "pending" | "skipped"
  duration?: string
}

const pipelineRuns: PipelineRun[] = [
  {
    id: "r-1", pipeline: "full-deploy", service: "payment-service", branch: "main", trigger: "push", status: "success",
    startedAt: "2m ago", duration: "3m 12s",
    stages: [
      { name: "Checkout", status: "success", duration: "2s" },
      { name: "Build", status: "success", duration: "1m 22s" },
      { name: "Unit Tests", status: "success", duration: "48s" },
      { name: "Docker Build", status: "success", duration: "34s" },
      { name: "Security Scan", status: "success", duration: "18s" },
      { name: "Deploy Staging", status: "success", duration: "28s" },
      { name: "Integration Tests", status: "success", duration: "1m 10s" },
      { name: "Deploy Prod", status: "success", duration: "32s" },
    ],
  },
  {
    id: "r-2", pipeline: "full-deploy", service: "order-service", branch: "main", trigger: "push", status: "failed",
    startedAt: "15m ago", duration: "1m 44s",
    stages: [
      { name: "Checkout", status: "success", duration: "2s" },
      { name: "Build", status: "success", duration: "1m 10s" },
      { name: "Unit Tests", status: "failed", duration: "30s" },
      { name: "Docker Build", status: "skipped" },
      { name: "Security Scan", status: "skipped" },
      { name: "Deploy Staging", status: "skipped" },
      { name: "Integration Tests", status: "skipped" },
      { name: "Deploy Prod", status: "skipped" },
    ],
  },
  {
    id: "r-3", pipeline: "pr-checks", service: "api-gateway", branch: "feat/rate-limit", trigger: "pull_request", status: "running",
    startedAt: "5m ago", duration: "~5m",
    stages: [
      { name: "Checkout", status: "success", duration: "2s" },
      { name: "Lint", status: "success", duration: "22s" },
      { name: "Build", status: "success", duration: "1m 8s" },
      { name: "Unit Tests", status: "running" },
      { name: "Docker Build", status: "pending" },
      { name: "Preview Deploy", status: "pending" },
    ],
  },
  {
    id: "r-4", pipeline: "pr-checks", service: "auth-service", branch: "fix/token-refresh", trigger: "pull_request", status: "queued",
    startedAt: "just now", duration: "—",
    stages: [
      { name: "Checkout", status: "pending" },
      { name: "Lint", status: "pending" },
      { name: "Build", status: "pending" },
      { name: "Unit Tests", status: "pending" },
      { name: "Docker Build", status: "pending" },
      { name: "Preview Deploy", status: "pending" },
    ],
  },
]

const pipelineTemplates = [
  { name: "full-deploy", description: "Checkout → Build → Test → Scan → Staging → Integration → Production", services: 8, runs: 124 },
  { name: "pr-checks", description: "Checkout → Lint → Build → Unit Tests → Docker → Preview", services: 12, runs: 342 },
  { name: "hotfix-deploy", description: "Checkout → Build → Smoke Tests → Canary → Production (fast path)", services: 3, runs: 17 },
  { name: "nightly-scan", description: "SAST → DAST → Dependency Audit → SBOM generation", services: 24, runs: 41 },
]

function StageNode({ stage }: { stage: Stage }) {
  const colors = {
    success: "hsl(var(--success))",
    failed: "hsl(var(--destructive))",
    running: "hsl(var(--info))",
    pending: "hsl(var(--muted-foreground))",
    skipped: "hsl(var(--border))",
  }
  const icons = {
    success: CheckCircle2,
    failed: XCircle,
    running: RefreshCw,
    pending: Clock,
    skipped: ChevronRight,
  }
  const Icon = icons[stage.status]
  return (
    <div className="flex flex-col items-center gap-1 min-w-0">
      <div className="flex flex-col items-center gap-0.5">
        <Icon
          className={`w-5 h-5 ${stage.status === "running" ? "animate-spin" : ""}`}
          style={{ color: colors[stage.status] }}
        />
      </div>
      <p className="text-xs text-center whitespace-nowrap" style={{ color: "hsl(var(--muted-foreground))", maxWidth: 80, overflow: "hidden", textOverflow: "ellipsis" }}>{stage.name}</p>
      {stage.duration && (
        <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))", opacity: 0.6 }}>{stage.duration}</p>
      )}
    </div>
  )
}

const runStatusVariant = { success: "success", failed: "destructive", running: "info", queued: "neutral", cancelled: "neutral" } as const

export function PipelinesPage() {
  const [activeTab, setActiveTab] = useState<"runs" | "templates">("runs")

  return (
    <div className="flex flex-col h-full">
      <TopBar title="CI/CD Pipelines" description="GitOps-native build, test, and deployment pipelines" action={{ label: "New Pipeline", onClick: () => {} }} />
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Image banner */}
        <div className="relative rounded-xl overflow-hidden h-28" style={{ border: "1px solid hsl(var(--border))" }}>
          <img src="/images/pipeline-visual.png" alt="Pipeline" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 flex items-center px-6" style={{ background: "linear-gradient(90deg, hsl(var(--card)) 40%, transparent)" }}>
            <div>
              <h2 className="text-base font-bold" style={{ color: "hsl(var(--foreground))" }}>Automated Delivery Pipelines</h2>
              <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>4 pipeline templates · {pipelineRuns.length} recent runs</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl w-fit" style={{ background: "hsl(var(--surface))" }}>
          {(["runs", "templates"] as const).map(t => (
            <button
              key={t}
              className="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize"
              style={{
                background: activeTab === t ? "hsl(var(--card))" : "transparent",
                color: activeTab === t ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
                boxShadow: activeTab === t ? "var(--shadow-card)" : "none",
              }}
              onClick={() => setActiveTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {activeTab === "runs" && (
          <div className="space-y-3">
            {pipelineRuns.map(run => (
              <Card key={run.id} className="overflow-hidden">
                <CardContent className="p-0">
                  {/* Header */}
                  <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: "hsl(var(--border))" }}>
                    <div className="flex items-center gap-3">
                      {run.status === "success" && <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: "hsl(var(--success))" }} />}
                      {run.status === "failed" && <XCircle className="w-4 h-4 flex-shrink-0" style={{ color: "hsl(var(--destructive))" }} />}
                      {run.status === "running" && <RefreshCw className="w-4 h-4 flex-shrink-0 animate-spin" style={{ color: "hsl(var(--info))" }} />}
                      {run.status === "queued" && <Clock className="w-4 h-4 flex-shrink-0 animate-blink" style={{ color: "hsl(var(--muted-foreground))" }} />}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-semibold" style={{ color: "hsl(var(--foreground))" }}>{run.service}</span>
                          <span className="code-text">{run.pipeline}</span>
                          <Badge variant={runStatusVariant[run.status]}>{run.status}</Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-0.5 text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                          <span className="flex items-center gap-1"><GitBranch className="w-3 h-3" />{run.branch}</span>
                          <span className="flex items-center gap-1"><Zap className="w-3 h-3" />{run.trigger}</span>
                          <span>{run.startedAt}</span>
                          <span>·</span>
                          <span>{run.duration}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {run.status === "failed" && <Button variant="outline" size="sm">Retry</Button>}
                      {run.status === "running" && <Button variant="destructive" size="sm">Cancel</Button>}
                      <Button variant="ghost" size="sm">Logs</Button>
                    </div>
                  </div>
                  {/* Stage pipeline */}
                  <div className="px-5 py-4 overflow-x-auto">
                    <div className="flex items-start gap-0 min-w-max">
                      {run.stages.map((stage, i) => (
                        <div key={stage.name} className="flex items-center">
                          <StageNode stage={stage} />
                          {i < run.stages.length - 1 && (
                            <div className="w-6 h-0.5 mx-1 mt-[-18px]" style={{
                              background: stage.status === "success" ? "hsl(var(--success) / 0.4)" :
                                stage.status === "failed" ? "hsl(var(--destructive) / 0.3)" :
                                  "hsl(var(--border))"
                            }} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "templates" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pipelineTemplates.map(t => (
              <Card key={t.name} className="hover:shadow-card-hover transition-all duration-200 cursor-pointer group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} />
                        <span className="font-mono">{t.name}</span>
                      </CardTitle>
                      <p className="text-xs mt-2" style={{ color: "hsl(var(--muted-foreground))" }}>{t.description}</p>
                    </div>
                    <Button variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100">
                      <Play className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                    <span>{t.services} services</span>
                    <span>·</span>
                    <span>{t.runs} runs (30d)</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
