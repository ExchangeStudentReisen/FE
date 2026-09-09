// types/auth.ts
import type { ApiResponse } from './api'

export interface MeData {
  id: number
  name: string
  email: string
  gender: 'MALE' | 'FEMALE'
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
  gender: 'MALE' | 'FEMALE' | null
  birthYear: number
}

export interface SignupPayload {
  pendingKey: string
  name: string
  dispatchCountry: string
  gender?: 'MALE' | 'FEMALE'
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