import type { FeedFilters, FeedItem, FeedPageResult } from '../types/feed'

// TODO: 실제 mock 데이터로 채우기 (또는 실제 API 응답으로 교체)
const ALL_ITEMS: FeedItem[] = []

const PAGE_SIZE = 10

export async function fetchFeed(pageParam: number, filters: FeedFilters): Promise<FeedPageResult> {
  await new Promise((resolve) => setTimeout(resolve, 400))

  let filtered = ALL_ITEMS

  if (filters.category !== 'all') {
    filtered = filtered.filter((item) => item.category === filters.category)
  }
  if (filters.gender !== '전체') {
    filtered = filtered.filter((item) => item.gender === filters.gender)
  }
  if (filters.month !== '전체') {
    filtered = filtered.filter((item) => item.month === filters.month)
  }
  if (filters.keyword.trim()) {
    const keyword = filters.keyword.trim().toLowerCase()
    filtered = filtered.filter((item) => item.title.toLowerCase().includes(keyword))
  }

  filtered = [...filtered].sort((a, b) =>
    filters.sort === 'latest' ? b.createdAt - a.createdAt : 0
  )

  const start = pageParam * PAGE_SIZE
  const items = filtered.slice(start, start + PAGE_SIZE)
  const nextPage = start + PAGE_SIZE < filtered.length ? pageParam + 1 : null

  return { items, nextPage }
}