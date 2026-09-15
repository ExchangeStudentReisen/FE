// api/members.ts
import { fetchApi } from './client'
import type { ApiResponse } from '../types/api'
import type { MeData, UpdateMemberPayload } from '../types/auth'

// 본인만 수정 가능 — 서버가 Authorization 헤더로 검증하지만 memberId도 쿼리로 함께 전달
export function updateMember(id: number, memberId: number, payload: UpdateMemberPayload) {
  return fetchApi<ApiResponse<MeData>>(`/api/members/${id}?memberId=${memberId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  })
}

// 본인만 탈퇴 가능
export function deleteMember(id: number, memberId: number) {
  return fetchApi<ApiResponse<string>>(`/api/members/${id}?memberId=${memberId}`, {
    method: 'DELETE',
  })
}
