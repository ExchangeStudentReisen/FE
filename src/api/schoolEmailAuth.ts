// ============================================================
// ⚠️ MOCK 함수 — 백엔드 연결 시 아래 두 함수 내부 로직을 실제 API 호출로 교체 필요
// ============================================================

/**
 * 학교 이메일로 인증 코드를 발송한다.
 * 
 * TODO(백엔드 연결):
 * 실제로는 아래처럼 서버에 이메일 발송을 요청해야 함
 * 
 * export async function sendVerificationEmail(email: string): Promise<void> {
 *   const res = await fetch('/api/auth/school-email/send', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ email }),
 *   })
 *   if (!res.ok) throw new Error('인증 메일 전송에 실패했습니다.')
 * }
 */
export async function sendVerificationEmail(email: string): Promise<void> {
  // MOCK: 네트워크 지연만 흉내냄. 실제 이메일은 전송되지 않음.
  await new Promise((resolve) => setTimeout(resolve, 800))
  console.log(`[mock] ${email}로 인증 코드 전송됨`)
}

/**
 * 입력한 인증 코드가 맞는지 서버에서 검증한다.
 * 
 * TODO(백엔드 연결):
 * 실제로는 서버가 저장해둔 코드와 비교해야 하므로, 정답 코드를 프론트에 두면 안 됨
 * 
 * export async function verifySchoolEmailCode(email: string, code: string): Promise<boolean> {
 *   const res = await fetch('/api/auth/school-email/verify', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ email, code }),
 *   })
 *   if (!res.ok) return false
 *   const data = await res.json()
 *   return data.verified === true
 * }
 */
export async function verifySchoolEmailCode(email: string, code: string): Promise<boolean> {
  // MOCK: 정답 코드가 프론트에 하드코딩되어 있음 — 실제 서비스에서는 절대 이렇게 하면 안 됨
  await new Promise((resolve) => setTimeout(resolve, 500))
  const MOCK_CORRECT_CODE = '482913' // ⚠️ 테스트용, 백엔드 연결 시 제거
  return code === MOCK_CORRECT_CODE
}