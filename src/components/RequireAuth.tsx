import { Navigate, Outlet } from 'react-router-dom'
import { useAuthTokenStore } from '../stores/authTokenStore'
import { useMyProfile } from '../hooks/useMyProfile'

// accessToken이 없거나, 있어도 서버(/api/auth/me)가 거부하면 웰컴 페이지로 돌려보냄
export function RequireAuth() {
  const accessToken = useAuthTokenStore((s) => s.accessToken)
  const { data, isLoading, isError } = useMyProfile()

  if (!accessToken || isError) {
    return <Navigate to="/" replace />
  }

  if (isLoading || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-sm text-slate-400">확인 중...</span>
      </div>
    )
  }

  return <Outlet />
}
