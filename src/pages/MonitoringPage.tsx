import { TopBar } from "@/components/TopBar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingState, ErrorState } from "@/components/LoadingErrorStates"
import { useMonitoring } from "@/hooks/useApi"
import {
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid,
  BarChart, Bar,
} from "recharts"
import { Activity, AlertTriangle, CheckCircle2, Bell, TrendingUp, TrendingDown, Clock } from "lucide-react"

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ color: string; name: string; value: number }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="panel px-3 py-2 text-xs">
        <p style={{ color: "hsl(var(--muted-foreground))" }} className="mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>{p.name}: <span className="font-semibold">{p.value}</span></p>
        ))}
      </div>
    )
  }
  return null
}

const severityVariant = { critical: "destructive", warning: "warning", info: "info" } as const

export function MonitoringPage() {
  const { data: metrics, isLoading, isError, error, refetch } = useMonitoring()

  if (isLoading) return <div className="flex flex-col h-full"><TopBar title="Monitoring" description="Platform-wide observability" /><div className="flex-1"><LoadingState /></div></div>
  if (isError || !metrics) return <div className="flex flex-col h-full"><TopBar title="Monitoring" description="Platform-wide observability" /><div className="flex-1"><ErrorState message={error?.message || "Unknown error"} onRetry={() => refetch()} /></div></div>

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Monitoring" description="Platform-wide observability — metrics, logs, and alerts" action={{ label: "New Alert Rule", onClick: () => {} }} />
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Avg P95 Latency", value: metrics.kpis.avgP95, trend: "+12ms vs 1h", up: true, icon: Clock, color: "hsl(var(--info))" },
            { label: "Error Rate", value: metrics.kpis.errorRate, trend: "-0.07% vs 1h", up: false, icon: TrendingDown, color: "hsl(var(--success))" },
            { label: "Active Alerts", value: String(metrics.kpis.activeAlerts), trend: "2 critical", up: true, icon: AlertTriangle, color: "hsl(var(--destructive))" },
            { label: "Uptime (30d)", value: metrics.kpis.uptime30d, trend: "+0.12% vs prev", up: false, icon: Activity, color: "hsl(var(--success))" },
          ].map(s => (
            <div key={s.label} className="panel px-4 py-3.5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{s.label}</p>
                <s.icon className="w-4 h-4" style={{ color: s.color }} />
              </div>
              <p className="text-2xl font-bold" style={{ color: "hsl(var(--foreground))" }}>{s.value}</p>
              <p className="text-xs mt-1 flex items-center gap-1" style={{ color: s.up ? "hsl(var(--warning))" : "hsl(var(--success))" }}>
                {s.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {s.trend}
              </p>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-4 h-4" style={{ color: "hsl(var(--info))" }} />API Latency (24h)
                </CardTitle>
                <div className="flex items-center gap-3 text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block bg-success" />p50</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block bg-warning" />p95</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block bg-destructive" />p99</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={metrics.p95} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="p50Grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(142 71% 45%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(142 71% 45%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="p95Grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(38 92% 50%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(38 92% 50%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 18% 18%)" />
                  <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(215 16% 47%)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(215 16% 47%)" }} axisLine={false} tickLine={false} unit="ms" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="p50" stroke="hsl(142 71% 45%)" fill="url(#p50Grad)" strokeWidth={2} name="p50" />
                  <Area type="monotone" dataKey="p95" stroke="hsl(38 92% 50%)" fill="url(#p95Grad)" strokeWidth={2} name="p95" />
                  <Area type="monotone" dataKey="p99" stroke="hsl(0 72% 58%)" fill="none" strokeWidth={1.5} strokeDasharray="4 2" name="p99" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-4 h-4" style={{ color: "hsl(var(--warning))" }} />Pod Restarts (24h)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={metrics.podRestarts} layout="vertical" margin={{ top: 0, right: 4, bottom: 0, left: 0 }}>
                  <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(215 16% 47%)" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="service" tick={{ fontSize: 10, fill: "hsl(215 16% 47%)" }} axisLine={false} tickLine={false} width={70} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="restarts" fill="hsl(239 84% 67%)" radius={[0, 4, 4, 0]} name="Restarts" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Error rate + Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4" style={{ color: "hsl(var(--destructive))" }} />Platform Error Rate (24h)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={140}>
                <AreaChart data={metrics.errorRate} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="errGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(0 72% 58%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(0 72% 58%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 18% 18%)" />
                  <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(215 16% 47%)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(215 16% 47%)" }} axisLine={false} tickLine={false} unit="%" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="rate" stroke="hsl(0 72% 58%)" fill="url(#errGrad)" strokeWidth={2} name="Error %" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-4 h-4" style={{ color: "hsl(var(--destructive))" }} />Active Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 px-4 pb-4">
              {metrics.alerts.map(a => (
                <div key={a.id} className="flex items-start gap-2.5 py-2 border-b last:border-0" style={{ borderColor: "hsl(var(--border) / 0.5)" }}>
                  {a.status === "firing"
                    ? <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: a.severity === "critical" ? "hsl(var(--destructive))" : a.severity === "warning" ? "hsl(var(--warning))" : "hsl(var(--info))" }} />
                    : <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: "hsl(var(--success))" }} />}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: "hsl(var(--foreground))" }}>{a.rule}</p>
                    <p className="text-xs truncate" style={{ color: "hsl(var(--muted-foreground))" }}>{a.service} · {a.time}</p>
                  </div>
                  <Badge variant={a.status === "resolved" ? "success" : severityVariant[a.severity as keyof typeof severityVariant] || "neutral"}>
                    {a.status === "resolved" ? "ok" : a.severity}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
