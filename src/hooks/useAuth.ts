import { useMutation } from '@tanstack/react-query'
import { signup, logout } from '../api/auth'
import { useAuthTokenStore } from '../stores/authTokenStore'

export function useSignup() {
  const setTokens = useAuthTokenStore((s) => s.setTokens)

  return useMutation({
    mutationFn: signup,
    onSuccess: (res) => {
      setTokens(res.data.accessToken, res.data.refreshToken)
    },
  })
}

export function useLogout() {
  const clearTokens = useAuthTokenStore((s) => s.clearTokens)

  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      clearTokens()
    },
  })
}