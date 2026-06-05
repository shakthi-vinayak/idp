import { useState } from "react"
import { TopBar } from "@/components/TopBar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LoadingState, ErrorState } from "@/components/LoadingErrorStates"
import { useTeams, useMembers } from "@/hooks/useApi"
import { Users, Shield, Plus, Search, Mail, MoreVertical, Crown } from "lucide-react"

const roleColors = { owner: "primary", admin: "info", developer: "success", viewer: "neutral" } as const

export function TeamsPage() {
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState<"members" | "teams">("members")

  const { data: members = [], isLoading: membersLoading, isError: membersError, error: membersErr, refetch: refetchMembers } = useMembers()
  const { data: teams = [], isLoading: teamsLoading, isError: teamsError, error: teamsErr, refetch: refetchTeams } = useTeams()

  const filteredMembers = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.team.toLowerCase().includes(search.toLowerCase())
  )

  const isLoading = activeTab === "members" ? membersLoading : teamsLoading
  const isError = activeTab === "members" ? membersError : teamsError
  const errorMsg = activeTab === "members" ? membersErr : teamsErr
  const refetch = activeTab === "members" ? refetchMembers : refetchTeams

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Teams & Access" description="RBAC, team management and SSO integration" action={{ label: activeTab === "members" ? "Invite Member" : "Create Team", onClick: () => {} }} />
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
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

        {isLoading && <LoadingState />}
        {isError && <ErrorState message={errorMsg?.message || "Unknown error"} onRetry={() => refetch()} />}

        {!isLoading && !isError && activeTab === "members" && (
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
                    <Badge variant={roleColors[m.role as keyof typeof roleColors] || "neutral"}>{m.role}</Badge>
                    <span className="text-xs w-20 text-right" style={{ color: "hsl(var(--muted-foreground))" }}>{m.team}</span>
                    <span className="text-xs w-16 text-right" style={{ color: "hsl(var(--muted-foreground))" }}>
                      {m.status === "invited" ? <Badge variant="warning">invited</Badge> : m.lastActive}
                    </span>
                    <Button variant="ghost" size="icon-sm"><MoreVertical className="w-3.5 h-3.5" /></Button>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

        {!isLoading && !isError && activeTab === "teams" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {teams.map(t => (
              <Card key={t.id} className="hover:shadow-card-hover transition-all cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{t.name}</CardTitle>
                      <p className="text-xs mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>{t.description}</p>
                    </div>
                    <Button variant="ghost" size="icon-sm"><MoreVertical className="w-3.5 h-3.5" /></Button>
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
