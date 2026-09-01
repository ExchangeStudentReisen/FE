export type Gender = 'MALE' | 'FEMALE'

export interface UserProfile {
  id: number
  name: string
  email: string
  gender: Gender
  birthYear: number
  dispatchCountry: string
  emailVerified: boolean
  schoolId: number
  schoolName: string
  createdAt: string
  updatedAt: string
}