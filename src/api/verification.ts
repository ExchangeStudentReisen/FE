import { fetchApi } from './client'
import type { ApiResponse } from '../types/api'
import type { SendVerificationPayload, VerifyCodePayload, VerifiedProfileData } from '../types/verification'

export function sendVerificationEmail(payload: SendVerificationPayload) {
  return fetchApi<ApiResponse<string>>('/api/verification/send', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  })
}

export function verifyCode(payload: VerifyCodePayload) {
  return fetchApi<ApiResponse<VerifiedProfileData>>('/api/verification/verify', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  })
}