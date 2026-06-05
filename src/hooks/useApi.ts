import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  api,
  type Service, type Deployment, type Secret, type Cluster,
  type PipelineRun, type Team, type Member, type MonitoringMetrics, type ApiMessage,
} from '@/lib/api'

// ── Services ──────────────────────────────────────────
export function useServices(params?: { type?: string; status?: string; search?: string }) {
  const qs = new URLSearchParams()
  if (params?.type) qs.set('type', params.type)
  if (params?.status) qs.set('status', params.status)
  if (params?.search) qs.set('search', params.search)
  const query = qs.toString()
  return useQuery<Service[]>({
    queryKey: ['services', params],
    queryFn: () => api.get(`/services${query ? `?${query}` : ''}`),
  })
}

export function useService(id: string) {
  return useQuery<Service>({
    queryKey: ['services', id],
    queryFn: () => api.get(`/services/${id}`),
    enabled: !!id,
  })
}

// ── Deployments ───────────────────────────────────────
export function useDeployments(params?: { environment?: string; status?: string }) {
  const qs = new URLSearchParams()
  if (params?.environment) qs.set('environment', params.environment)
  if (params?.status) qs.set('status', params.status)
  const query = qs.toString()
  return useQuery<Deployment[]>({
    queryKey: ['deployments', params],
    queryFn: () => api.get(`/deployments${query ? `?${query}` : ''}`),
  })
}

export function useRetryDeployment() {
  const qc = useQueryClient()
  return useMutation<ApiMessage, Error, string>({
    mutationFn: (id: string) => api.post(`/deployments/${id}/retry`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['deployments'] }),
  })
}

export function useRollbackDeployment() {
  const qc = useQueryClient()
  return useMutation<ApiMessage, Error, string>({
    mutationFn: (id: string) => api.post(`/deployments/${id}/rollback`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['deployments'] }),
  })
}

// ── Pipelines ─────────────────────────────────────────
export function usePipelineRuns() {
  return useQuery<PipelineRun[]>({
    queryKey: ['pipeline-runs'],
    queryFn: () => api.get('/pipelines/runs'),
  })
}

export function useRetryPipeline() {
  const qc = useQueryClient()
  return useMutation<ApiMessage, Error, string>({
    mutationFn: (id: string) => api.post(`/pipelines/runs/${id}/retry`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pipeline-runs'] }),
  })
}

export function useCancelPipeline() {
  const qc = useQueryClient()
  return useMutation<ApiMessage, Error, string>({
    mutationFn: (id: string) => api.post(`/pipelines/runs/${id}/cancel`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pipeline-runs'] }),
  })
}

// ── Clusters ──────────────────────────────────────────
export function useClusters() {
  return useQuery<Cluster[]>({
    queryKey: ['clusters'],
    queryFn: () => api.get('/clusters'),
  })
}

export function useCluster(id: string) {
  return useQuery<Cluster>({
    queryKey: ['clusters', id],
    queryFn: () => api.get(`/clusters/${id}`),
    enabled: !!id,
  })
}

// ── Secrets ───────────────────────────────────────────
export function useSecrets() {
  return useQuery<Secret[]>({
    queryKey: ['secrets'],
    queryFn: () => api.get('/secrets'),
  })
}

export function useRotateSecret() {
  const qc = useQueryClient()
  return useMutation<ApiMessage, Error, string>({
    mutationFn: (id: string) => api.post(`/secrets/${id}/rotate`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['secrets'] }),
  })
}

// ── Monitoring ────────────────────────────────────────
export function useMonitoring() {
  return useQuery<MonitoringMetrics>({
    queryKey: ['monitoring'],
    queryFn: () => api.get('/monitoring/metrics'),
    refetchInterval: 30000,
  })
}

// ── Teams ─────────────────────────────────────────────
export function useTeams() {
  return useQuery<Team[]>({
    queryKey: ['teams'],
    queryFn: () => api.get('/teams'),
  })
}

export function useMembers() {
  return useQuery<Member[]>({
    queryKey: ['members'],
    queryFn: () => api.get('/teams/members'),
  })
}
