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

// ---- 여기서부터 POST /posts 요청/응답 스키마 기준으로 추가 ----
// TODO: 스웨거 예시의 tripCity가 "GERMANY"처럼 국가명으로 찍혀있어서
// 실제로 도시 단위 enum인지 국가 단위인지 백엔드랑 확인 필요.
// 일단 프론트는 country/city를 따로 들고 있다가 city 코드를 tripCity로 보내는 걸로 가정.
export type ApiGender = 'ANY' | 'FEMALE' | 'MALE'

export const RECRUIT_GENDER_TO_API: Record<RecruitGender, ApiGender> = {
  any: 'ANY',
  female: 'FEMALE',
  male: 'MALE',
}

export interface CreatePostRequest {
  authorId: number
  title: string
  content: string
  kakaotalkLink: string
  maxMembers: number
  startAge: number
  endAge: number
  gender: ApiGender
  startDate: string // 'YYYY-MM-DD'
  endDate: string
  tripCity: string
}

export type ApiGenderResponse = 'ANY' | 'FEMALE' | 'MALE'

// POST /posts 응답의 data 필드
export interface CreatePostResponseData {
  id: number
  authorId: number
  authorName: string
  title: string
  content: string
  kakaotalkLink: string
  maxMembers: number
  startAge: number
  endAge: number
  gender: ApiGenderResponse
  startDate: string
  endDate: string
  tripCity: string
  isRecruiting: boolean
  view: number
  clickCnt: number
  createdAt: string
  updatedAt: string
}