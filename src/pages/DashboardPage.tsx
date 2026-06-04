import { TopBar } from "@/components/TopBar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid,
} from "recharts"
import {
  Boxes, GitBranch, Server, AlertTriangle, CheckCircle2,
  TrendingUp, Clock, Zap, Activity,
} from "lucide-react"

const deploymentData = [
  { time: "00:00", success: 12, failed: 1 },
  { time: "04:00", success: 8, failed: 0 },
  { time: "08:00", success: 24, failed: 2 },
  { time: "10:00", success: 31, failed: 1 },
  { time: "12:00", success: 45, failed: 3 },
  { time: "14:00", success: 38, failed: 1 },
  { time: "16:00", success: 52, failed: 2 },
  { time: "18:00", success: 41, failed: 0 },
  { time: "20:00", success: 29, failed: 1 },
  { time: "22:00", success: 18, failed: 0 },
  { time: "Now", success: 14, failed: 0 },
]

const requestData = [
  { time: "00:00", rps: 1200 },
  { time: "04:00", rps: 800 },
  { time: "08:00", rps: 2400 },
  { time: "10:00", rps: 3800 },
  { time: "12:00", rps: 4200 },
  { time: "14:00", rps: 5100 },
  { time: "16:00", rps: 4800 },
  { time: "18:00", rps: 3900 },
  { time: "20:00", rps: 2800 },
  { time: "22:00", rps: 1900 },
  { time: "Now", rps: 2200 },
]

const recentActivity = [
  { id: 1, service: "payment-service", action: "Deployed v2.4.1", time: "2m ago", status: "success" as const, actor: "CI/CD" },
  { id: 2, service: "api-gateway", action: "Scaling to 8 replicas", time: "5m ago", status: "success" as const, actor: "Auto-scale" },
  { id: 3, service: "auth-service", action: "Build failed – lint error", time: "12m ago", status: "warning" as const, actor: "PR #481" },
  { id: 4, service: "notification-svc", action: "Health check degraded", time: "18m ago", status: "destructive" as const, actor: "Monitor" },
  { id: 5, service: "user-service", action: "Deployed v1.9.0", time: "31m ago", status: "success" as const, actor: "CI/CD" },
  { id: 6, service: "analytics-worker", action: "Secret rotated", time: "1h ago", status: "info" as const, actor: "Vault" },
]

const clusters = [
  { name: "prod-us-east-1", nodes: 24, cpu: 71, mem: 63, status: "healthy" as const },
  { name: "prod-eu-west-2", nodes: 18, cpu: 55, mem: 48, status: "healthy" as const },
  { name: "staging-us-east-1", nodes: 8, cpu: 82, mem: 74, status: "warning" as const },
  { name: "dev-cluster", nodes: 4, cpu: 38, mem: 41, status: "healthy" as const },
]

function MetricCard({ icon: Icon, label, value, sub, trend, color }: {
  icon: React.ElementType
  label: string
  value: string
  sub: string
  trend?: string
  color: string
}) {
  return (
    <div className="panel p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>{label}</p>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: color + " / 0.12" }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
      </div>
      <div>
        <p className="metric-value">{value}</p>
        <p className="text-xs mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>{sub}</p>
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-xs" style={{ color: "hsl(var(--success))" }}>
          <TrendingUp className="w-3 h-3" />
          {trend}
        </div>
      )}
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ color: string; name: string; value: number }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="panel px-3 py-2 text-xs">
        <p style={{ color: "hsl(var(--muted-foreground))" }} className="mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>
            {p.name}: <span className="font-semibold">{p.value}</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function DashboardPage() {
  return (
    <div className="flex flex-col h-full">
      <TopBar
        title="Platform Dashboard"
        description="Real-time overview · Production environment"
        action={{ label: "New Deployment", onClick: () => {} }}
      />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Hero status */}
        <div
          className="relative rounded-2xl overflow-hidden p-6 flex items-center justify-between"
          style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "var(--gradient-hero)" }}
          />
          <img
            src="/images/hero-banner.png"
            alt="Platform visualization"
            className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-20 pointer-events-none"
            loading="lazy"
          />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="live-dot" />
              <span className="text-xs font-medium" style={{ color: "hsl(var(--success))" }}>All systems operational</span>
            </div>
            <h2 className="text-2xl font-bold mb-1" style={{ color: "hsl(var(--foreground))" }}>Platform Status</h2>
            <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
              4 clusters · 247 services · 98.97% uptime last 30 days
            </p>
          </div>
          <div className="relative z-10 text-right hidden md:block">
            <p className="text-4xl font-bold" style={{ color: "hsl(var(--primary-glow))" }}>98.97%</p>
            <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>30-day uptime SLA</p>
          </div>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard icon={Boxes} label="Total Services" value="247" sub="↑ 12 added this week" trend="+5.1% vs last week" color="hsl(var(--primary))" />
          <MetricCard icon={GitBranch} label="Deployments Today" value="83" sub="78 succeeded · 5 failed" trend="94% success rate" color="hsl(var(--success))" />
          <MetricCard icon={Server} label="Active Clusters" value="4" sub="54 nodes total · 100% reachable" color="hsl(var(--info))" />
          <MetricCard icon={AlertTriangle} label="Open Alerts" value="7" sub="2 critical · 5 warning" color="hsl(var(--warning))" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Deployments chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} />
                  Deployments (24h)
                </CardTitle>
                <div className="flex items-center gap-3 text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ background: "hsl(var(--success))" }} />Success</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ background: "hsl(var(--destructive))" }} />Failed</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={deploymentData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="successGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(142 71% 45%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(142 71% 45%)" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="failedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(0 72% 58%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(0 72% 58%)" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 18% 18%)" />
                  <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(215 16% 47%)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(215 16% 47%)" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="success" stroke="hsl(142 71% 45%)" fill="url(#successGrad)" strokeWidth={2} name="Success" />
                  <Area type="monotone" dataKey="failed" stroke="hsl(0 72% 58%)" fill="url(#failedGrad)" strokeWidth={2} name="Failed" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* RPS chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-4 h-4" style={{ color: "hsl(var(--info))" }} />
                  Request Throughput (24h)
                </CardTitle>
                <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>avg req/s</span>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={requestData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="rpsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(239 84% 67%)" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="hsl(239 84% 67%)" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 18% 18%)" />
                  <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(215 16% 47%)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(215 16% 47%)" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="rps" stroke="hsl(239 84% 67%)" fill="url(#rpsGrad)" strokeWidth={2} name="req/s" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Clusters + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Cluster health */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-4 h-4" style={{ color: "hsl(var(--info))" }} />
                Cluster Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {clusters.map((c) => (
                <div key={c.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5" style={{ color: c.status === "healthy" ? "hsl(var(--success))" : "hsl(var(--warning))" }} />
                      <span className="text-sm font-medium font-mono" style={{ color: "hsl(var(--foreground))" }}>{c.name}</span>
                      <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{c.nodes} nodes</span>
                    </div>
                    <Badge variant={c.status === "healthy" ? "success" : "warning"}>
                      {c.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>
                        <span>CPU</span><span>{c.cpu}%</span>
                      </div>
                      <Progress value={c.cpu} variant={c.cpu > 80 ? "warning" : "success"} />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>
                        <span>Memory</span><span>{c.mem}%</span>
                      </div>
                      <Progress value={c.mem} variant={c.mem > 80 ? "warning" : "default"} />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-4 h-4" style={{ color: "hsl(var(--warning))" }} />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {recentActivity.map((a) => (
                <div
                  key={a.id}
                  className="flex items-start gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer"
                  style={{ borderRadius: "0.6rem" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "hsl(var(--surface))")}
                  onMouseLeave={e => (e.currentTarget.style.background = "")}
                >
                  <div className="mt-0.5">
                    {a.status === "success" && <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "hsl(var(--success))" }} />}
                    {a.status === "warning" && <AlertTriangle className="w-3.5 h-3.5" style={{ color: "hsl(var(--warning))" }} />}
                    {a.status === "destructive" && <AlertTriangle className="w-3.5 h-3.5" style={{ color: "hsl(var(--destructive))" }} />}
                    {a.status === "info" && <Zap className="w-3.5 h-3.5" style={{ color: "hsl(var(--info))" }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "hsl(var(--foreground))" }}>{a.service}</p>
                    <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{a.action}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{a.time}</p>
                    <span className="code-text text-xs">{a.actor}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
