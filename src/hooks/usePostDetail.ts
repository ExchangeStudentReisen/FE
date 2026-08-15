import { useQuery } from '@tanstack/react-query'
import type { PostDetail } from '../types/postdetail'

async function fetchPostDetail(id: string): Promise<PostDetail> {
  const res = await fetch(`/api/posts/${id}`)
  if (!res.ok) throw new Error('게시글을 불러오지 못했어요')
  return res.json()
}

export function usePostDetail(id: string | undefined) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => fetchPostDetail(id as string),
    enabled: !!id,
  })
}