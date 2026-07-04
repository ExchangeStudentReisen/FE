import { create } from 'zustand'

// 온보딩(01) 프로필 설정 화면에서 만들어지는 값 기준
export interface ExchangeStudentUser {
  id: string
  nickname: string
  school: string
  isVerified: boolean
  birthYear: number
  gender: 'female' | 'male'
  currentCountry: string
  currentCity: string
}

interface UserState {
  user: ExchangeStudentUser | null
  setUser: (user: ExchangeStudentUser) => void
  clearUser: () => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}))
