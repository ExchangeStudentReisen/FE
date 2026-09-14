import { useInfiniteQuery } from '@tanstack/react-query'
import { getPosts } from '../api/post'
import type { FeedFilters, FeedPageResult } from '../types/feed'

export function useInfiniteFeed(filters: FeedFilters) {
  return useInfiniteQuery({
    queryKey: ['feed', filters],
    queryFn: async ({ pageParam }): Promise<FeedPageResult> => {
      const res = await getPosts(filters, pageParam)
      return {
        items: res.data.content,
        nextPage: res.data.hasNext ? pageParam + 1 : null,
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  })
}
