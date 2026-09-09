import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { FullScreenLoading } from '../../components/common/FullScreenLoading'
import { getPending } from '../../api/auth'
import { useSignupStore } from '../../stores/signupStore'
import { useAuthTokenStore } from '../../stores/authTokenStore'

export function AuthRedirectPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    (async () => {
      const isNewMember = searchParams.get('isNewMember') === 'true'

      if (!isNewMember) {
        const accessToken = searchParams.get('accessToken')
        const refreshToken = searchParams.get('refreshToken')
        if (accessToken && refreshToken) {
          useAuthTokenStore.getState().setTokens(accessToken, refreshToken)
        }
        navigate('/feed', { replace: true })
        return
      }

      const pendingKey = searchParams.get('pendingKey')
      if (!pendingKey) {
        navigate('/', { replace: true })
        return
      }

      const pending = await getPending(pendingKey)
      useSignupStore.getState().setPendingProfile(pending.data, pendingKey)
      navigate('/verifyEmail', { replace: true })
    })()
  }, [searchParams, navigate])

  return <FullScreenLoading message="로그인 처리 중이에요..." />
}