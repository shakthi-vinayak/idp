import { useState } from "react"
import { TopBar } from "@/components/TopBar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Server, Cpu, HardDrive, Network, CheckCircle2, AlertTriangle, Plus, Settings, ChevronDown, ChevronRight, Boxes } from "lucide-react"

interface Node {
  name: string
  status: "ready" | "not-ready"
  cpu: number
  mem: number
  pods: number
  maxPods: number
  role: "control-plane" | "worker"
  zone: string
}

interface Cluster {
  id: string
  name: string
  provider: "aws" | "gcp" | "azure"
  region: string
  version: string
  status: "healthy" | "warning" | "critical"
  nodes: Node[]
  cpuTotal: number
  cpuUsed: number
  memTotal: number
  memUsed: number
  namespaces: number
  services: number
}

const clusters: Cluster[] = [
  {
    id: "c-1", name: "prod-us-east-1", provider: "aws", region: "us-east-1", version: "1.29", status: "healthy",
    cpuTotal: 192, cpuUsed: 136, memTotal: 768, memUsed: 484, namespaces: 18, services: 124,
    nodes: [
      { name: "node-ctrl-01", status: "ready", cpu: 22, mem: 38, pods: 12, maxPods: 110, role: "control-plane", zone: "us-east-1a" },
      { name: "node-worker-01", status: "ready", cpu: 71, mem: 63, pods: 48, maxPods: 110, role: "worker", zone: "us-east-1a" },
      { name: "node-worker-02", status: "ready", cpu: 68, mem: 58, pods: 44, maxPods: 110, role: "worker", zone: "us-east-1b" },
      { name: "node-worker-03", status: "ready", cpu: 81, mem: 74, pods: 52, maxPods: 110, role: "worker", zone: "us-east-1c" },
    ],
  },
  {
    id: "c-2", name: "prod-eu-west-2", provider: "aws", region: "eu-west-2", version: "1.29", status: "healthy",
    cpuTotal: 144, cpuUsed: 79, memTotal: 576, memUsed: 276, namespaces: 14, services: 98,
    nodes: [
      { name: "node-ctrl-01", status: "ready", cpu: 18, mem: 31, pods: 11, maxPods: 110, role: "control-plane", zone: "eu-west-2a" },
      { name: "node-worker-01", status: "ready", cpu: 55, mem: 48, pods: 38, maxPods: 110, role: "worker", zone: "eu-west-2a" },
      { name: "node-worker-02", status: "ready", cpu: 52, mem: 44, pods: 36, maxPods: 110, role: "worker", zone: "eu-west-2b" },
    ],
  },
  {
    id: "c-3", name: "staging-us-east-1", provider: "aws", region: "us-east-1", version: "1.29", status: "warning",
    cpuTotal: 64, cpuUsed: 52, memTotal: 256, memUsed: 189, namespaces: 8, services: 47,
    nodes: [
      { name: "node-ctrl-01", status: "ready", cpu: 21, mem: 35, pods: 14, maxPods: 110, role: "control-plane", zone: "us-east-1a" },
      { name: "node-worker-01", status: "ready", cpu: 82, mem: 74, pods: 68, maxPods: 110, role: "worker", zone: "us-east-1a" },
      { name: "node-worker-02", status: "not-ready", cpu: 0, mem: 0, pods: 0, maxPods: 110, role: "worker", zone: "us-east-1b" },
    ],
  },
  {
    id: "c-4", name: "dev-cluster", provider: "gcp", region: "us-central1", version: "1.28", status: "healthy",
    cpuTotal: 32, cpuUsed: 12, memTotal: 128, memUsed: 52, namespaces: 5, services: 23,
    nodes: [
      { name: "node-ctrl-01", status: "ready", cpu: 18, mem: 24, pods: 9, maxPods: 64, role: "control-plane", zone: "us-central1-a" },
      { name: "node-worker-01", status: "ready", cpu: 38, mem: 41, pods: 22, maxPods: 64, role: "worker", zone: "us-central1-a" },
    ],
  },
]

const providerLogos: Record<string, string> = { aws: "☁️", gcp: "🟡", azure: "🔷" }

export function ClustersPage() {
  const [expanded, setExpanded] = useState<string[]>(["c-1"])

  const toggle = (id: string) => setExpanded(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Clusters" description="Kubernetes cluster management and node health" action={{ label: "Add Cluster", onClick: () => {} }} />
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total Clusters", value: clusters.length, icon: Server, color: "hsl(var(--primary))" },
            { label: "Total Nodes", value: clusters.reduce((a, c) => a + c.nodes.length, 0), icon: Cpu, color: "hsl(var(--info))" },
            { label: "Total Services", value: clusters.reduce((a, c) => a + c.services, 0), icon: Boxes, color: "hsl(var(--success))" },
            { label: "Namespaces", value: clusters.reduce((a, c) => a + c.namespaces, 0), icon: Network, color: "hsl(var(--warning))" },
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

        {/* Cluster cards */}
        <div className="space-y-3">
          {clusters.map(cluster => (
            <Card key={cluster.id} className="overflow-hidden">
              {/* Cluster header */}
              <div
                className="flex items-center gap-4 px-5 py-4 cursor-pointer"
                style={{ borderBottom: expanded.includes(cluster.id) ? "1px solid hsl(var(--border))" : "none" }}
                onClick={() => toggle(cluster.id)}
              >
                <div className="flex items-center gap-2">
                  {expanded.includes(cluster.id)
                    ? <ChevronDown className="w-4 h-4" style={{ color: "hsl(var(--muted-foreground))" }} />
                    : <ChevronRight className="w-4 h-4" style={{ color: "hsl(var(--muted-foreground))" }} />}
                </div>
                <div className="flex items-center gap-2">
                  {cluster.status === "healthy"
                    ? <CheckCircle2 className="w-4 h-4" style={{ color: "hsl(var(--success))" }} />
                    : <AlertTriangle className="w-4 h-4" style={{ color: "hsl(var(--warning))" }} />}
                  <span className="font-mono text-sm font-semibold" style={{ color: "hsl(var(--foreground))" }}>{cluster.name}</span>
                </div>
                <Badge variant={cluster.status === "healthy" ? "success" : "warning"}>{cluster.status}</Badge>
                <span className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                  {providerLogos[cluster.provider]} {cluster.region}
                </span>
                <span className="code-text">k8s {cluster.version}</span>
                <div className="flex-1" />
                <div className="hidden md:flex items-center gap-6 text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                  <div className="text-center"><p className="font-semibold text-sm" style={{ color: "hsl(var(--foreground))" }}>{cluster.nodes.length}</p><p>nodes</p></div>
                  <div className="text-center"><p className="font-semibold text-sm" style={{ color: "hsl(var(--foreground))" }}>{cluster.services}</p><p>services</p></div>
                  <div className="w-24">
                    <div className="flex justify-between text-xs mb-1"><span>CPU</span><span>{Math.round(cluster.cpuUsed / cluster.cpuTotal * 100)}%</span></div>
                    <Progress value={cluster.cpuUsed / cluster.cpuTotal * 100} variant={cluster.cpuUsed / cluster.cpuTotal > 0.8 ? "warning" : "success"} />
                  </div>
                  <div className="w-24">
                    <div className="flex justify-between text-xs mb-1"><span>Mem</span><span>{Math.round(cluster.memUsed / cluster.memTotal * 100)}%</span></div>
                    <Progress value={cluster.memUsed / cluster.memTotal * 100} variant={cluster.memUsed / cluster.memTotal > 0.8 ? "warning" : "default"} />
                  </div>
                </div>
                <Button variant="ghost" size="icon-sm" onClick={e => e.stopPropagation()}>
                  <Settings className="w-3.5 h-3.5" />
                </Button>
              </div>

              {/* Nodes table */}
              {expanded.includes(cluster.id) && (
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ borderBottom: "1px solid hsl(var(--border))" }}>
                          {["Node", "Role", "Zone", "Status", "CPU", "Memory", "Pods"].map(h => (
                            <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {cluster.nodes.map(node => (
                          <tr key={node.name} style={{ borderBottom: "1px solid hsl(var(--border) / 0.5)" }}>
                            <td className="px-4 py-2.5">
                              <span className="font-mono text-xs" style={{ color: "hsl(var(--foreground))" }}>{node.name}</span>
                            </td>
                            <td className="px-4 py-2.5">
                              <Badge variant={node.role === "control-plane" ? "primary" : "neutral"}>{node.role}</Badge>
                            </td>
                            <td className="px-4 py-2.5">
                              <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{node.zone}</span>
                            </td>
                            <td className="px-4 py-2.5">
                              <Badge variant={node.status === "ready" ? "success" : "destructive"}>{node.status}</Badge>
                            </td>
                            <td className="px-4 py-2.5 min-w-[100px]">
                              {node.status === "ready" ? (
                                <div>
                                  <div className="flex justify-between text-xs mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>
                                    <span>{node.cpu}%</span>
                                  </div>
                                  <Progress value={node.cpu} variant={node.cpu > 80 ? "warning" : "success"} />
                                </div>
                              ) : <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>—</span>}
                            </td>
                            <td className="px-4 py-2.5 min-w-[100px]">
                              {node.status === "ready" ? (
                                <div>
                                  <div className="flex justify-between text-xs mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>
                                    <span>{node.mem}%</span>
                                  </div>
                                  <Progress value={node.mem} variant={node.mem > 80 ? "warning" : "default"} />
                                </div>
                              ) : <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>—</span>}
                            </td>
                            <td className="px-4 py-2.5">
                              <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                                {node.pods}/{node.maxPods}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
