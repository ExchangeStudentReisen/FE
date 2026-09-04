import { z } from 'zod'
import type { TravelStyle } from '../types/post'

const TRAVEL_STYLES: [TravelStyle, ...TravelStyle[]] = [
  '카페', '야경', '관광', '미술관', '공연', '맛집',
  '저렴이', '브런치', '쇼핑', '역사', '야시장', '느긋',
]

const KAKAO_OPENCHAT_REGEX = /^https?:\/\/open\.kakao\.com\/[oO]\/[A-Za-z0-9]+$/

export const postCreateSchema = z
  .object({
    // Step 1 · 도시 · 날짜
    country: z.string().min(1, '국가를 선택해주세요'),
    city: z.string().min(1, '도시를 선택해주세요'),
    startDate: z.string().min(1, '출발 날짜를 선택해주세요'),
    endDate: z.string().min(1, '도착 날짜를 선택해주세요'),

    // Step 2 · 모집 정보
    recruitGender: z.enum(['any', 'female', 'male']),
    minAge: z.number().min(18).max(99),
    maxAge: z.number().min(18).max(99),
    headcount: z.number().min(1).max(4), // 4는 '4+명'을 의미
    travelStyles: z
      .array(z.enum(TRAVEL_STYLES))
      .min(1, '여행 스타일을 1개 이상 선택해주세요')
      .max(5, '최대 5개까지 선택할 수 있어요'),

    // Step 3 · 소개 · 링크
    title: z.string().min(1, '한 줄 제목을 입력해주세요').max(30, '30자 이내로 입력해주세요'),
    content: z.string().min(1, '소개를 입력해주세요').max(500, '500자 이내로 입력해주세요'),
    kakaoOpenChatUrl: z
      .string()
      .min(1, '카카오 오픈채팅 링크를 입력해주세요')
      .regex(KAKAO_OPENCHAT_REGEX, '올바른 카카오 오픈채팅 링크 형식이 아니에요'),
  })
  .refine((data) => data.minAge <= data.maxAge, {
    message: '최소 나이가 최대 나이보다 클 수 없어요',
    path: ['maxAge'],
  })
  .refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
    message: '도착일이 출발일보다 빠를 수 없어요',
    path: ['endDate'],
  })

export type PostCreateFormValues = z.infer<typeof postCreateSchema>

// 스텝별 필드 (다음 버튼 클릭 시 해당 스텝만 trigger)
export const STEP_FIELDS = {
  1: ['country', 'city', 'startDate', 'endDate'],
  2: ['recruitGender', 'minAge', 'maxAge', 'headcount', 'travelStyles'],
  3: ['title', 'content', 'kakaoOpenChatUrl'],
} as const satisfies Record<number, (keyof PostCreateFormValues)[]>