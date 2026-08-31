// 05번 모집글 작성 화면의 3단계 입력값 기준
export type TravelStyle =
  | '카페' | '야경' | '관광' | '미술관' | '공연' | '맛집'
  | '저렴이' | '브런치' | '쇼핑' | '역사' | '야시장' | '느긋'

// 피드에서 다른 사용자들에게 보여주는 모집글 데이터
// (백엔드 응답 data[] 각 항목 기준 + 화면 전용 파생값)
export interface FeedItem {
  id: number
  title: string
  content: string
  startAge: number
  endAge: number
  gender: 'MALE' | 'FEMALE' | 'OTHER' | null // null, OTHER는 성별 무관(전체)
  startDate: string // ISO date
  endDate: string
  travelCity: string // ex) 'GERMANY'
  isRecruiting: boolean
  view: number
  clickCnt: number
  updatedAt: string // ISO datetime

  // 화면 전용 파생값 — 백엔드 응답엔 없음
  category: string // TODO: 필터용 — 실제 쓰임 확정 필요
  month: string // TODO: 필터용 — startDate에서 추출해서 만드는 게 나을 수도 있음
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