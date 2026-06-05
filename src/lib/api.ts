const API_BASE = import.meta.env.VITE_API_URL || '/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `API error: ${res.status} ${res.statusText}`)
  }
  return res.json()
}

export const api = {
  get: <T>(path: string) => request<T>(path),

  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
}

// Typed endpoints
export interface Service {
  id: string; name: string; team: string; type: string; language: string
  status: string; version: string; uptime: string; lastDeploy: string
  replicas: number; starred: boolean; description: string; tags: string[]
}

export interface Deployment {
  id: string; service: string; version: string; environment: string
  status: string; triggeredBy: string; branch: string; commit: string
  startedAt: string; duration: string; replicas: string; image: string
}

export interface Secret {
  id: string; name: string; scope: string; type: string
  lastRotated: string; expiresIn?: string; services: number; status: string
}

export interface Cluster {
  id: string; name: string; provider: string; region: string
  version: string; status: string; cpuTotal: number; cpuUsed: number
  memTotal: number; memUsed: number; namespaces: number; services: number
  nodes: ClusterNode[]
}

export interface ClusterNode {
  name: string; status: string; cpu: number; mem: number
  pods: number; maxPods: number; role: string; zone: string
}

export interface PipelineRun {
  id: string; pipeline: string; service: string; branch: string
  trigger: string; status: string; startedAt: string; duration: string
  stages: PipelineStage[]
}

export interface PipelineStage {
  name: string; status: string; duration?: string
}

export interface Team {
  id: string; name: string; description: string
  members: number; services: number; lead: string
}

export interface Member {
  id: string; name: string; email: string; role: string
  team: string; lastActive: string; status: string
}

export interface MonitoringMetrics {
  p95: Array<{ time: string; p50: number; p95: number; p99: number }>
  errorRate: Array<{ time: string; rate: number }>
  podRestarts: Array<{ service: string; restarts: number }>
  alerts: Array<{ id: string; service: string; rule: string; severity: string; time: string; status: string }>
  kpis: { avgP95: string; errorRate: string; activeAlerts: number; uptime30d: string }
}

export interface ApiMessage {
  message: string
}
