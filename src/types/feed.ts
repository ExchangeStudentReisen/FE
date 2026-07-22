export interface FeedItem {
  id: string
  category: string
  gender: string
  month: string
  title: string
  createdAt: number
  // TODO: 나머지 필드는 여기에 직접 추가
  [key: string]: unknown
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