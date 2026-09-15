import { useInfiniteQuery } from '@tanstack/react-query'
import { getMyPosts } from '../api/post'

export function useMyPosts(memberId: number | undefined) {
  return useInfiniteQuery({
    queryKey: ['myPosts', memberId],
    queryFn: ({ pageParam }) => getMyPosts(memberId as number, pageParam),
    getNextPageParam: (lastPage, allPages) => (lastPage.data.hasNext ? allPages.length : undefined),
    initialPageParam: 0,
    enabled: !!memberId,
  })
}
