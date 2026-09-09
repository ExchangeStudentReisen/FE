import { fetchApi } from './client'
import type { ApiResponse } from '../types/api'
import type { School, DomainReportPayload } from '../types/school'

export function getSchools() {
  return fetchApi<ApiResponse<School[]>>('/api/schools')
}

export function reportDomain(id: number, payload: DomainReportPayload) {
  return fetchApi<ApiResponse<string>>(`/api/schools/${id}/domain-reports`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  })
}