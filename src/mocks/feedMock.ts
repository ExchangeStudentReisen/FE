import type { FeedFilters, FeedItem, FeedPageResult } from '../types/feed'

const ALL_ITEMS: FeedItem[] = [
  {
    id: 'feed-1',
    flag: '🇨🇿',
    city: 'Prague',
    category: 'prague',
    month: '6월',
    dateRange: '6.04-6.05',
    title: '프라하 같이 다니실 여성분 구해요',
    school: '연세대',
    gender: '여성',
    age: 22,
    tag: '카페',
    createdAgo: '15분 전',
    createdAt: Date.now() - 15 * 60_000,
  },
  {
    id: 'feed-2',
    flag: '🇦🇹',
    city: 'Vienna',
    category: 'vienna',
    month: '6월',
    dateRange: '6.11-6.13',
    title: '빈 — 부다페스트 같이 도실 분?',
    school: '고려대',
    gender: '남성',
    age: 24,
    tag: '미술관',
    createdAgo: '1시간 전',
    createdAt: Date.now() - 60 * 60_000,
  },
  {
    id: 'feed-3',
    flag: '🇫🇷',
    city: 'Paris',
    category: 'paris',
    month: '6월',
    dateRange: '6.20-6.22',
    title: '파리에서 같이 미술관 보실 분',
    school: '이화여대',
    gender: '여성',
    age: 21,
    tag: '미술관',
    createdAgo: '3시간 전',
    createdAt: Date.now() - 3 * 60 * 60_000,
  },
  {
    id: 'feed-4',
    flag: '🇭🇺',
    city: 'Budapest',
    category: 'budapest',
    month: '6월',
    dateRange: '6.07-6.08',
    title: '부다 당일치기 — 세체니 온천 ㄱ?',
    school: '한양대',
    gender: '남성',
    age: 23,
    tag: '온천',
    createdAgo: '5시간 전',
    createdAt: Date.now() - 5 * 60 * 60_000,
  },
]

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