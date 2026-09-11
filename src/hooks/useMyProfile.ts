import { useQuery } from '@tanstack/react-query'
import { getMe } from '../api/auth'
import { useAuthTokenStore } from '../stores/authTokenStore'

export function useMyProfile() {
  const accessToken = useAuthTokenStore((s) => s.accessToken)

  return useQuery({
    queryKey: ['myProfile'],
    queryFn: async () => {
      const res = await getMe()
      return res.data
    },
    enabled: !!accessToken,
  })
}
