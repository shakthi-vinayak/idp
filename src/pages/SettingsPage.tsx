import { useState } from "react"
import { TopBar } from "@/components/TopBar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Settings, Globe, Bell, Shield, Key, GitBranch, Webhook, ChevronRight, Check, ToggleLeft, ToggleRight } from "lucide-react"

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-4 border-b last:border-0" style={{ borderColor: "hsl(var(--border) / 0.5)" }}>
      <div className="flex-1 pr-8">
        <p className="text-sm font-medium" style={{ color: "hsl(var(--foreground))" }}>{label}</p>
        {description && <p className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{description}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  )
}

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className="transition-colors" style={{ color: enabled ? "hsl(var(--success))" : "hsl(var(--muted-foreground))" }}>
      {enabled ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
    </button>
  )
}

const integrations = [
  { name: "GitHub", desc: "Source control and PR-triggered pipelines", status: "connected" as const, icon: "🐙" },
  { name: "Slack", desc: "Deployment and alert notifications", status: "connected" as const, icon: "💬" },
  { name: "PagerDuty", desc: "On-call escalation and incident management", status: "connected" as const, icon: "📟" },
  { name: "Datadog", desc: "APM, metrics forwarding and log shipping", status: "disconnected" as const, icon: "🐶" },
  { name: "HashiCorp Vault", desc: "External secret management backend", status: "connected" as const, icon: "🔐" },
  { name: "Okta SSO", desc: "Enterprise single sign-on and directory sync", status: "connected" as const, icon: "🔑" },
  { name: "Jira", desc: "Issue tracking and change management", status: "disconnected" as const, icon: "📋" },
  { name: "Backstage", desc: "Export catalog to Backstage portal", status: "disconnected" as const, icon: "🎭" },
]

const settingsSections = [
  { id: "general", label: "General", icon: Settings },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security & SSO", icon: Shield },
  { id: "git", label: "Git Providers", icon: GitBranch },
  { id: "integrations", label: "Integrations", icon: Webhook },
  { id: "api", label: "API Keys", icon: Key },
]

export function SettingsPage() {
  const [activeSection, setActiveSection] = useState("general")
  const [notifications, setNotifications] = useState({ deploys: true, failures: true, alerts: true, weeklySummary: false })
  const [security, setSecurity] = useState({ mfa: true, sso: true, auditLog: true, ipAllowlist: false })

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Settings" description="Platform configuration, integrations and security" />
      <div className="flex-1 overflow-hidden flex">
        {/* Settings nav */}
        <div className="w-52 flex-shrink-0 border-r p-3 space-y-0.5" style={{ borderColor: "hsl(var(--border))" }}>
          {settingsSections.map(s => (
            <button
              key={s.id}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors"
              style={{
                background: activeSection === s.id ? "hsl(var(--sidebar-item-active))" : "transparent",
                color: activeSection === s.id ? "hsl(var(--primary-glow))" : "hsl(var(--muted-foreground))",
              }}
              onClick={() => setActiveSection(s.id)}
            >
              <s.icon className="w-4 h-4" />
              {s.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {activeSection === "general" && (
            <>
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Globe className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} />Platform Identity</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <SettingRow label="Platform Name" description="Displayed in navigation and emails">
                    <Input defaultValue="NexusIDP" className="w-44" />
                  </SettingRow>
                  <SettingRow label="Organization" description="Your organization's canonical name">
                    <Input defaultValue="nexus-corp" className="w-44" />
                  </SettingRow>
                  <SettingRow label="Default Environment" description="Environment applied to new services">
                    <select className="text-sm px-3 py-2 rounded-lg border" style={{ background: "hsl(var(--surface))", borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }}>
                      <option>production</option>
                      <option>staging</option>
                      <option>development</option>
                    </select>
                  </SettingRow>
                  <div className="pt-2">
                    <Button variant="gradient" size="sm">Save Changes</Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeSection === "notifications" && (
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="w-4 h-4" style={{ color: "hsl(var(--warning))" }} />Notification Preferences</CardTitle></CardHeader>
              <CardContent>
                <SettingRow label="Deployment Events" description="Notify on every successful or failed deployment">
                  <Toggle enabled={notifications.deploys} onChange={() => setNotifications(n => ({ ...n, deploys: !n.deploys }))} />
                </SettingRow>
                <SettingRow label="Build Failures" description="Immediate alert on CI/CD pipeline failures">
                  <Toggle enabled={notifications.failures} onChange={() => setNotifications(n => ({ ...n, failures: !n.failures }))} />
                </SettingRow>
                <SettingRow label="Active Alerts" description="Propagate monitoring alerts to Slack and email">
                  <Toggle enabled={notifications.alerts} onChange={() => setNotifications(n => ({ ...n, alerts: !n.alerts }))} />
                </SettingRow>
                <SettingRow label="Weekly Summary Report" description="Sunday digest of deployments, incidents and metrics">
                  <Toggle enabled={notifications.weeklySummary} onChange={() => setNotifications(n => ({ ...n, weeklySummary: !n.weeklySummary }))} />
                </SettingRow>
              </CardContent>
            </Card>
          )}

          {activeSection === "security" && (
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="w-4 h-4" style={{ color: "hsl(var(--success))" }} />Security & Compliance</CardTitle></CardHeader>
              <CardContent>
                <SettingRow label="Enforce MFA" description="Require multi-factor authentication for all members">
                  <Toggle enabled={security.mfa} onChange={() => setSecurity(s => ({ ...s, mfa: !s.mfa }))} />
                </SettingRow>
                <SettingRow label="Okta SSO" description="Enforce Okta single sign-on for all logins">
                  <Toggle enabled={security.sso} onChange={() => setSecurity(s => ({ ...s, sso: !s.sso }))} />
                </SettingRow>
                <SettingRow label="Audit Log" description="Retain all user actions for 90 days">
                  <Toggle enabled={security.auditLog} onChange={() => setSecurity(s => ({ ...s, auditLog: !s.auditLog }))} />
                </SettingRow>
                <SettingRow label="IP Allowlist" description="Restrict access to specific CIDR ranges">
                  <Toggle enabled={security.ipAllowlist} onChange={() => setSecurity(s => ({ ...s, ipAllowlist: !s.ipAllowlist }))} />
                </SettingRow>
              </CardContent>
            </Card>
          )}

          {activeSection === "integrations" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {integrations.map(i => (
                <Card key={i.name} className="hover:shadow-card-hover transition-all">
                  <CardContent className="p-4 flex items-center gap-4">
                    <span className="text-2xl">{i.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold" style={{ color: "hsl(var(--foreground))" }}>{i.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{i.desc}</p>
                    </div>
                    {i.status === "connected"
                      ? <Badge variant="success"><Check className="w-3 h-3" />Connected</Badge>
                      : <Button variant="outline" size="sm">Connect</Button>}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeSection === "api" && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2"><Key className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} />API Keys</CardTitle>
                  <Button variant="gradient" size="sm">Generate Key</Button>
                </div>
              </CardHeader>
              <CardContent>
                {[
                  { name: "CI/CD Pipeline Key", created: "30d ago", lastUsed: "2m ago", scopes: ["deploy", "read"] },
                  { name: "Monitoring Integration", created: "60d ago", lastUsed: "1h ago", scopes: ["read"] },
                  { name: "Terraform Provider", created: "90d ago", lastUsed: "1d ago", scopes: ["deploy", "admin"] },
                ].map(k => (
                  <SettingRow key={k.name} label={k.name} description={`Created ${k.created} · Last used ${k.lastUsed}`}>
                    <div className="flex items-center gap-2">
                      {k.scopes.map(s => <Badge key={s} variant="neutral">{s}</Badge>)}
                      <Button variant="destructive" size="sm">Revoke</Button>
                    </div>
                  </SettingRow>
                ))}
              </CardContent>
            </Card>
          )}

          {activeSection === "git" && (
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><GitBranch className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} />Git Provider Configuration</CardTitle></CardHeader>
              <CardContent>
                <SettingRow label="GitHub App" description="Connected to github.com/nexus-corp · 248 repos">
                  <Badge variant="success"><Check className="w-3 h-3" />Connected</Badge>
                </SettingRow>
                <SettingRow label="Default Branch" description="Branch to trigger production deployments">
                  <Input defaultValue="main" className="w-32" />
                </SettingRow>
                <SettingRow label="Auto-deploy on push" description="Deploy automatically when changes merge to default branch">
                  <Badge variant="success">Enabled</Badge>
                </SettingRow>
                <div className="pt-2">
                  <Button variant="outline" size="sm">Reconfigure GitHub App</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
