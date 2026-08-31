export type Gender = 'MALE' | 'FEMALE' | 'OTHER'

export interface VerifiedSignupProfile {
  nickname: string
  gender: Gender | null
  birthYear: number | null
  email: string
  schoolId: number
  schoolName: string
}

interface ApiEnvelope<T> {
  result: 'SUCCESS' | 'FAIL'
  data: T | null
  title: string | null
  message: string | null
}

async function parseOrThrow<T>(res: Response, fallbackMessage: string): Promise<T> {
  const body: ApiEnvelope<T> = await res.json()
  if (!res.ok) {
    throw new Error(body.message ?? fallbackMessage)
  }
  return body.data as T
}

export async function sendVerificationCode(
  pendingKey: string,
  schoolId: number,
  email: string
): Promise<void> {
  const res = await fetch('/api/verification/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ pendingKey, schoolId, email }),
  })
  await parseOrThrow<void>(res, '인증 메일 전송에 실패했습니다.')
}

export async function verifyCode(
  pendingKey: string,
  schoolId: number,
  email: string,
  code: string
): Promise<VerifiedSignupProfile> {
  const res = await fetch('/api/verification/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ pendingKey, schoolId, email, code }),
  })
  return parseOrThrow<VerifiedSignupProfile>(res, '인증 코드가 올바르지 않습니다.')
}
