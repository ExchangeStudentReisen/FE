// stores/signupStore.ts
import { create } from 'zustand'
import type { School } from '../types/school'
import type { PendingData } from '../types/auth'

interface SignupState {
  key: string | null
  nickname: string
  gender: 'MALE' | 'FEMALE' | null
  birthYear: number | null
  school: School | null
  email: string
  emailVerified: boolean
}

interface SignupActions {
  setPendingProfile: (data: PendingData, key: string) => void
  setSchool: (school: School) => void
  setEmailVerified: (email: string) => void
  reset: () => void
}

const initialState: SignupState = {
  key: null,
  nickname: '',
  gender: null,
  birthYear: null,
  school: null,
  email: '',
  emailVerified: false,
}

export const useSignupStore = create<SignupState & SignupActions>((set) => ({
  ...initialState,
  setPendingProfile: (data, key) =>
    set({
      key,
      nickname: data.nickname,
      gender: data.gender,
      birthYear: data.birthYear,
    }),
  setSchool: (school) => set({ school }),
  setEmailVerified: (email) => set({ email, emailVerified: true }),
  reset: () => set(initialState),
}))