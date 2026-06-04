# NexusIDP — Enterprise Internal Developer Platform

> A production-grade Internal Developer Platform (IDP) inspired by [Northflank](https://northflank.com/blog/top-six-internal-developer-platforms), built to give engineering teams a unified self-service layer over their infrastructure, deployments, pipelines, secrets, and observability.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Screenshots](#screenshots)
3. [Features](#features)
4. [Tech Stack](#tech-stack)
5. [Project Architecture](#project-architecture)
6. [Design System](#design-system)
7. [Implementation Guide](#implementation-guide)
8. [Usage Guide](#usage-guide)
9. [Page Reference](#page-reference)
10. [Configuration](#configuration)
11. [Deployment](#deployment)
12. [Contributing](#contributing)

---

## Project Overview

NexusIDP is an enterprise-grade Internal Developer Platform (IDP) that abstracts the complexity of cloud infrastructure and Kubernetes from application developers. It provides a single pane of glass for:

- **Self-service deployments** via GitOps — push to `main`, ship to production
- **Service catalog** — discover every microservice, its owner, version, and health
- **CI/CD pipeline management** — visualize build stages, failures, and rollbacks
- **Cluster observability** — real-time CPU, memory, pod health across all environments
- **Secrets and configuration** — centralized secret rotation with expiry tracking
- **Platform monitoring** — P50/P95/P99 latency, error rates, alert management
- **Team RBAC** — fine-grained roles, SSO integration, and audit trails

This platform is modeled after the best practices documented by Northflank and reduces the cognitive load on developers by providing a curated, opinionated developer experience over raw Kubernetes.

---

## Screenshots

| Dashboard | Service Catalog |
|-----------|----------------|
| Real-time cluster health, deploy charts, and activity feed | 12+ microservices with filtering, ownership, and status |

| Deployments | CI/CD Pipelines |
|-------------|----------------|
| Environment-scoped rollout table with expandable detail | Visual stage-by-stage pipeline runs with retry/cancel |

| Monitoring | Secrets & Config |
|------------|-----------------|
| Latency percentiles, error rates, pod restarts, active alerts | Masked secret values, rotation tracking, expiry warnings |

---

## Features

### Platform Dashboard
- Live cluster uptime SLA badge with animated status indicator
- 24-hour deployment success/failure area charts
- Request throughput graph (req/s)
- Per-cluster CPU and memory progress bars
- Recent activity feed with actor attribution (CI/CD, Vault, Auto-scale, PRs)

### Service Catalog
- Register and discover all microservices across teams
- Filter by type: `api`, `worker`, `frontend`, `database`, `ml`
- Search by name, description, team, or tags
- Starred services for quick access
- Per-service metadata: language, version, uptime %, replica count, last deploy

### Deployments
- Full deployment history per environment (production / staging / development)
- Expandable rows showing branch, commit SHA, container image, and rollback action
- Status: `succeeded`, `failed`, `rolling`, `pending`
- One-click rollback on failed deployments

### CI/CD Pipelines
- Visual pipeline stage graph: Checkout → Build → Test → Scan → Deploy
- Animated running/spinning stage indicators
- Pipeline template library (full-deploy, pr-checks, hotfix, nightly-scan)
- Retry failed runs; cancel in-progress runs

### Kubernetes Clusters
- Multi-cluster overview (AWS us-east-1, AWS eu-west-2, GCP us-central1)
- Expandable node tables with role, zone, CPU %, memory %, pod count
- Health status: `healthy` / `warning` / `critical`
- Per-cluster resource utilization bars

### Secrets & Configuration
- Masked secret values with toggle-to-reveal and one-click copy
- Type classification: `env`, `tls`, `registry`, `ssh`, `opaque`
- Scope: `global` / `project` / `service`
- Expiry tracking with `active` / `expiring` / `expired` status badges
- One-click rotation button per secret
- ConfigMaps view with key counts and service binding

### Monitoring & Observability
- P50 / P95 / P99 API latency area charts (24h)
- Platform-wide error rate chart
- Pod restart bar chart ranked by service
- Active alert list with severity: `critical`, `warning`, `info`
- Alert resolution tracking

### Teams & RBAC
- Member directory with role assignment: `owner`, `admin`, `developer`, `viewer`
- Team cards with service ownership and lead attribution
- Pending invite tracking
- Per-team service count and membership

### Documentation
- Searchable documentation hub with 6 category sections
- Article-level read time and last-updated metadata
- Starred articles for quick reference
- Sections: Getting Started, Deployments & Pipelines, Security, Service Catalog, Observability, Infrastructure

### Settings
- Platform identity configuration (name, org slug, default environment)
- Notification preference toggles (deploys, failures, alerts, weekly digest)
- Security controls: MFA enforcement, SSO, audit log, IP allowlist
- Integration panel: GitHub, Slack, PagerDuty, Datadog, Vault, Okta, Jira, Backstage
- API key management with scope badges and revocation
- Git provider configuration (GitHub App, default branch, auto-deploy)

---

## Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **UI Framework** | React | 18.3.1 | Component rendering and state management |
| **Build Tool** | Vite | 6.0.5 | Fast HMR dev server and optimized production builds |
| **Language** | TypeScript | 5.6.2 | Full static type safety across all components |
| **Styling** | Tailwind CSS | 3.4.17 | Utility-first CSS with custom design tokens |
| **Routing** | React Router DOM | 7.1.1 | Client-side navigation with nested layouts |
| **Charts** | Recharts | 2.13.0 | Area, bar charts for metrics visualization |
| **Icons** | Lucide React | 0.468.0 | Consistent SVG icon set |
| **Class Utilities** | clsx + tailwind-merge | 2.x | Safe conditional class composition |
| **Variant System** | class-variance-authority | 0.7.1 | Type-safe component variant definitions |
| **Animations** | tailwindcss-animate | 1.0.7 | CSS keyframe animation utilities |
| **Post-processing** | PostCSS + Autoprefixer | 8.x / 10.x | CSS vendor prefix automation |

### Why this stack?

- **Vite over CRA/Webpack** — sub-second HMR, native ESM, 10–100× faster cold starts
- **Tailwind over CSS Modules** — design tokens enforced at the utility level, zero dead CSS
- **React Router v7** — nested `<Outlet>` layouts mean the sidebar renders once, pages slot in
- **Recharts** — composable SVG charts with built-in responsive containers; no canvas API needed
- **CVA** — `buttonVariants` and similar patterns give type-safe component APIs without prop drilling

---

## Project Architecture

```
idp/
├── public/
│   └── images/                    # Generated platform imagery
│       ├── hero-banner.png         # Dashboard hero visualization
│       ├── pipeline-visual.png     # Pipeline section banner
│       └── service-catalog.png     # Catalog section banner
│
├── src/
│   ├── main.tsx                   # React root mount
│   ├── App.tsx                    # BrowserRouter + all route definitions
│   ├── index.css                  # Design system: CSS custom properties, base styles, utilities
│   ├── vite-env.d.ts              # Vite/TypeScript environment types
│   │
│   ├── lib/
│   │   └── utils.ts               # cn() helper — clsx + tailwind-merge
│   │
│   ├── components/
│   │   ├── Layout.tsx             # Shell: Sidebar + <Outlet /> main area
│   │   ├── Sidebar.tsx            # Navigation sidebar with grouped nav items
│   │   ├── TopBar.tsx             # Per-page header with title, description, CTA
│   │   └── ui/                    # Primitive design-system components
│   │       ├── badge.tsx          # Status badges (success/warning/destructive/info)
│   │       ├── button.tsx         # Button with variants (default/gradient/outline/ghost…)
│   │       ├── card.tsx           # Card, CardHeader, CardTitle, CardContent, CardFooter
│   │       ├── input.tsx          # Styled text input
│   │       ├── progress.tsx       # Thin progress bar (success/warning/destructive)
│   │       └── table.tsx          # Table, TableHeader, TableRow, TableHead, TableCell
│   │
│   └── pages/
│       ├── DashboardPage.tsx      # /          — Platform overview
│       ├── CatalogPage.tsx        # /catalog   — Service registry
│       ├── DeploymentsPage.tsx    # /deployments — Deployment history
│       ├── PipelinesPage.tsx      # /pipelines — CI/CD pipeline runs
│       ├── ClustersPage.tsx       # /clusters  — K8s cluster management
│       ├── SecretsPage.tsx        # /secrets   — Secret & config management
│       ├── MonitoringPage.tsx     # /monitoring — Observability dashboards
│       ├── TeamsPage.tsx          # /teams     — Member & team RBAC
│       ├── DocsPage.tsx           # /docs      — Documentation hub
│       └── SettingsPage.tsx       # /settings  — Platform configuration
│
├── index.html                     # Entry HTML — loads Inter + JetBrains Mono fonts
├── package.json
├── vite.config.ts                 # Path alias: @/ → src/
├── tailwind.config.ts             # Extended theme: colors, shadows, animations, fonts
├── tsconfig.app.json              # Strict TypeScript config
└── postcss.config.js
```

### Routing architecture

```
BrowserRouter
└── <Layout>          ← renders once: Sidebar + TopBar shell
    ├── /             → DashboardPage
    ├── /catalog      → CatalogPage
    ├── /deployments  → DeploymentsPage
    ├── /pipelines    → PipelinesPage
    ├── /clusters     → ClustersPage
    ├── /secrets      → SecretsPage
    ├── /monitoring   → MonitoringPage
    ├── /teams        → TeamsPage
    ├── /docs         → DocsPage
    ├── /settings     → SettingsPage
    └── *             → Navigate to /
```

### Component hierarchy

```
App.tsx
└── Layout.tsx
    ├── Sidebar.tsx               ← NavLink groups (Platform / Infrastructure / Org)
    └── <Outlet />                ← Page component renders here
        └── [AnyPage].tsx
            ├── TopBar.tsx        ← Title + description + optional CTA button
            └── [page content]
                ├── ui/card.tsx
                ├── ui/badge.tsx
                ├── ui/button.tsx
                ├── ui/table.tsx
                ├── ui/progress.tsx
                └── recharts/*
```

---

## Design System

The design system is defined entirely in `src/index.css` (CSS custom properties) and `tailwind.config.ts` (token extension). **No raw color values appear in component files.**

### Color palette

| Token | Value | Usage |
|-------|-------|-------|
| `--primary` | `239 84% 67%` (Electric Violet) | Brand color, active nav, buttons |
| `--primary-glow` | `252 100% 75%` | Hover states, glow effects |
| `--background` | `222 28% 7%` (Deep Navy) | Page background |
| `--card` | `222 24% 10%` | Panel surfaces |
| `--surface` | `222 22% 12%` | Inset surfaces, hover targets |
| `--success` | `142 71% 45%` (Green) | Healthy, succeeded |
| `--warning` | `38 92% 50%` (Amber) | Degraded, expiring, staging |
| `--destructive` | `0 72% 58%` (Red) | Failed, expired, critical |
| `--info` | `199 89% 56%` (Cyan) | Rolling, info alerts |
| `--muted-foreground` | `215 16% 47%` | Secondary text, labels |
| `--sidebar` | `222 32% 6%` | Sidebar background |

### Semantic CSS classes (defined in `@layer components`)

| Class | Description |
|-------|-------------|
| `.panel` | Standard card surface with border + shadow |
| `.nav-item` | Sidebar navigation item with hover/active states |
| `.badge-success/warning/destructive/info/neutral` | Status badges |
| `.code-text` | Monospace highlighted inline code (commit hashes, versions) |
| `.section-title` | All-caps label for nav groups and form sections |
| `.metric-value` | Large bold number for KPI cards |
| `.live-dot` | Animated green pulse indicator |

### Typography

- **UI font**: Inter (400/500/600/700/800) — loaded from Google Fonts
- **Code/mono**: JetBrains Mono (400/500) — used for service names, versions, commits
- **Scale**: 12px / 14px / 16px / 18px / 24px / 30px

---

## Implementation Guide

### Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js | ≥ 18.x |
| npm | ≥ 9.x |
| Git | any recent version |

### 1. Clone the repository

```bash
git clone https://github.com/shakthi-vinayak/idp.git
cd idp
```

### 2. Install dependencies

```bash
npm install
```

> If you are behind a corporate proxy or encounter SSL certificate errors, run:
> ```bash
> npm install --strict-ssl=false
> ```

### 3. Start the development server

```bash
npm run dev
```

The app will be available at **http://localhost:5173**

Hot Module Replacement (HMR) is enabled — changes to any `.tsx` or `.css` file reflect instantly without a full page reload.

### 4. Build for production

```bash
npm run build
```

Output is written to `dist/`. The build includes:
- Tree-shaken, minified JavaScript bundles
- Purged Tailwind CSS (only used utilities are included)
- Static assets copied from `public/`

### 5. Preview the production build locally

```bash
npm run preview
```

Serves the `dist/` folder at **http://localhost:4173**

### 6. Type checking

```bash
npx tsc --noEmit
```

Runs the TypeScript compiler in check-only mode without emitting files. Zero errors expected on a clean checkout.

---

## Usage Guide

### Navigating the platform

The left sidebar is always visible and organizes navigation into three groups:

**Platform**
- `Dashboard` — start here for a real-time health overview
- `Service Catalog` — find any service, its owner, and current status
- `Deployments` — track what shipped when, and to which environment
- `Pipelines` — monitor CI/CD pipeline runs and their individual stages

**Infrastructure**
- `Clusters` — drill into Kubernetes clusters and node-level resource usage
- `Secrets & Config` — manage environment variables, TLS certs, and registry tokens
- `Monitoring` — latency percentiles, error rates, pod restarts, and active alerts

**Organization**
- `Teams` — manage members, roles, and team ownership
- `Documentation` — searchable runbooks, guides, and API references
- `Settings` — platform configuration, integrations, and security policies

### Project selector

The top of the sidebar shows a project selector (currently set to **Production**). In a production integration this would switch between workspace contexts (e.g. different business units or environments).

### Search

Each page has a contextual search bar filtering the visible dataset. The Documentation page has a global full-text search across all article titles and categories.

### Expandable rows

On the **Deployments** page, click any row to expand it and reveal:
- Git branch and commit SHA
- Full container image reference
- **View Logs** button
- **Rollback** button (only shown on failed deployments)

### Pipeline stage graph

On the **Pipelines** page, each run shows a horizontal stage-by-stage graph. Stage states are color-coded:
- Green checkmark = succeeded
- Red X = failed (stops pipeline)
- Blue spinning = currently running
- Grey clock = pending
- Grey arrow = skipped (downstream of a failure)

### Secrets reveal

On the **Secrets & Config** page, all secret values are masked by default. Click the eye icon on any row to toggle visibility. The copy icon copies the value to your clipboard.

### Settings toggles

On the **Settings → Notifications** and **Settings → Security** panels, toggle switches update immediately (client state). In a real integration these would `PATCH` a `/api/settings` endpoint.

---

## Page Reference

| Path | Component | Data shown |
|------|-----------|-----------|
| `/` | `DashboardPage` | 4 KPI cards, 2 area charts, 4 cluster health panels, 6 recent activity items |
| `/catalog` | `CatalogPage` | 12 services, type/status filters, starred filter, search |
| `/deployments` | `DeploymentsPage` | 8 deployments, expandable detail rows, env/status filter |
| `/pipelines` | `PipelinesPage` | 4 pipeline runs with stage graphs + 4 pipeline templates |
| `/clusters` | `ClustersPage` | 4 clusters, 13 total nodes, expandable node tables |
| `/secrets` | `SecretsPage` | 10 secrets with masking/rotation + 4 ConfigMaps |
| `/monitoring` | `MonitoringPage` | 3 charts (latency, error rate, pod restarts) + 5 alerts |
| `/teams` | `TeamsPage` | 8 members + 8 teams with leads and service counts |
| `/docs` | `DocsPage` | 6 documentation sections × 4 articles each, full-text search |
| `/settings` | `SettingsPage` | 6 settings sections: General, Notifications, Security, Git, Integrations, API Keys |

---

## Configuration

### Path aliases

`@/` maps to `src/` via Vite's `resolve.alias`. Use it everywhere:

```tsx
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
```

### Adding a new page

1. Create `src/pages/MyPage.tsx`
2. Add a route in `src/App.tsx`:
   ```tsx
   import { MyPage } from "@/pages/MyPage"
   // inside <Route element={<Layout />}>
   <Route path="/my-page" element={<MyPage />} />
   ```
3. Add a nav item in `src/components/Sidebar.tsx`:
   ```tsx
   { label: "My Page", to: "/my-page", icon: SomeIcon }
   ```

### Adding a new design token

1. Define the HSL value in `src/index.css` under `:root`:
   ```css
   --my-color: 270 80% 60%;
   ```
2. Register it in `tailwind.config.ts`:
   ```ts
   colors: {
     "my-color": "hsl(var(--my-color))",
   }
   ```
3. Use it in components:
   ```tsx
   style={{ color: "hsl(var(--my-color))" }}
   // or
   className="text-my-color"
   ```

### Connecting real APIs

All data is currently hardcoded in each page file as TypeScript arrays. To connect a real backend:

1. Create `src/hooks/useDeployments.ts` (or similar) using `fetch` / `axios` / `react-query`
2. Replace the static array in the page component with the hook's returned data
3. Add loading skeletons and error states using the existing `panel` and `badge-*` CSS classes

---

## Deployment

### Vercel (recommended)

```bash
npm install -g vercel
vercel --prod
```

Vercel auto-detects the Vite config and sets the output directory to `dist/`.

### Netlify

```bash
npm run build
# drag-and-drop the dist/ folder to app.netlify.com
# or use netlify-cli:
npx netlify-cli deploy --prod --dir=dist
```

### Docker

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
docker build -t nexus-idp .
docker run -p 8080:80 nexus-idp
```

### GitHub Pages

Add to `vite.config.ts`:
```ts
export default defineConfig({
  base: "/idp/",   // matches your repo name
  // ...
})
```

Then push to the `gh-pages` branch using `gh-pages` npm package or GitHub Actions.

---

## Contributing

### Branch convention

```
feat/   — new feature or page
fix/    — bug fix
chore/  — tooling, deps, refactoring
docs/   — documentation only
```

### Commit format

```
feat(catalog): add service dependency graph view
fix(deployments): resolve React key prop warning on expanded rows
chore: upgrade recharts to v3
```

### Pull request checklist

- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] All new components use design system tokens (no raw hex/rgb values in JSX)
- [ ] New pages are registered in `App.tsx` and `Sidebar.tsx`
- [ ] No `console.log` left in production code

---

## Acknowledgements

- Design inspired by [Northflank IDP](https://northflank.com), [Linear](https://linear.app), and [Stripe Dashboard](https://stripe.com)
- IDP concepts and feature set informed by the [Northflank top six IDPs blog post](https://northflank.com/blog/top-six-internal-developer-platforms)
- Built with the [Qoder](https://qoder.com) AI coding assistant

---

*NexusIDP v1.0.0 — Enterprise Internal Developer Platform*
