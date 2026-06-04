import { TopBar } from "@/components/TopBar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, ExternalLink, Clock, Search, Star, ChevronRight, FileText, GitBranch, Shield, Boxes, Activity, Server } from "lucide-react"
import { useState } from "react"

const docSections = [
  {
    id: "getting-started",
    icon: BookOpen,
    title: "Getting Started",
    color: "hsl(var(--primary))",
    articles: [
      { title: "Platform Overview", updated: "2d ago", readTime: "5 min", starred: true },
      { title: "Onboarding Checklist", updated: "1w ago", readTime: "8 min", starred: false },
      { title: "Deploying Your First Service", updated: "3d ago", readTime: "12 min", starred: true },
      { title: "CLI Quickstart", updated: "1w ago", readTime: "4 min", starred: false },
    ],
  },
  {
    id: "deployments",
    icon: GitBranch,
    title: "Deployments & Pipelines",
    color: "hsl(var(--success))",
    articles: [
      { title: "GitOps Workflow Guide", updated: "3d ago", readTime: "10 min", starred: false },
      { title: "Pipeline YAML Reference", updated: "1d ago", readTime: "15 min", starred: true },
      { title: "Canary Deployments", updated: "5d ago", readTime: "8 min", starred: false },
      { title: "Rollback Strategies", updated: "1w ago", readTime: "6 min", starred: false },
    ],
  },
  {
    id: "security",
    icon: Shield,
    title: "Security & Secrets",
    color: "hsl(var(--warning))",
    articles: [
      { title: "Secret Rotation Policy", updated: "1w ago", readTime: "7 min", starred: false },
      { title: "RBAC Configuration", updated: "4d ago", readTime: "10 min", starred: false },
      { title: "Network Policies", updated: "2w ago", readTime: "12 min", starred: false },
      { title: "Compliance Checklist", updated: "1w ago", readTime: "9 min", starred: false },
    ],
  },
  {
    id: "catalog",
    icon: Boxes,
    title: "Service Catalog",
    color: "hsl(var(--info))",
    articles: [
      { title: "Registering a Service", updated: "3d ago", readTime: "5 min", starred: false },
      { title: "Service Ownership Model", updated: "1w ago", readTime: "6 min", starred: false },
      { title: "Adding Service Metadata", updated: "5d ago", readTime: "4 min", starred: false },
      { title: "Dependency Mapping", updated: "2w ago", readTime: "8 min", starred: false },
    ],
  },
  {
    id: "monitoring",
    icon: Activity,
    title: "Observability",
    color: "hsl(var(--destructive))",
    articles: [
      { title: "SLO & SLA Definition", updated: "1w ago", readTime: "10 min", starred: false },
      { title: "Alert Rule Reference", updated: "2d ago", readTime: "8 min", starred: false },
      { title: "Log Aggregation Setup", updated: "1w ago", readTime: "6 min", starred: false },
      { title: "Distributed Tracing", updated: "3w ago", readTime: "12 min", starred: false },
    ],
  },
  {
    id: "infra",
    icon: Server,
    title: "Infrastructure",
    color: "hsl(var(--primary-glow))",
    articles: [
      { title: "Cluster Provisioning Guide", updated: "1w ago", readTime: "15 min", starred: false },
      { title: "Auto-scaling Policies", updated: "3d ago", readTime: "8 min", starred: false },
      { title: "Namespace Management", updated: "2w ago", readTime: "5 min", starred: false },
      { title: "Resource Quotas", updated: "1w ago", readTime: "6 min", starred: false },
    ],
  },
]

export function DocsPage() {
  const [search, setSearch] = useState("")

  const allArticles = docSections.flatMap(s => s.articles.map(a => ({ ...a, section: s.title })))
  const searchResults = search.length > 1 ? allArticles.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.section.toLowerCase().includes(search.toLowerCase())
  ) : []

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Documentation" description="Platform guides, API references and runbooks" />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "hsl(var(--muted-foreground))" }} />
          <input
            className="w-full h-12 pl-12 pr-4 rounded-xl text-sm border transition-all"
            placeholder="Search documentation..."
            style={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              color: "hsl(var(--foreground))",
            }}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Search results */}
        {search.length > 1 && (
          <Card>
            <CardContent className="p-0">
              {searchResults.length === 0 ? (
                <p className="text-sm text-center py-8" style={{ color: "hsl(var(--muted-foreground))" }}>No results found for "{search}"</p>
              ) : (
                <div className="divide-y" style={{ borderColor: "hsl(var(--border))" }}>
                  {searchResults.map((a, i) => (
                    <div key={i} className="flex items-center gap-3 px-5 py-3 cursor-pointer transition-colors hover:bg-surface/40">
                      <FileText className="w-4 h-4 flex-shrink-0" style={{ color: "hsl(var(--primary))" }} />
                      <div className="flex-1">
                        <p className="text-sm font-medium" style={{ color: "hsl(var(--foreground))" }}>{a.title}</p>
                        <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{a.section} · {a.readTime}</p>
                      </div>
                      <ChevronRight className="w-4 h-4" style={{ color: "hsl(var(--muted-foreground))" }} />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Doc sections */}
        {!search && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {docSections.map(section => (
              <Card key={section.id} className="hover:shadow-card-hover transition-all">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: section.color + "15" }}>
                      <section.icon className="w-4 h-4" style={{ color: section.color }} />
                    </div>
                    <CardTitle className="text-sm">{section.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-1">
                  {section.articles.map(article => (
                    <div
                      key={article.title}
                      className="flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer transition-colors group"
                      onMouseEnter={e => (e.currentTarget.style.background = "hsl(var(--surface))")}
                      onMouseLeave={e => (e.currentTarget.style.background = "")}
                    >
                      {article.starred && <Star className="w-3 h-3 flex-shrink-0" style={{ color: "hsl(var(--warning))", fill: "hsl(var(--warning))" }} />}
                      <span className="flex-1 text-xs" style={{ color: "hsl(var(--foreground))" }}>{article.title}</span>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{article.readTime}</span>
                        <ExternalLink className="w-3 h-3" style={{ color: "hsl(var(--muted-foreground))" }} />
                      </div>
                    </div>
                  ))}
                  <div className="pt-2">
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-1 text-xs" style={{ color: section.color }}>
                      View all →
                    </Button>
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
