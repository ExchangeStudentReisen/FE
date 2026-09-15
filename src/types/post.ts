import type { MemberGender } from './auth'

export type RecruitGender = 'any' | 'female' | 'male'

// ---- 여기서부터 POST /api/posts 요청/응답 스키마 기준으로 추가 ----
export type ApiGender = 'OTHER' | 'FEMALE' | 'MALE'

export const RECRUIT_GENDER_TO_API: Record<RecruitGender, ApiGender> = {
  any: 'OTHER',
  female: 'FEMALE',
  male: 'MALE',
}

// 백엔드 Country enum (com.jhssong.exchange_student_reisen.domain.member.entity.Country) 값과 동일해야 함
export type Country =
  | 'AUSTRALIA' | 'NEW_ZEALAND' | 'BELGIUM' | 'SINGAPORE' | 'JAPAN' | 'CZECH_REPUBLIC'
  | 'SPAIN' | 'POLAND' | 'SWEDEN' | 'CANADA' | 'UNITED_KINGDOM' | 'NETHERLANDS'
  | 'GERMANY' | 'AUSTRIA' | 'FINLAND' | 'CHINA' | 'SOUTH_KOREA' | 'DENMARK'
  | 'FRANCE' | 'UNITED_STATES' | 'SWITZERLAND' | 'PORTUGAL' | 'NORWAY' | 'ITALY' | 'HUNGARY'

// authorId/memberId는 body에 없음 — 서버가 Authorization 헤더의 로그인 토큰으로 작성자를 식별함
export interface CreatePostRequest {
  title: string
  content: string
  kakaotalkLink: string
  maxMembers: number
  startAge: number
  endAge: number
  gender: ApiGender
  startDate: string // 'YYYY-MM-DD'
  endDate: string
  travelCity: Country // 도시가 아니라 국가 단위 enum (예: 'FRANCE') — COUNTRY_OPTIONS(countryMock.ts)의 country.code와 동일한 값 사용
}

// POST /api/posts 응답의 data 필드
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
  gender: ApiGender
  startDate: string
  endDate: string
  travelCity: Country
  isRecruiting: boolean
  view: number
  clickCnt: number
  createdAt: string
  updatedAt: string
}

// ---- 여기서부터 PUT /api/posts/{id} 요청 스키마 기준으로 추가 ----
// 작성자 본인만 수정 가능 — 응답은 GET /api/posts/{id}와 동일해 PostDetailResponse를 그대로 재사용함
export interface UpdatePostRequest {
  title: string
  content: string
  kakaotalkLink: string
  maxMembers: number
  startAge: number
  endAge: number
  gender: ApiGender
  startDate: string
  endDate: string
  travelCity: Country
  isRecruiting: boolean
}

// ---- 여기서부터 GET /api/posts/{id} 응답 스키마 기준으로 추가 (구 types/postDetail.ts) ----

// 작성자 실제 성별 — 모집 선호 성별과 달리 OTHER(성별무관) 없음
export type AuthorGender = MemberGender

// 모집 선호 성별 — GET /api/posts, GET /api/posts/{id}와 동일한 enum
export type PostRecruitGender = 'MALE' | 'FEMALE' | 'OTHER'

export interface PostDetailApiData {
  id: number
  authorId: number
  authorName: string
  authorBirthYear: number
  authorGender: AuthorGender
  title: string
  content: string
  maxMembers: number
  startAge: number
  endAge: number
  gender: PostRecruitGender
  startDate: string // 'YYYY-MM-DD'
  endDate: string
  travelCity: Country
  isRecruiting: boolean
  view: number
  clickCnt: number
  createdAt: string
  updatedAt: string
}

export interface PostDetailResponse {
  result: 'SUCCESS' | string // TODO: 실패 시 값 확인
  data: PostDetailApiData
  title: string
  message: string
}

// ---- 여기서부터 GET /api/posts/{id}/kakaotalk-link 응답 스키마 기준으로 추가 (구 types/chatLink.ts) ----

export interface ChatLinkApiData {
  kakaotalkLink: string
}