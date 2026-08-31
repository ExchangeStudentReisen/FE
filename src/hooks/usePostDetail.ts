// hooks/usePostDetail.ts
import { useQuery } from '@tanstack/react-query'
import type { PostDetailApiData } from '../types/postDetail'
import { POST_DETAIL_MOCKS } from '../mocks/postDetailMocks'

// TODO: 백엔드 연동 시 실제 fetch로 교체
async function fetchPostDetail(id: string): Promise<PostDetailApiData> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const res = POST_DETAIL_MOCKS[id]
  if (!res || res.result !== 'SUCCESS') {
    throw new Error('게시글을 찾을 수 없어요')
  }
  return res.data
}

export function usePostDetail(id: string | undefined) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => fetchPostDetail(id as string),
    enabled: !!id,
  })
}