import { useAuthTokenStore } from '../stores/authTokenStore'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

let isRefreshing = false
let refreshPromise: Promise<string | null> | null = null

// RequireAuth가 새로고침 직후 accessToken 복구용으로도 호출하므로,
// 아래의 isRefreshing/refreshPromise 가드를 공유해 중복 재발급(refreshToken 재사용 실패)을 막는다.
export async function refreshAccessToken(): Promise<string | null> {
  const { refreshToken, setTokens, clearTokens } = useAuthTokenStore.getState()
  if (!refreshToken) return null

  try {
    const res = await fetch(`${BASE_URL}/api/auth/reissue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
    if (!res.ok) throw new Error('reissue failed')
    const json = await res.json()
    setTokens(json.data.accessToken, json.data.refreshToken) // refreshToken도 재발급되므로 같이 갱신
    return json.data.accessToken
  } catch {
    clearTokens()
    return null
  }
}

export async function fetchApi<T>(
  path: string,
  options: RequestInit = {},
  isRetry = false,
): Promise<T> {
  const { accessToken } = useAuthTokenStore.getState()

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.headers ?? {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  })

  if (res.status === 401 && !isRetry) {
    if (!isRefreshing) {
      isRefreshing = true
      refreshPromise = refreshAccessToken().finally(() => {
        isRefreshing = false
      })
    }
    const newToken = await refreshPromise
    if (newToken) {
      return fetchApi<T>(path, options, true) // 원래 요청 한 번만 재시도
    }
    throw new Error('Unauthorized')
  }

  if (!res.ok) {
    // 백엔드가 ApiResponse.message로 실패 사유를 내려주면 그대로 노출 — 없으면 상태 코드만 표기
    const body = await res.json().catch(() => null)
    throw new Error(body?.message || `API Error: ${res.status}`)
  }
  if(res.status === 204) {
    return undefined as T
  }
  return res.json()
}