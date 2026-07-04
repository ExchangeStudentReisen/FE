// 05번 모집글 작성 화면의 3단계 입력값 기준
export type TravelStyle =
  | '카페' | '야경' | '관광' | '미술관' | '공연' | '맛집'
  | '저렴이' | '브런치' | '쇼핑' | '역사' | '야시장' | '느긋'

export type RecruitGender = 'any' | 'female' | 'male'

export interface CompanionPost {
  id: string
  country: string
  city: string
  startDate: string // ISO date
  endDate: string
  title: string
  description: string
  recruitGender: RecruitGender
  minAge: number
  maxAge: number
  headcount: number
  travelStyles: TravelStyle[]
  kakaoOpenChatUrl: string
  status: 'recruiting' | 'matched' | 'expired'
  author: {
    id: string
    nickname: string
    school: string
    gender: 'female' | 'male'
    age: number
  }
  interestedCount: number
  createdAt: string
}
