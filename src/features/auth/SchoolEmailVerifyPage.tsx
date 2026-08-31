import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useLocation, useNavigate } from 'react-router-dom'
import { sendVerificationCode, verifyCode, type VerifiedSignupProfile } from '../../api/schoolEmailAuth'

interface School {
  id: number
  name: string
  emailDomains: string[]
}

// 영문자 1개 이상 포함 + 영문/숫자만 허용
const LOCAL_PART_REGEX = /^(?=.*[a-zA-Z])[a-zA-Z0-9]{2,}$/

const emailSchema = z.object({
  local: z
    .string()
    .min(1, '이메일을 입력해주세요.')
    .regex(LOCAL_PART_REGEX, '올바른 이메일 형식이 아니에요.'),
})
type EmailForm = z.infer<typeof emailSchema>

type Step = 'school' | 'email' | 'code' | 'done'

const STEP_META: Record<Step, { title: string; index: number }> = {
  school: { title: '학교 선택', index: 1 },
  email: { title: '이메일 인증', index: 2 },
  code: { title: '인증 코드', index: 3 },
  done: { title: '완료', index: 4 },
}
const TOTAL_STEPS = 4
const RESEND_COOLDOWN = 60

export function SchoolEmailVerifyPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const pendingKey: string = (location.state as { pendingKey?: string })?.pendingKey ?? ''

  const [schools, setSchools] = useState<School[]>([])
  const [loadingSchools, setLoadingSchools] = useState(true)

  const [step, setStep] = useState<Step>('school')
  const [school, setSchool] = useState<School | null>(null)
  const [domain, setDomain] = useState('')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState<string[]>(Array(6).fill(''))
  const [emailError, setEmailError] = useState('')
  const [error, setError] = useState('')
  const [secondsLeft, setSecondsLeft] = useState(298)
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN)
  const [isSending, setIsSending] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [showInvalidAccessModal, setShowInvalidAccessModal] = useState(false)
  const [verified, setVerified] = useState<VerifiedSignupProfile | null>(null)

  const [showReportForm, setShowReportForm] = useState(false)
  const [reportMessage, setReportMessage] = useState('')
  const [isReportSubmitting, setIsReportSubmitting] = useState(false)
  const [reportSubmitted, setReportSubmitted] = useState(false)

  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailForm>({ resolver: zodResolver(emailSchema) })

  useEffect(() => {
    if (!pendingKey) {
      navigate('/', { replace: true })
      return
    }
    fetch('/api/schools', { credentials: 'include' })
      .then((r) => r.json())
      .then((body) => setSchools(body.data ?? []))
      .finally(() => setLoadingSchools(false))
  }, [])

  useEffect(() => {
    if (step !== 'code') return
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0))
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [step])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${m}:${sec}`
  }

  const handleSelectSchool = (selected: School) => {
    setSchool(selected)
    setDomain(selected.emailDomains[0] ?? '')
    setShowReportForm(false)
    setReportMessage('')
    setReportSubmitted(false)
    setStep('email')
  }

  const handleSubmitReport = async () => {
    if (!school || !reportMessage.trim()) return
    setIsReportSubmitting(true)
    try {
      const res = await fetch(`/api/schools/${school.id}/domain-reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ message: reportMessage.trim() }),
      })
      if (res.ok) {
        setReportSubmitted(true)
        setShowReportForm(false)
        setReportMessage('')
      }
    } finally {
      setIsReportSubmitting(false)
    }
  }

  const onSubmitEmail = async ({ local }: EmailForm) => {
    if (!school || !domain) return
    const fullEmail = `${local}@${domain}`
    setIsSending(true)
    setEmailError('')
    try {
      await sendVerificationCode(pendingKey, school.id, fullEmail)
      setEmail(fullEmail)
      setStep('code')
      setSecondsLeft(298)
      setResendCooldown(RESEND_COOLDOWN)
      setCode(Array(6).fill(''))
      setTimeout(() => codeInputRefs.current[0]?.focus(), 0)
    } catch (e) {
      setEmailError(e instanceof Error ? e.message : '인증 메일 전송에 실패했습니다.')
    } finally {
      setIsSending(false)
    }
  }

  const handleCodeChange = (index: number, value: string) => {
    const digit = value.replace(/[^0-9]/g, '').slice(0, 1)
    const next = [...code]
    next[index] = digit
    setCode(next)
    if (digit && index < 5) {
      codeInputRefs.current[index + 1]?.focus()
    }
  }

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = async () => {
    if (!school) return
    const entered = code.join('')
    if (entered.length < 6) {
      setError('6자리를 모두 입력해주세요.')
      return
    }
    setIsVerifying(true)
    setError('')
    try {
      const result = await verifyCode(pendingKey, school.id, email, entered)
      setVerified(result)
      setStep('done')
    } catch (e) {
      setError(e instanceof Error ? e.message : '코드가 일치하지 않아요. 다시 확인해주세요.')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResend = async () => {
    if (resendCooldown > 0 || !school) return
    setCode(Array(6).fill(''))
    setError('')
    try {
      await sendVerificationCode(pendingKey, school.id, email)
      setSecondsLeft(298)
      setResendCooldown(RESEND_COOLDOWN)
      codeInputRefs.current[0]?.focus()
    } catch (e) {
      setError(e instanceof Error ? e.message : '재전송에 실패했습니다.')
    }
  }

  const handleGoToProfileSetup = () => {
    if (!verified) return
    navigate('/onboarding/profile', { replace: true, state: { pendingKey, verified } })
  }

  const handleBack = () => {
    if (step === 'code') setStep('email')
    else if (step === 'email') setStep('school')
    else setShowInvalidAccessModal(true) // school 단계: 잘못된 접근으로 안내
  }

  const handleConfirmInvalidAccess = () => {
    setShowInvalidAccessModal(false)
    navigate('/', { replace: true })
  }

  const { title, index } = STEP_META[step]
  const progress = (index / TOTAL_STEPS) * 100

  return (
    <div className="min-h-screen px-6 py-7 bg-white relative">
      {showInvalidAccessModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-8">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center">
            <p className="text-base font-semibold text-slate-900 mb-2">잘못된 접근이에요</p>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              학교 선택부터 다시 시작해주세요.
            </p>
            <button
              onClick={handleConfirmInvalidAccess}
              className="w-full h-11 rounded-xl bg-primary text-white font-medium"
            >
              확인
            </button>
          </div>
        </div>
      )}

      {step !== 'done' && (
        <div className="mb-1">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={handleBack}
              className="w-9 h-9 flex items-center justify-start -ml-1.5 text-slate-700 text-lg"
              aria-label="뒤로가기"
            >
              ‹
            </button>
            <span className="text-sm font-medium text-slate-900">{title}</span>
            <span className="text-xs text-slate-400 w-9 text-right">
              {index} / {TOTAL_STEPS}
            </span>
          </div>
          <div className="h-1 bg-slate-100 rounded-full overflow-hidden mb-7">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {step === 'school' && (
        <div>
          <p className="text-sm text-primary font-medium mb-1.5">본인 인증</p>
          <h1 className="text-xl font-bold text-slate-900 leading-snug mb-2">
            재학 중인 학교를
            <br />
            선택해주세요
          </h1>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            선택한 학교의 공식 이메일로 인증을 진행해요.
          </p>

          {loadingSchools ? (
            <p className="text-sm text-slate-400">불러오는 중...</p>
          ) : (
            <div className="flex flex-col gap-2">
              {schools.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSelectSchool(s)}
                  className="w-full text-left px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 hover:border-primary hover:bg-primary-light transition-colors"
                >
                  {s.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {step === 'email' && school && (
        <form onSubmit={handleSubmit(onSubmitEmail)}>
          <p className="text-sm text-primary font-medium mb-1.5">본인 인증</p>
          <h1 className="text-xl font-bold text-slate-900 leading-snug mb-2">
            학교 이메일을
            <br />
            인증해주세요
          </h1>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            재학 중인 학교의 공식 이메일로 인증하면
            <br />
            교환학생 동행 상대에게 학교 뱃지가 표시돼요.
          </p>

          <label className="text-sm text-slate-500 block mb-1.5">학교 이메일</label>
          <div className="flex items-center gap-2 mb-1.5">
            <input
              {...register('local')}
              placeholder="yourname"
              className={`flex-1 px-4 py-2.5 rounded-xl border text-sm ${
                errors.local
                  ? 'border-red-400 text-red-500 placeholder:text-red-400'
                  : 'border-slate-200'
              }`}
            />
            <span className="text-sm text-slate-500 whitespace-nowrap">@</span>
            {school.emailDomains.length > 1 ? (
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="px-2 py-2.5 rounded-xl border border-slate-200 text-sm bg-white outline-none focus:border-primary"
              >
                {school.emailDomains.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-sm text-slate-500 whitespace-nowrap">{domain}</span>
            )}
          </div>
          {errors.local && (
            <p className="text-xs text-red-500 mb-2">{errors.local.message}</p>
          )}
          {emailError && (
            <p className="text-xs text-red-500 mb-2">{emailError}</p>
          )}

          {reportSubmitted ? (
            <p className="text-xs text-green-600 mb-6">제보해주셔서 감사합니다. 확인 후 반영할게요.</p>
          ) : showReportForm ? (
            <div className="mb-6">
              <textarea
                value={reportMessage}
                onChange={(e) => setReportMessage(e.target.value)}
                placeholder="예: 실제 학교 이메일 도메인은 g.hanyang.ac.kr이에요."
                rows={3}
                maxLength={500}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-primary resize-none"
              />
              <div className="flex gap-2 mt-1.5">
                <button
                  type="button"
                  onClick={handleSubmitReport}
                  disabled={isReportSubmitting || !reportMessage.trim()}
                  className="h-8 px-3 rounded-lg bg-slate-800 text-white text-xs font-medium disabled:opacity-50"
                >
                  {isReportSubmitting ? '전송 중...' : '제보하기'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowReportForm(false)}
                  className="h-8 px-3 rounded-lg border border-slate-200 text-slate-500 text-xs font-medium"
                >
                  취소
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowReportForm(true)}
              className="text-xs text-slate-400 underline mb-6"
            >
              이메일 도메인이 잘못됐나요? 제보하기
            </button>
          )}

          <button
            type="submit"
            disabled={isSending}
            className="w-full h-11 rounded-xl bg-primary text-white font-medium disabled:opacity-50"
          >
            {isSending ? '전송 중...' : '인증 메일 보내기'}
          </button>
        </form>
      )}

      {step === 'code' && (
        <div>
          <p className="text-sm text-primary font-medium mb-1.5">본인 인증</p>
          <h1 className="text-xl font-bold text-slate-900 leading-snug mb-2">
            인증 코드를
            <br />
            입력해주세요
          </h1>
          <p className="text-sm text-slate-500 mb-1 leading-relaxed">
            <span className="text-slate-900 font-medium">{email}</span>로
            <br />
            6자리 코드를 보냈어요.
          </p>
          <p className="text-xs text-red-500 mb-5">{formatTime(secondsLeft)}</p>

          <div className="flex gap-2 mb-1.5">
            {code.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { codeInputRefs.current[i] = el }}
                value={digit}
                maxLength={1}
                inputMode="numeric"
                onChange={(e) => handleCodeChange(i, e.target.value)}
                onKeyDown={(e) => handleCodeKeyDown(i, e)}
                className={`w-full aspect-square text-center text-lg rounded-xl border ${
                  error ? 'border-red-400' : 'border-slate-200'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-red-500 mb-5 min-h-[16px]">{error}</p>

          <button
            onClick={handleVerify}
            disabled={isVerifying}
            className="w-full h-11 rounded-xl bg-primary text-white font-medium mb-3 disabled:opacity-50"
          >
            {isVerifying ? '확인 중...' : '인증 확인'}
          </button>
          <button
            onClick={handleResend}
            disabled={resendCooldown > 0}
            className="w-full h-11 rounded-xl border border-slate-300 text-slate-600 font-medium disabled:opacity-50 disabled:text-slate-400"
          >
            {resendCooldown > 0 ? `코드 재전송 (${resendCooldown}초 후 가능)` : '코드 재전송'}
          </button>
        </div>
      )}

      {step === 'done' && verified && (
        <div className="text-center py-5">
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
            <span className="text-2xl text-green-600">✓</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">인증이 완료됐어요</h1>
          <p className="text-sm text-slate-500 mb-7 leading-relaxed">
            이제 {verified.schoolName} 뱃지와 함께
            <br />
            동행 게시글을 작성할 수 있어요.
          </p>
          <button
            onClick={handleGoToProfileSetup}
            className="w-full h-11 rounded-xl bg-primary text-white font-medium"
          >
            다음: 프로필 설정
          </button>
        </div>
      )}
    </div>
  )
}
