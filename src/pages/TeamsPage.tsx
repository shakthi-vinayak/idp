import { useState } from "react"
import { TopBar } from "@/components/TopBar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, Shield, Plus, Search, Mail, MoreVertical, Crown } from "lucide-react"

interface Member {
  id: string
  name: string
  email: string
  role: "admin" | "developer" | "viewer" | "owner"
  team: string
  lastActive: string
  status: "active" | "invited"
}

interface Team {
  id: string
  name: string
  description: string
  members: number
  services: number
  lead: string
}

const members: Member[] = [
  { id: "m-1", name: "Shakthi Vinayak", email: "shakthi@nexus.io", role: "owner", team: "Platform", lastActive: "now", status: "active" },
  { id: "m-2", name: "Priya Shankar", email: "priya@nexus.io", role: "admin", team: "Platform", lastActive: "5m ago", status: "active" },
  { id: "m-3", name: "Arjun Mehta", email: "arjun@nexus.io", role: "developer", team: "Payments", lastActive: "1h ago", status: "active" },
  { id: "m-4", name: "Sofia Chen", email: "sofia@nexus.io", role: "developer", team: "Identity", lastActive: "2h ago", status: "active" },
  { id: "m-5", name: "Lucas Oliveira", email: "lucas@nexus.io", role: "developer", team: "Core", lastActive: "3h ago", status: "active" },
  { id: "m-6", name: "Aiko Tanaka", email: "aiko@nexus.io", role: "developer", team: "ML", lastActive: "1d ago", status: "active" },
  { id: "m-7", name: "Emma Wilson", email: "emma@nexus.io", role: "viewer", team: "Data", lastActive: "2d ago", status: "active" },
  { id: "m-8", name: "new.dev@nexus.io", email: "new.dev@nexus.io", role: "developer", team: "Frontend", lastActive: "—", status: "invited" },
]

const teams: Team[] = [
  { id: "t-1", name: "Platform", description: "Infrastructure, IDP, and developer tooling", members: 4, services: 18, lead: "Shakthi Vinayak" },
  { id: "t-2", name: "Payments", description: "Payment processing and billing workflows", members: 5, services: 6, lead: "Arjun Mehta" },
  { id: "t-3", name: "Identity", description: "Auth, SSO, and identity management", members: 3, services: 4, lead: "Sofia Chen" },
  { id: "t-4", name: "Core", description: "Core product APIs and data services", members: 6, services: 12, lead: "Lucas Oliveira" },
  { id: "t-5", name: "ML", description: "Machine learning, recommendations and models", members: 3, services: 3, lead: "Aiko Tanaka" },
  { id: "t-6", name: "Data", description: "Data pipelines, analytics and warehousing", members: 4, services: 8, lead: "Emma Wilson" },
  { id: "t-7", name: "Frontend", description: "Web apps, mobile and CDN", members: 5, services: 5, lead: "—" },
  { id: "t-8", name: "Comms", description: "Notifications, email and messaging services", members: 2, services: 3, lead: "—" },
]

const roleColors = { owner: "primary", admin: "info", developer: "success", viewer: "neutral" } as const

export function TeamsPage() {
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState<"members" | "teams">("members")

  const filteredMembers = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.team.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Teams & Access" description="RBAC, team management and SSO integration" action={{ label: activeTab === "members" ? "Invite Member" : "Create Team", onClick: () => {} }} />
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total Members", value: members.filter(m => m.status === "active").length, icon: Users, color: "hsl(var(--primary))" },
            { label: "Teams", value: teams.length, icon: Shield, color: "hsl(var(--info))" },
            { label: "Pending Invites", value: members.filter(m => m.status === "invited").length, icon: Mail, color: "hsl(var(--warning))" },
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
          {(["members", "teams"] as const).map(t => (
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
              {t === "members" ? `Members (${members.length})` : `Teams (${teams.length})`}
            </button>
          ))}
        </div>

        {activeTab === "members" && (
          <>
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "hsl(var(--muted-foreground))" }} />
              <Input placeholder="Search members..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Card>
              <div className="divide-y" style={{ borderColor: "hsl(var(--border))" }}>
                {filteredMembers.map(m => (
                  <div key={m.id} className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-surface/40">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ background: "hsl(var(--primary) / 0.15)", color: "hsl(var(--primary-glow))" }}>
                      {m.status === "invited" ? <Mail className="w-4 h-4" /> : m.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium" style={{ color: "hsl(var(--foreground))" }}>{m.name}</p>
                        {m.role === "owner" && <Crown className="w-3.5 h-3.5" style={{ color: "hsl(var(--warning))" }} />}
                      </div>
                      <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{m.email}</p>
                    </div>
                    <Badge variant={roleColors[m.role]}>{m.role}</Badge>
                    <span className="text-xs w-20 text-right" style={{ color: "hsl(var(--muted-foreground))" }}>{m.team}</span>
                    <span className="text-xs w-16 text-right" style={{ color: "hsl(var(--muted-foreground))" }}>
                      {m.status === "invited" ? <Badge variant="warning">invited</Badge> : m.lastActive}
                    </span>
                    <Button variant="ghost" size="icon-sm">
                      <MoreVertical className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

        {activeTab === "teams" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {teams.map(t => (
              <Card key={t.id} className="hover:shadow-card-hover transition-all cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{t.name}</CardTitle>
                      <p className="text-xs mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>{t.description}</p>
                    </div>
                    <Button variant="ghost" size="icon-sm">
                      <MoreVertical className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{t.members} members</span>
                      <span>{t.services} services</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "hsl(var(--primary) / 0.15)", color: "hsl(var(--primary-glow))" }}>
                        {t.lead !== "—" ? t.lead.split(" ").map(n => n[0]).join("") : "?"}
                      </div>
                      <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{t.lead}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {/* Add team card */}
            <button className="panel border-dashed flex items-center justify-center gap-2 h-28 hover:shadow-card-hover transition-all cursor-pointer" style={{ borderColor: "hsl(var(--border))" }}>
              <Plus className="w-4 h-4" style={{ color: "hsl(var(--muted-foreground))" }} />
              <span className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>Create new team</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
