import { useState } from "react"
import { TopBar } from "@/components/TopBar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Shield, Eye, EyeOff, Copy, Plus, Search, RotateCcw, Lock, Key, Globe } from "lucide-react"

interface Secret {
  id: string
  name: string
  scope: "global" | "project" | "service"
  type: "env" | "tls" | "registry" | "ssh" | "opaque"
  lastRotated: string
  expiresIn?: string
  services: number
  status: "active" | "expiring" | "expired"
}

const secrets: Secret[] = [
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

const configMaps = [
  { name: "app-config", scope: "production", keys: 14, services: 8, updated: "2h ago" },
  { name: "feature-flags", scope: "global", keys: 22, services: 24, updated: "1d ago" },
  { name: "service-mesh-config", scope: "production", keys: 8, services: 12, updated: "3d ago" },
  { name: "monitoring-config", scope: "global", keys: 6, services: 4, updated: "5d ago" },
]

const typeIcons: Record<string, React.ElementType> = { env: Key, tls: Lock, registry: Globe, ssh: Key, opaque: Shield }

function MaskedValue({ value }: { value: string }) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
        {visible ? value : "••••••••••••••••"}
      </span>
      <button onClick={() => setVisible(v => !v)} style={{ color: "hsl(var(--muted-foreground))" }}>
        {visible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
      </button>
      <button onClick={() => navigator.clipboard.writeText(value)} style={{ color: "hsl(var(--muted-foreground))" }}>
        <Copy className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

export function SecretsPage() {
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState<"secrets" | "config">("secrets")

  const filtered = secrets.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Secrets & Config" description="Centralized secret management with automatic rotation" action={{ label: "Add Secret", onClick: () => {} }} />
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total Secrets", value: secrets.length, color: "hsl(var(--primary))", icon: Shield },
            { label: "Active", value: secrets.filter(s => s.status === "active").length, color: "hsl(var(--success))", icon: Lock },
            { label: "Expiring Soon", value: secrets.filter(s => s.status === "expiring").length, color: "hsl(var(--warning))", icon: RotateCcw },
            { label: "Expired", value: secrets.filter(s => s.status === "expired").length, color: "hsl(var(--destructive))", icon: Key },
          ].map(s => (
            <div key={s.label} className="panel px-4 py-3.5 flex items-center gap-3">
              <s.icon className="w-5 h-5" style={{ color: s.color }} />
              <div>
                <p className="text-xl font-bold" style={{ color: "hsl(var(--foreground))" }}>{s.value}</p>
                <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl w-fit" style={{ background: "hsl(var(--surface))" }}>
          {(["secrets", "config"] as const).map(t => (
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
              {t === "secrets" ? "Secrets" : "ConfigMaps"}
            </button>
          ))}
        </div>

        {activeTab === "secrets" && (
          <>
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "hsl(var(--muted-foreground))" }} />
                <Input placeholder="Search secrets..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Scope</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Services</TableHead>
                    <TableHead>Last Rotated</TableHead>
                    <TableHead>Expires In</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(s => {
                    const TypeIcon = typeIcons[s.type] || Key
                    return (
                      <TableRow key={s.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <TypeIcon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "hsl(var(--primary))" }} />
                            <span className="font-mono text-xs font-medium" style={{ color: "hsl(var(--foreground))" }}>{s.name}</span>
                          </div>
                        </TableCell>
                        <TableCell><Badge variant="neutral">{s.type}</Badge></TableCell>
                        <TableCell><Badge variant={s.scope === "global" ? "primary" : s.scope === "project" ? "info" : "neutral"}>{s.scope}</Badge></TableCell>
                        <TableCell><MaskedValue value="sk_live_abc123xyz789" /></TableCell>
                        <TableCell>
                          <Badge variant={s.status === "active" ? "success" : s.status === "expiring" ? "warning" : "destructive"}>
                            {s.status}
                          </Badge>
                        </TableCell>
                        <TableCell><span className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>{s.services}</span></TableCell>
                        <TableCell><span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{s.lastRotated}</span></TableCell>
                        <TableCell>
                          {s.expiresIn
                            ? <span className="text-xs" style={{ color: s.status === "expiring" ? "hsl(var(--warning))" : s.status === "expired" ? "hsl(var(--destructive))" : "hsl(var(--muted-foreground))" }}>{s.expiresIn}</span>
                            : <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>—</span>}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon-sm" title="Rotate secret">
                            <RotateCcw className="w-3.5 h-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </Card>
          </>
        )}

        {activeTab === "config" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {configMaps.map(cm => (
              <Card key={cm.name} className="hover:shadow-card-hover transition-all cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="font-mono text-sm">{cm.name}</CardTitle>
                    <Badge variant="neutral">{cm.scope}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                    <span>{cm.keys} keys</span>
                    <span>·</span>
                    <span>{cm.services} services</span>
                    <span>·</span>
                    <span>Updated {cm.updated}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Button variant="outline" size="sm">View Keys</Button>
                    <Button variant="ghost" size="sm">Edit</Button>
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
