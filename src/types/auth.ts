// types/auth.ts
import type { ApiResponse } from './api'

export type MemberGender = 'MALE' | 'FEMALE'

export interface MeData {
  id: number
  name: string
  email: string
  gender: MemberGender
  birthYear: number
  dispatchCountry: string
  emailVerified: boolean
  schoolId: number
  schoolName: string
  createdAt: string
  updatedAt: string
}

export interface PendingData {
  nickname: string
  gender: MemberGender | null
  birthYear: number
}

export interface SignupPayload {
  pendingKey: string
  name: string
  dispatchCountry: string
  gender?: MemberGender
}

export interface ReissuePayload {
  refreshToken: string
}

export interface TokenPair {
  accessToken: string
  refreshToken: string
}

export interface SignupResponseData {
  member: MeData
  accessToken: string
  refreshToken: string
}

export interface LogoutResponseData {
  data: string
}

export type MeResponse = ApiResponse<MeData>
export type PendingResponse = ApiResponse<PendingData>