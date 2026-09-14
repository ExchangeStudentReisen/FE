// stores/signupStore.ts
import { create } from 'zustand'
import type { MemberGender, PendingData } from '../types/auth'

interface SignupState {
  key: string | null
  nickname: string
  gender: MemberGender | null
  birthYear: number | null
}

interface SignupActions {
  setPendingProfile: (data: PendingData, key: string) => void
  reset: () => void
}

const initialState: SignupState = {
  key: null,
  nickname: '',
  gender: null,
  birthYear: null,
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
  reset: () => set(initialState),
}))
