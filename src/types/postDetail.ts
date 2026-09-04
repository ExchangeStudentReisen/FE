// types/postDetail.ts

// TODO: 백엔드 enum 값 전체 목록 확인 필요 (지금은 예시로 유추한 값)
export type TravelCity =
  | 'GERMANY'
  | 'FRANCE'
  | 'ITALY'
  | 'CZECH'
  | 'AUSTRIA'
  | 'SPAIN'

// TODO: 'ALL' 같은 전체 허용 값이 있는지 확인 필요
export type RecruitGender = 'MALE' | 'FEMALE'

export interface PostDetailApiData {
  id: number
  authorId: number
  authorName: string
  authorBirthYear: number
  authorGender: RecruitGender
  title: string
  content: string
  maxMembers: number
  startAge: number
  endAge: number
  gender: RecruitGender
  startDate: string // 'YYYY-MM-DD'
  endDate: string
  travelCity: TravelCity
  isRecruiting: boolean
  view: number
  clickCnt: number
  createdAt: string
  updatedAt: string
}

export interface PostDetailResponse {
  result: 'SUCCESS' | 'FAIL' // TODO: 실패 시 값 확인
  data: PostDetailApiData
  title: string
  message: string
}