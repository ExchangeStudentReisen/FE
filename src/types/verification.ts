import type { MemberGender } from './auth'

export interface SendVerificationPayload {
  pendingKey: string
  schoolId: number
  email: string
}

export interface VerifyCodePayload {
  pendingKey: string
  schoolId: number
  email: string
  code: string
}

export interface VerifiedProfileData {
  nickname: string
  gender: MemberGender | null
  birthYear: number
  email: string
  schoolId: number
  schoolName: string
}