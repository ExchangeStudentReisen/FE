import type { ApiResponse } from './api'

// 해당 여행 스타일은 삭제될 수 있음
export type TravelStyle =
  | '카페' | '야경' | '관광' | '미술관' | '공연' | '맛집'
  | '저렴이' | '브런치' | '쇼핑' | '역사' | '야시장' | '느긋'

export type RecruitGender = 'any' | 'female' | 'male'

// 피드에서 다른 사용자들에게 보여주는 모집글 데이터
export interface CompanionPost {
  id: number
  title: string
  content: string
  startAge: number
  endAge: number
  gender: 'MALE' | 'FEMALE' | 'OTHER' | null
  startDate: string
  endDate: string
  travelCity: string
  isRecruiting: boolean
  view: number
  clickCnt: number
  updatedAt: string
}

// 목록 조회 응답 = ApiResponse<T>를 재사용
export type CompanionPostListResponse = ApiResponse<CompanionPost[]>