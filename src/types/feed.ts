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
}

export interface FeedFilters {
  travelCity?: string // undefined/null이면 전체
  gender?: 'MALE' | 'FEMALE' | 'OTHER' // undefined/null이면 전체
  startAge?: number
  endAge?: number
  startDate?: string // ISO date
  endDate?: string
  sort: 'latest' | 'popular' // TODO: API 파라미터에 없음 — 프론트에서 정렬하거나 백엔드 확인 필요
  keyword: string // TODO: API 파라미터에 없음 — 검색창 텍스트를 travelCity 매칭으로 쓸지, 프론트 필터로만 쓸지 확인 필요
}

export interface FeedPageResult {
  items: FeedItem[]
  nextPage: number | null
}

// 필터 UI에 들어갈 옵션들 — 실제 값은 사용하는 쪽에서 정의
export interface FeedFilterOptions {
  countries: { value: string; label: string }[] // getCountryOptions()로 채움
  genders: { value: 'MALE' | 'FEMALE' | 'OTHER'; label: string }[]
}