import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Layout } from "@/components/Layout"
import { DashboardPage } from "@/pages/DashboardPage"
import { CatalogPage } from "@/pages/CatalogPage"
import { DeploymentsPage } from "@/pages/DeploymentsPage"
import { PipelinesPage } from "@/pages/PipelinesPage"
import { ClustersPage } from "@/pages/ClustersPage"
import { SecretsPage } from "@/pages/SecretsPage"
import { MonitoringPage } from "@/pages/MonitoringPage"
import { TeamsPage } from "@/pages/TeamsPage"
import { DocsPage } from "@/pages/DocsPage"
import { SettingsPage } from "@/pages/SettingsPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/deployments" element={<DeploymentsPage />} />
          <Route path="/pipelines" element={<PipelinesPage />} />
          <Route path="/clusters" element={<ClustersPage />} />
          <Route path="/secrets" element={<SecretsPage />} />
          <Route path="/monitoring" element={<MonitoringPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
