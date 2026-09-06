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
  gender: 'MALE' | 'FEMALE' | null
  birthYear: number
  email: string
  schoolId: number
  schoolName: string
}