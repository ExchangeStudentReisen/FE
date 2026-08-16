import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchFeed } from '../mocks/feedMock'
import type { FeedFilters } from '../types/feed'

export function useInfiniteFeed(filters: FeedFilters) {
  return useInfiniteQuery({
    queryKey: ['feed', filters],
    queryFn: ({ pageParam = 0 }) => fetchFeed(pageParam as number, filters),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  })
}