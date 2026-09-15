import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthTokenStore } from '../stores/authTokenStore'
import { useMyProfile } from '../hooks/useMyProfile'
import { refreshAccessToken } from '../api/client'

const CHECKING = (
  <div className="flex min-h-screen items-center justify-center">
    <span className="text-sm text-slate-400">확인 중...</span>
  </div>
)

// accessToken이 없거나, 있어도 서버(/api/auth/me)가 거부하면 웰컴 페이지로 돌려보냄
export function RequireAuth() {
  const accessToken = useAuthTokenStore((s) => s.accessToken)
  const refreshToken = useAuthTokenStore((s) => s.refreshToken)
  // 새로고침 직후에는 accessToken만 사라진 상태이므로, localStorage에 남아있는
  // refreshToken으로 한 번 재발급을 시도한 뒤에 로그인 여부를 판단한다.
  const [isRestoring, setIsRestoring] = useState(!accessToken && !!refreshToken)

  useEffect(() => {
    if (accessToken || !refreshToken) return

    let cancelled = false
    refreshAccessToken().finally(() => {
      if (!cancelled) setIsRestoring(false)
    })
    return () => {
      cancelled = true
    }
    // 새로고침 직후 한 번만 시도하면 되므로 accessToken/refreshToken 변경에 재실행하지 않는다.
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { data, isLoading, isError } = useMyProfile()

  if (isRestoring) {
    return CHECKING
  }

  if (!accessToken || isError) {
    return <Navigate to="/" replace />
  }

  if (isLoading || !data) {
    return CHECKING
  }

  return <Outlet />
}
