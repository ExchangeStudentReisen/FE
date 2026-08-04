export interface FeedItem {
  id: string
  flag: string
  city: string
  dateRange: string
  title: string
  school: string
  gender: string
  age: number
  tag: string
  createdAgo: string
  category: string
  month: string
  createdAt: number
}

export interface FeedFilters {
  category: string
  month: string
  gender: string
  sort: 'latest' | 'popular'
  keyword: string
}

export interface FeedPageResult {
  items: FeedItem[]
  nextPage: number | null
}

// 필터 UI에 들어갈 옵션들 — 실제 값은 사용하는 쪽에서 정의
export interface FeedFilterOptions {
  categories: { key: string; label: string }[]
  months: string[]
  genders: string[]
}