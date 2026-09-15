import { useQuery } from '@tanstack/react-query'
import { getChatLink, getPostDetail } from '../api/post'
import type { ApiResponse } from '../types/api'
import type { ChatLinkApiData } from '../types/post'

export function usePostDetail(id: string | undefined) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const res = await getPostDetail(id as string)
      return res.data
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  })
}

async function fetchChatLink(postId: string, memberId: number): Promise<ApiResponse<ChatLinkApiData | null>> {
  try {
    return await getChatLink(postId, memberId)
  } catch (err) {
    // 모집 조건(성별·나이·여행지) 불충족 등 서버가 거부한 경우 — 채팅방 입장 불가로 처리
    // 백엔드가 실패 사유를 내려주면 그대로 보여주고, 없으면 기본 안내 문구로 대체
    const message = err instanceof Error && err.message ? err.message : '모집 요건에 맞지 않아 채팅방에 입장할 수 없어요.'
    return {
      result: 'FAIL',
      data: null,
      title: '조회 실패',
      message,
    }
  }
}

export function useChatLink(
  postId: string | undefined,
  memberId: number | undefined,
  enabled: boolean,
) {
  return useQuery({
    queryKey: ['chatLink', postId, memberId],
    queryFn: () => fetchChatLink(postId as string, memberId as number),
    enabled: enabled && !!postId && !!memberId,
    staleTime: 0,
  })
}
