import { z } from 'zod'

const KAKAO_OPENCHAT_REGEX = /^https?:\/\/open\.kakao\.com\/[oO]\//

const postCreateObjectSchema = z.object({
  // Step 1 · 도시 · 날짜
  country: z.string().min(1, '국가를 선택해주세요'),
  city: z.string().min(1, '도시를 선택해주세요'),
  startDate: z.string().min(1, '출발 날짜를 선택해주세요'),
  endDate: z.string().min(1, '도착 날짜를 선택해주세요'),

  // Step 2 · 모집 정보
  recruitGender: z.enum(['any', 'female', 'male']),
  minAge: z.number().min(20).max(30),
  maxAge: z.number().min(20).max(30),
  headcount: z.number().min(2).max(5), // 5는 '5+명'을 의미

  // Step 3 · 소개 · 링크
  title: z.string().min(1, '한 줄 제목을 입력해주세요').max(30, '30자 이내로 입력해주세요'),
  content: z.string().min(1, '소개를 입력해주세요').max(500, '500자 이내로 입력해주세요'),
  kakaoOpenChatUrl: z
    .string()
    .min(1, '카카오 오픈채팅 링크를 입력해주세요')
    .regex(KAKAO_OPENCHAT_REGEX, '올바르지 않은 오픈채팅 링크입니다. 올바른 링크를 올려주세요'),
})

export type PostCreateFormValues = z.infer<typeof postCreateObjectSchema>

function todayISODate(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// myAge: 작성자의 현재(세는) 나이 — 프로필 로딩 전이거나 서비스 연령 범위(20~30세) 밖이면 이 검증은 건너뜀
export function createPostCreateSchema(myAge?: number) {
  return postCreateObjectSchema
    .refine((data) => data.minAge <= data.maxAge, {
      message: '최소 나이가 최대 나이보다 클 수 없어요',
      path: ['maxAge'],
    })
    .refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
      message: '도착일이 출발일보다 빠를 수 없어요',
      path: ['endDate'],
    })
    .refine((data) => !data.startDate || data.startDate >= todayISODate(), {
      message: '현재 날짜를 확인해주세요',
      path: ['startDate'],
    })
    .refine((data) => myAge === undefined || (data.minAge <= myAge && myAge <= data.maxAge), {
      message: '본인 나이를 포함하는 범위로 설정해주세요',
      path: ['maxAge'],
    })
}