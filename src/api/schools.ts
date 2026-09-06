import { fetchApi } from './client'
import type { ApiResponse } from '../types/api'
import type { School } from '../types/school'

export function getSchools() {
  return fetchApi<ApiResponse<School[]>>('/api/schools')
}