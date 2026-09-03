import { useQuery } from '@tanstack/react-query'
import type { ApiResponse } from '../types/api'
import type { ChatLinkApiData } from '../types/chatLink'
import { POST_DETAIL_MOCKS } from '../mocks/postDetailMocks'
import { MOCK_MY_PROFILE } from './useMyProfile'

const KAKAO_LINK_BY_POST: Record<string, string> = {
  '1': 'https://open.kakao.com/o/g/prg604',
  '2': 'https://open.kakao.com/o/g/prs901',
  '3': 'https://open.kakao.com/o/g/rom222',
}

function isEligible(postId: string, memberId: number): boolean {
  const post = POST_DETAIL_MOCKS[postId]?.data
  // 지금 mock 사용자는 1명뿐이라 memberId로 프로필을 구분하진 않음
  if (!post || MOCK_MY_PROFILE.id !== memberId) return false

  const age = new Date().getFullYear() - MOCK_MY_PROFILE.birthYear
  const genderMatch = post.gender === MOCK_MY_PROFILE.gender
  const ageMatch = age >= post.startAge && age <= post.endAge

  return genderMatch && ageMatch
}

async function fetchChatLink(postId: string, memberId: number): Promise<ApiResponse<ChatLinkApiData | null>> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  if (!isEligible(postId, memberId)) {
    return {
      result: 'FAIL',
      data: null,
      title: '조회 실패',
      message: '모집 요건에 맞지 않아 채팅방에 입장할 수 없어요.',
    }
  }

  return {
    result: 'SUCCESS',
    data: { kakaotalkLink: KAKAO_LINK_BY_POST[postId] },
    title: '조회 성공',
    message: '',
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