import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { sendVerificationEmail, verifySchoolEmailCode } from '../../api/schoolEmailAuth'
import { SCHOOLS, type School } from './schools'

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
// TODO: 실제 정책에 맞게 조정 예정 (사용자가 직접 수정할 예정)
const RESEND_COOLDOWN = 30

export function SchoolEmailVerifyPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('school')
  const [school, setSchool] = useState<School | null>(null)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState<string[]>(Array(6).fill(''))
  const [error, setError] = useState('')
  const [secondsLeft, setSecondsLeft] = useState(298)
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN)
  const [isSending, setIsSending] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [showInvalidAccessModal, setShowInvalidAccessModal] = useState(false)

  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailForm>({ resolver: zodResolver(emailSchema) })

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
    setStep('email')
  }

  const onSubmitEmail = async ({ local }: EmailForm) => {
    if (!school) return
    const fullEmail = `${local}@${school.domain}`
    setIsSending(true)
    try {
      // ⚠️ MOCK 호출 — schoolEmailAuth.ts 참고
      await sendVerificationEmail(fullEmail)
      setEmail(fullEmail)
      setStep('code')
      setSecondsLeft(298)
      setResendCooldown(RESEND_COOLDOWN)
      setTimeout(() => codeInputRefs.current[0]?.focus(), 0)
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
    const entered = code.join('')
    if (entered.length < 6) {
      setError('6자리를 모두 입력해주세요.')
      return
    }
    setIsVerifying(true)
    try {
      // ⚠️ MOCK 호출 — schoolEmailAuth.ts 참고 (정답코드 '482913' 하드코딩됨)
      const isValid = await verifySchoolEmailCode(email, entered)
      if (!isValid) {
        setError('코드가 일치하지 않아요. 다시 확인해주세요.')
        return
      }
      setError('')
      setStep('done')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResend = async () => {
    if (resendCooldown > 0) return
    setCode(Array(6).fill(''))
    setError('')
    setSecondsLeft(298)
    setResendCooldown(RESEND_COOLDOWN)
    await sendVerificationEmail(email)
    codeInputRefs.current[0]?.focus()
  }

  const handleGoHome = () => {
    navigate('/feed', { replace: true })
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

          <div className="flex flex-col gap-2">
            {SCHOOLS.map((s) => (
              <button
                key={s.id}
                onClick={() => handleSelectSchool(s)}
                className="w-full text-left px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 hover:border-primary hover:bg-primary-light transition-colors"
              >
                {s.name}
              </button>
            ))}
          </div>
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
            <span className="text-sm text-slate-500 whitespace-nowrap">@{school.domain}</span>
          </div>
          {errors.local && (
            <p className="text-xs text-red-500 mb-2">{errors.local.message}</p>
          )}
          <div className="mb-6" />

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

      {step === 'done' && school && (
        <div className="text-center py-5">
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
            <span className="text-2xl text-green-600">✓</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">인증이 완료됐어요</h1>
          <p className="text-sm text-slate-500 mb-7 leading-relaxed">
            이제 {school.name} 뱃지와 함께
            <br />
            동행 게시글을 작성할 수 있어요.
          </p>
          <button
            onClick={handleGoHome}
            className="w-full h-11 rounded-xl bg-primary text-white font-medium"
          >
            홈으로 이동
          </button>
        </div>
      )}
    </div>
  )
}