import type { Country, PostRecruitGender } from './post'

// 피드에서 다른 사용자들에게 보여주는 모집글 데이터
// (백엔드 응답 data[] 각 항목 기준 + 화면 전용 파생값)
export interface FeedItem {
  id: number
  title: string
  content: string
  startAge: number
  endAge: number
  gender: PostRecruitGender | null // null, OTHER는 성별 무관(전체)
  startDate: string // ISO date
  endDate: string
  travelCity: Country
  isRecruiting: boolean
  view: number
  clickCnt: number
  updatedAt: string // ISO datetime
}

export interface FeedFilters {
  travelCity?: Country // undefined/null이면 전체
  gender?: PostRecruitGender // undefined/null이면 전체
  startAge?: number
  endAge?: number
  startDate?: string // ISO date
  endDate?: string
  sort: 'latest' | 'popular' // TODO: API 파라미터에 없음 — 프론트에서 정렬하거나 백엔드 확인 필요
}

export interface FeedPageResult {
  items: FeedItem[]
  nextPage: number | null
}

// GET /api/posts 응답의 data 필드 (Spring Page 형태)
export interface FeedListData {
  content: FeedItem[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  hasNext: boolean
}

// 필터 UI에 들어갈 옵션들 — 실제 값은 사용하는 쪽에서 정의
export interface FeedFilterOptions {
  countries: { value: string; label: string }[] // getCountryOptions()로 채움
  genders: { value: PostRecruitGender; label: string }[]
}