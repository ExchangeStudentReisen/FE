// api/auth.ts
import { fetchApi } from './client'
import type { ApiResponse } from '../types/api'
import type { PendingData, SignupPayload, ReissuePayload, TokenPair, SignupResponseData, MeData } from '../types/auth'

export function getPending(key: string) {
  return fetchApi<ApiResponse<PendingData>>(`/api/auth/pending?key=${key}`)
}

export function signup(payload: SignupPayload) {
  return fetchApi<ApiResponse<SignupResponseData>>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  })
}

export function reissue(payload: ReissuePayload) {
  return fetchApi<ApiResponse<TokenPair>>('/api/auth/reissue', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  })
}

export function logout() {
  return fetchApi<ApiResponse<string>>('/api/auth/logout', {
    method: 'POST',
  })
}

export function getMe() {
  return fetchApi<ApiResponse<MeData>>('/api/auth/me')
}