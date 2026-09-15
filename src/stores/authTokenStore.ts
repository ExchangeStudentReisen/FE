import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthTokenState {
  accessToken: string | null
  refreshToken: string | null
  setTokens: (accessToken: string, refreshToken: string) => void
  clearTokens: () => void
}

// accessToken은 새로고침 시 사라지는 게 의도(메모리 전용): XSS로부터 상대적으로 안전하게 두고,
// refreshToken만 localStorage에 남겨 새로고침 후 재발급(reissue)에 쓴다.
export const useAuthTokenStore = create<AuthTokenState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
      clearTokens: () => set({ accessToken: null, refreshToken: null }),
    }),
    {
      name: 'auth-token-storage',
      partialize: (state) => ({ refreshToken: state.refreshToken }),
    },
  ),
)