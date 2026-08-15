import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { sendVerificationEmail, verifySchoolEmailCode } from '../../api/schoolEmailAuth'
import { SCHOOLS, type School } from './schools'

const emailSchema = z.object({
  local: z.string().min(1, '이메일을 입력해주세요.'),
})
type EmailForm = z.infer<typeof emailSchema>

// ⚠️ 'school' 단계 추가됨 — 학교를 먼저 선택해야 이메일 도메인이 정해짐
type Step = 'school' | 'email' | 'code' | 'done'

export function SchoolEmailVerifyPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('school')
  const [school, setSchool] = useState<School | null>(null)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState<string[]>(Array(6).fill(''))
  const [error, setError] = useState('')
  const [secondsLeft, setSecondsLeft] = useState(298)
  const [isSending, setIsSending] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)

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
    if (!school) return // 방어 코드: school 단계를 건너뛸 수 없게
    const fullEmail = `${local}@${school.domain}`
    setIsSending(true)
    try {
      // ⚠️ MOCK 호출 — schoolEmailAuth.ts 참고
      await sendVerificationEmail(fullEmail)
      setEmail(fullEmail)
      setStep('code')
      setSecondsLeft(298)
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
    setCode(Array(6).fill(''))
    setError('')
    setSecondsLeft(298)
    await sendVerificationEmail(email)
    codeInputRefs.current[0]?.focus()
  }

  const progressMap: Record<Step, number> = { school: 25, email: 50, code: 80, done: 100 }
  const progress = progressMap[step]

  const handleBack = () => {
    if (step === 'email') setStep('school')
    else if (step === 'school') navigate(-1)
    else navigate(-1)
  }

  return (
    <div className="min-h-screen px-6 py-7 bg-white">
      <div className="flex items-center gap-2.5 mb-7">
        <button onClick={handleBack} className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
          ←
        </button>
        <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

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
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
            />
            <span className="text-sm text-slate-500 whitespace-nowrap">@{school.domain}</span>
          </div>
          {errors.local && (
            <p className="text-xs text-red-500 mb-2">{errors.local.message}</p>
          )}
          <p className="text-xs text-slate-400 mb-6">
            {school.name}으로 선택하셨어요.{' '}
            <span
              onClick={() => setStep('school')}
              className="text-slate-600 font-medium cursor-pointer underline"
            >
              학교 변경
            </span>
          </p>

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
                className="w-full text-center text-lg py-2.5 rounded-xl border border-slate-200"
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
            className="w-full h-11 rounded-xl border border-slate-300 text-slate-600 font-medium"
          >
            코드 재전송
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
            onClick={() => navigate('/feed')}
            className="w-full h-11 rounded-xl bg-primary text-white font-medium"
          >
            홈으로 이동
          </button>
        </div>
      )}
    </div>
  )
}