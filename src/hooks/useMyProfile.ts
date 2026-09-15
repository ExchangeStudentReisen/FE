import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMe } from '../api/auth'
import { updateMember, deleteMember } from '../api/members'
import { useAuthTokenStore } from '../stores/authTokenStore'
import type { UpdateMemberPayload } from '../types/auth'

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

// 닉네임만 화면에서 편집하지만, PUT /api/members/{id}는 다른 필드도 같이 받으므로
// 호출부에서 기존 프로필 값을 그대로 채워 넘겨야 함
export function useUpdateMyProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...payload }: { id: number } & UpdateMemberPayload) =>
      updateMember(id, id, payload),
    onSuccess: (res) => {
      queryClient.setQueryData(['myProfile'], res.data)
    },
  })
}

export function useDeleteMyProfile() {
  const clearTokens = useAuthTokenStore((s) => s.clearTokens)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteMember(id, id),
    onSuccess: () => {
      clearTokens()
      queryClient.clear()
    },
  })
}
