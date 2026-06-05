import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// ────────────────────────────────────────────────
// DATA — mirrors the frontend mock datasets
// ────────────────────────────────────────────────

let deployments = [
  { id: "d-1", service: "payment-service", version: "v2.4.1", environment: "production", status: "succeeded", triggeredBy: "CI/CD", branch: "main", commit: "a3f8c12", startedAt: "2m ago", duration: "3m 12s", replicas: "3/3", image: "registry.io/payment:v2.4.1" },
  { id: "d-2", service: "api-gateway", version: "v3.2.2-rc1", environment: "staging", status: "rolling", triggeredBy: "PR #502", branch: "feat/rate-limit", commit: "7e9b2a1", startedAt: "5m ago", duration: "~2m", replicas: "4/6", image: "registry.io/api-gw:v3.2.2-rc1" },
  { id: "d-3", service: "order-service", version: "v3.0.0-rc1", environment: "production", status: "failed", triggeredBy: "CI/CD", branch: "main", commit: "c1d4f89", startedAt: "15m ago", duration: "1m 44s", replicas: "0/3", image: "registry.io/orders:v3.0.0-rc1" },
  { id: "d-4", service: "web-app", version: "v5.1.0", environment: "production", status: "succeeded", triggeredBy: "shakthi.v", branch: "main", commit: "b8a2e3f", startedAt: "30m ago", duration: "2m 58s", replicas: "3/3", image: "registry.io/webapp:v5.1.0" },
  { id: "d-5", service: "user-service", version: "v1.9.0", environment: "production", status: "succeeded", triggeredBy: "CI/CD", branch: "main", commit: "d5f7c91", startedAt: "3h ago", duration: "4m 2s", replicas: "4/4", image: "registry.io/users:v1.9.0" },
  { id: "d-6", service: "auth-service", version: "v2.8.5-beta", environment: "staging", status: "pending", triggeredBy: "PR #498", branch: "fix/token-refresh", commit: "e2a9b3c", startedAt: "just now", duration: "—", replicas: "0/3", image: "registry.io/auth:v2.8.5-beta" },
  { id: "d-7", service: "search-service", version: "v2.1.0", environment: "production", status: "succeeded", triggeredBy: "CI/CD", branch: "main", commit: "f1b3d4a", startedAt: "1h ago", duration: "3m 35s", replicas: "3/3", image: "registry.io/search:v2.1.0" },
  { id: "d-8", service: "notification-svc", version: "v1.4.2", environment: "development", status: "succeeded", triggeredBy: "dev.user", branch: "dev", commit: "9c5e2f1", startedAt: "6h ago", duration: "1m 22s", replicas: "1/1", image: "registry.io/notifs:v1.4.2" },
]

let secrets = [
  { id: "s-1", name: "DATABASE_URL", scope: "project", type: "env", lastRotated: "3d ago", services: 4, status: "active" },
  { id: "s-2", name: "STRIPE_SECRET_KEY", scope: "service", type: "env", lastRotated: "7d ago", expiresIn: "23d", services: 1, status: "active" },
  { id: "s-3", name: "JWT_SIGNING_KEY", scope: "global", type: "opaque", lastRotated: "14d ago", services: 6, status: "active" },
  { id: "s-4", name: "prod-tls-cert", scope: "global", type: "tls", lastRotated: "30d ago", expiresIn: "60d", services: 12, status: "active" },
  { id: "s-5", name: "ghcr-registry-token", scope: "global", type: "registry", lastRotated: "60d ago", expiresIn: "5d", services: 24, status: "expiring" },
  { id: "s-6", name: "AWS_ACCESS_KEY_ID", scope: "project", type: "env", lastRotated: "90d ago", expiresIn: "0d", services: 3, status: "expired" },
  { id: "s-7", name: "SENDGRID_API_KEY", scope: "service", type: "env", lastRotated: "21d ago", services: 1, status: "active" },
  { id: "s-8", name: "deploy-ssh-key", scope: "global", type: "ssh", lastRotated: "45d ago", expiresIn: "45d", services: 8, status: "active" },
  { id: "s-9", name: "REDIS_PASSWORD", scope: "project", type: "env", lastRotated: "5d ago", services: 5, status: "active" },
  { id: "s-10", name: "OPENAI_API_KEY", scope: "service", type: "env", lastRotated: "1d ago", services: 1, status: "active" },
]

const services = [
  { id: "1", name: "api-gateway", team: "Platform", type: "api", language: "Go", status: "healthy", version: "v3.2.1", uptime: "99.99%", lastDeploy: "2h ago", replicas: 6, starred: true, description: "Central API gateway handling all inbound traffic and routing", tags: ["critical", "ingress"] },
  { id: "2", name: "auth-service", team: "Identity", type: "api", language: "Node.js", status: "healthy", version: "v2.8.4", uptime: "99.97%", lastDeploy: "1d ago", replicas: 4, starred: true, description: "OAuth2 / JWT authentication and authorization service", tags: ["critical", "security"] },
  { id: "3", name: "payment-service", team: "Payments", type: "api", language: "Java", status: "healthy", version: "v2.4.1", uptime: "99.95%", lastDeploy: "2m ago", replicas: 3, starred: false, description: "Stripe integration and payment processing workflows", tags: ["critical", "pci"] },
  { id: "4", name: "user-service", team: "Core", type: "api", language: "Python", status: "healthy", version: "v1.9.0", uptime: "99.91%", lastDeploy: "3h ago", replicas: 4, starred: false, description: "User profiles, preferences and account management", tags: ["gdpr"] },
  { id: "5", name: "notification-svc", team: "Comms", type: "worker", language: "Node.js", status: "degraded", version: "v1.4.2", uptime: "98.1%", lastDeploy: "6h ago", replicas: 2, starred: false, description: "Email, SMS and push notification dispatcher", tags: ["async"] },
  { id: "6", name: "analytics-worker", team: "Data", type: "worker", language: "Python", status: "healthy", version: "v0.9.3", uptime: "99.7%", lastDeploy: "12h ago", replicas: 2, starred: false, description: "Event stream processing and business analytics aggregation", tags: ["async", "kafka"] },
  { id: "7", name: "web-app", team: "Frontend", type: "frontend", language: "React", status: "healthy", version: "v5.1.0", uptime: "99.99%", lastDeploy: "30m ago", replicas: 3, starred: true, description: "Customer-facing React SPA with SSR capabilities", tags: ["cdn"] },
  { id: "8", name: "recommendation-engine", team: "ML", type: "ml", language: "Python", status: "healthy", version: "v1.2.1", uptime: "99.5%", lastDeploy: "2d ago", replicas: 2, starred: false, description: "ML-powered product recommendation and personalization", tags: ["gpu", "ml"] },
  { id: "9", name: "search-service", team: "Core", type: "api", language: "Go", status: "healthy", version: "v2.1.0", uptime: "99.8%", lastDeploy: "1h ago", replicas: 3, starred: false, description: "Elasticsearch-backed full-text search and indexing", tags: ["elasticsearch"] },
  { id: "10", name: "inventory-db", team: "Data", type: "database", language: "PostgreSQL", status: "healthy", version: "v15.2", uptime: "100%", lastDeploy: "30d ago", replicas: 3, starred: false, description: "Primary inventory and product catalogue database (HA cluster)", tags: ["stateful", "ha"] },
  { id: "11", name: "order-service", team: "Orders", type: "api", language: "Java", status: "down", version: "v3.0.0-rc1", uptime: "0%", lastDeploy: "15m ago", replicas: 0, starred: false, description: "Order lifecycle management and fulfillment orchestration", tags: ["critical"] },
  { id: "12", name: "cdn-edge", team: "Platform", type: "frontend", language: "Cloudflare Workers", status: "healthy", version: "v1.0.8", uptime: "100%", lastDeploy: "5d ago", replicas: 1, starred: false, description: "Edge CDN and asset delivery with global PoPs", tags: ["cdn", "edge"] },
]

const clusters = [
  { id: "c-1", name: "prod-us-east-1", provider: "aws", region: "us-east-1", version: "1.29", status: "healthy", cpuTotal: 192, cpuUsed: 136, memTotal: 768, memUsed: 484, namespaces: 18, services: 124, nodes: [
    { name: "node-ctrl-01", status: "ready", cpu: 22, mem: 38, pods: 12, maxPods: 110, role: "control-plane", zone: "us-east-1a" },
    { name: "node-worker-01", status: "ready", cpu: 71, mem: 63, pods: 48, maxPods: 110, role: "worker", zone: "us-east-1a" },
    { name: "node-worker-02", status: "ready", cpu: 68, mem: 58, pods: 44, maxPods: 110, role: "worker", zone: "us-east-1b" },
    { name: "node-worker-03", status: "ready", cpu: 81, mem: 74, pods: 52, maxPods: 110, role: "worker", zone: "us-east-1c" },
  ]},
  { id: "c-2", name: "prod-eu-west-2", provider: "aws", region: "eu-west-2", version: "1.29", status: "healthy", cpuTotal: 144, cpuUsed: 79, memTotal: 576, memUsed: 276, namespaces: 14, services: 98, nodes: [
    { name: "node-ctrl-01", status: "ready", cpu: 18, mem: 31, pods: 11, maxPods: 110, role: "control-plane", zone: "eu-west-2a" },
    { name: "node-worker-01", status: "ready", cpu: 55, mem: 48, pods: 38, maxPods: 110, role: "worker", zone: "eu-west-2a" },
    { name: "node-worker-02", status: "ready", cpu: 52, mem: 44, pods: 36, maxPods: 110, role: "worker", zone: "eu-west-2b" },
  ]},
  { id: "c-3", name: "staging-us-east-1", provider: "aws", region: "us-east-1", version: "1.29", status: "warning", cpuTotal: 64, cpuUsed: 52, memTotal: 256, memUsed: 189, namespaces: 8, services: 47, nodes: [
    { name: "node-ctrl-01", status: "ready", cpu: 21, mem: 35, pods: 14, maxPods: 110, role: "control-plane", zone: "us-east-1a" },
    { name: "node-worker-01", status: "ready", cpu: 82, mem: 74, pods: 68, maxPods: 110, role: "worker", zone: "us-east-1a" },
    { name: "node-worker-02", status: "not-ready", cpu: 0, mem: 0, pods: 0, maxPods: 110, role: "worker", zone: "us-east-1b" },
  ]},
  { id: "c-4", name: "dev-cluster", provider: "gcp", region: "us-central1", version: "1.28", status: "healthy", cpuTotal: 32, cpuUsed: 12, memTotal: 128, memUsed: 52, namespaces: 5, services: 23, nodes: [
    { name: "node-ctrl-01", status: "ready", cpu: 18, mem: 24, pods: 9, maxPods: 64, role: "control-plane", zone: "us-central1-a" },
    { name: "node-worker-01", status: "ready", cpu: 38, mem: 41, pods: 22, maxPods: 64, role: "worker", zone: "us-central1-a" },
  ]},
]

const metrics = {
  p95: [
    { time: "00:00", p50: 42, p95: 120, p99: 280 },
    { time: "03:00", p50: 38, p95: 98, p99: 201 },
    { time: "06:00", p50: 45, p95: 130, p99: 310 },
    { time: "09:00", p50: 68, p95: 195, p99: 440 },
    { time: "12:00", p50: 72, p95: 210, p99: 510 },
    { time: "15:00", p50: 65, p95: 180, p99: 420 },
    { time: "18:00", p50: 55, p95: 155, p99: 360 },
    { time: "21:00", p50: 48, p95: 135, p99: 290 },
    { time: "Now", p50: 52, p95: 148, p99: 310 },
  ],
  errorRate: [
    { time: "00:00", rate: 0.08 },
    { time: "03:00", rate: 0.05 },
    { time: "06:00", rate: 0.12 },
    { time: "09:00", rate: 0.21 },
    { time: "12:00", rate: 0.31 },
    { time: "15:00", rate: 0.18 },
    { time: "18:00", rate: 0.14 },
    { time: "21:00", rate: 0.09 },
    { time: "Now", rate: 0.11 },
  ],
  podRestarts: [
    { service: "order-svc", restarts: 12 },
    { service: "notif-svc", restarts: 7 },
    { service: "search-svc", restarts: 3 },
    { service: "auth-svc", restarts: 2 },
    { service: "api-gw", restarts: 1 },
  ],
  alerts: [
    { id: "a-1", service: "order-service", rule: "CrashLoopBackOff detected", severity: "critical", time: "15m ago", status: "firing" },
    { id: "a-2", service: "staging-cluster", rule: "Node not-ready: node-worker-02", severity: "warning", time: "22m ago", status: "firing" },
    { id: "a-3", service: "notification-svc", rule: "Error rate > 2% for 5m", severity: "warning", time: "1h ago", status: "firing" },
    { id: "a-4", service: "ghcr-registry-token", rule: "Secret expires in 5 days", severity: "info", time: "2h ago", status: "firing" },
    { id: "a-5", service: "api-gateway", rule: "P99 latency > 500ms", severity: "info", time: "4h ago", status: "resolved" },
  ],
  kpis: { avgP95: "148ms", errorRate: "0.11%", activeAlerts: 4, uptime30d: "98.97%" },
}

const pipelineRuns = [
  { id: "r-1", pipeline: "full-deploy", service: "payment-service", branch: "main", trigger: "push", status: "success", startedAt: "2m ago", duration: "3m 12s", stages: [
    { name: "Checkout", status: "success", duration: "2s" }, { name: "Build", status: "success", duration: "1m 22s" },
    { name: "Unit Tests", status: "success", duration: "48s" }, { name: "Docker Build", status: "success", duration: "34s" },
    { name: "Security Scan", status: "success", duration: "18s" }, { name: "Deploy Staging", status: "success", duration: "28s" },
    { name: "Integration Tests", status: "success", duration: "1m 10s" }, { name: "Deploy Prod", status: "success", duration: "32s" },
  ]},
  { id: "r-2", pipeline: "full-deploy", service: "order-service", branch: "main", trigger: "push", status: "failed", startedAt: "15m ago", duration: "1m 44s", stages: [
    { name: "Checkout", status: "success", duration: "2s" }, { name: "Build", status: "success", duration: "1m 10s" },
    { name: "Unit Tests", status: "failed", duration: "30s" }, { name: "Docker Build", status: "skipped" },
    { name: "Security Scan", status: "skipped" }, { name: "Deploy Staging", status: "skipped" },
    { name: "Integration Tests", status: "skipped" }, { name: "Deploy Prod", status: "skipped" },
  ]},
  { id: "r-3", pipeline: "pr-checks", service: "api-gateway", branch: "feat/rate-limit", trigger: "pull_request", status: "running", startedAt: "5m ago", duration: "~5m", stages: [
    { name: "Checkout", status: "success", duration: "2s" }, { name: "Lint", status: "success", duration: "22s" },
    { name: "Build", status: "success", duration: "1m 8s" }, { name: "Unit Tests", status: "running" },
    { name: "Docker Build", status: "pending" }, { name: "Preview Deploy", status: "pending" },
  ]},
  { id: "r-4", pipeline: "pr-checks", service: "auth-service", branch: "fix/token-refresh", trigger: "pull_request", status: "queued", startedAt: "just now", duration: "—", stages: [
    { name: "Checkout", status: "pending" }, { name: "Lint", status: "pending" },
    { name: "Build", status: "pending" }, { name: "Unit Tests", status: "pending" },
    { name: "Docker Build", status: "pending" }, { name: "Preview Deploy", status: "pending" },
  ]},
]

const teams = [
  { id: "t-1", name: "Platform", description: "Infrastructure, IDP, and developer tooling", members: 4, services: 18, lead: "Shakthi Vinayak" },
  { id: "t-2", name: "Payments", description: "Payment processing and billing workflows", members: 5, services: 6, lead: "Arjun Mehta" },
  { id: "t-3", name: "Identity", description: "Auth, SSO, and identity management", members: 3, services: 4, lead: "Sofia Chen" },
  { id: "t-4", name: "Core", description: "Core product APIs and data services", members: 6, services: 12, lead: "Lucas Oliveira" },
  { id: "t-5", name: "ML", description: "Machine learning, recommendations and models", members: 3, services: 3, lead: "Aiko Tanaka" },
  { id: "t-6", name: "Data", description: "Data pipelines, analytics and warehousing", members: 4, services: 8, lead: "Emma Wilson" },
  { id: "t-7", name: "Frontend", description: "Web apps, mobile and CDN", members: 5, services: 5, lead: "—" },
  { id: "t-8", name: "Comms", description: "Notifications, email and messaging services", members: 2, services: 3, lead: "—" },
]

const members = [
  { id: "m-1", name: "Shakthi Vinayak", email: "shakthi@nexus.io", role: "owner", team: "Platform", lastActive: "now", status: "active" },
  { id: "m-2", name: "Priya Shankar", email: "priya@nexus.io", role: "admin", team: "Platform", lastActive: "5m ago", status: "active" },
  { id: "m-3", name: "Arjun Mehta", email: "arjun@nexus.io", role: "developer", team: "Payments", lastActive: "1h ago", status: "active" },
  { id: "m-4", name: "Sofia Chen", email: "sofia@nexus.io", role: "developer", team: "Identity", lastActive: "2h ago", status: "active" },
  { id: "m-5", name: "Lucas Oliveira", email: "lucas@nexus.io", role: "developer", team: "Core", lastActive: "3h ago", status: "active" },
  { id: "m-6", name: "Aiko Tanaka", email: "aiko@nexus.io", role: "developer", team: "ML", lastActive: "1d ago", status: "active" },
  { id: "m-7", name: "Emma Wilson", email: "emma@nexus.io", role: "viewer", team: "Data", lastActive: "2d ago", status: "active" },
  { id: "m-8", name: "new.dev@nexus.io", email: "new.dev@nexus.io", role: "developer", team: "Frontend", lastActive: "—", status: "invited" },
]

// ────────────────────────────────────────────────
// ROUTES
// ────────────────────────────────────────────────

// Health
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', version: '1.2.0', uptime: process.uptime() })
})

// Services
app.get('/api/services', (_req, res) => {
  const { type, status, search } = _req.query
  let result = [...services]
  if (type && type !== 'all') result = result.filter(s => s.type === type)
  if (status) result = result.filter(s => s.status === status)
  if (search) {
    const q = String(search).toLowerCase()
    result = result.filter(s => s.name.includes(q) || s.team.toLowerCase().includes(q) || s.description.toLowerCase().includes(q))
  }
  res.json(result)
})

app.get('/api/services/:id', (req, res) => {
  const svc = services.find(s => s.id === req.params.id)
  if (!svc) return res.status(404).json({ error: 'Service not found' })
  res.json(svc)
})

// Deployments
app.get('/api/deployments', (_req, res) => {
  const { environment, status } = _req.query
  let result = [...deployments]
  if (environment && environment !== 'all') result = result.filter(d => d.environment === environment)
  if (status) result = result.filter(d => d.status === status)
  res.json(result)
})

app.post('/api/deployments/:id/retry', (req, res) => {
  const dep = deployments.find(d => d.id === req.params.id)
  if (!dep) return res.status(404).json({ error: 'Deployment not found' })
  dep.status = 'running'
  dep.startedAt = 'just now'
  res.json({ message: `Deployment ${dep.id} retried`, deployment: dep })
})

app.post('/api/deployments/:id/rollback', (req, res) => {
  const dep = deployments.find(d => d.id === req.params.id)
  if (!dep) return res.status(404).json({ error: 'Deployment not found' })
  dep.status = 'succeeded'
  dep.replicas = '3/3'
  res.json({ message: `Deployment ${dep.id} rolled back`, deployment: dep })
})

// Pipelines
app.get('/api/pipelines/runs', (_req, res) => {
  res.json(pipelineRuns)
})

app.post('/api/pipelines/runs/:id/retry', (req, res) => {
  const run = pipelineRuns.find(r => r.id === req.params.id)
  if (!run) return res.status(404).json({ error: 'Pipeline run not found' })
  run.status = 'running'
  res.json({ message: `Pipeline run ${run.id} retried`, run })
})

app.post('/api/pipelines/runs/:id/cancel', (req, res) => {
  const run = pipelineRuns.find(r => r.id === req.params.id)
  if (!run) return res.status(404).json({ error: 'Pipeline run not found' })
  run.status = 'cancelled'
  res.json({ message: `Pipeline run ${run.id} cancelled`, run })
})

// Clusters
app.get('/api/clusters', (_req, res) => {
  res.json(clusters)
})

app.get('/api/clusters/:id', (req, res) => {
  const cluster = clusters.find(c => c.id === req.params.id)
  if (!cluster) return res.status(404).json({ error: 'Cluster not found' })
  res.json(cluster)
})

// Secrets
app.get('/api/secrets', (_req, res) => {
  res.json(secrets)
})

app.post('/api/secrets/:id/rotate', (req, res) => {
  const secret = secrets.find(s => s.id === req.params.id)
  if (!secret) return res.status(404).json({ error: 'Secret not found' })
  secret.lastRotated = 'just now'
  secret.status = 'active'
  if (secret.expiresIn) secret.expiresIn = '90d'
  res.json({ message: `Secret ${secret.name} rotated successfully`, secret })
})

// Monitoring
app.get('/api/monitoring/metrics', (_req, res) => {
  res.json(metrics)
})

// Teams
app.get('/api/teams', (_req, res) => {
  res.json(teams)
})

app.get('/api/teams/members', (_req, res) => {
  res.json(members)
})

// ────────────────────────────────────────────────
// START
// ────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`NexusIDP API server running on http://localhost:${PORT}`)
})
