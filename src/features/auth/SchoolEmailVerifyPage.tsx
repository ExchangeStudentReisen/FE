import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useSendVerification, useVerifyCode } from '../../hooks/useVerfication'
import { useSignup } from '../../hooks/useAuth'
import { useSignupStore } from '../../stores/signupStore'
import { useSchools, useReportDomain } from '../../hooks/useSchools'
import type { School } from '../../types/school'
import type { VerifiedProfileData } from '../../types/verfication'

// 영문자 1개 이상 포함 + 영문/숫자만 허용
const LOCAL_PART_REGEX = /^(?=.*[a-zA-Z])[a-zA-Z0-9]{2,}$/

const emailSchema = z.object({
  local: z
    .string()
    .min(1, '이메일을 입력해주세요.')
    .regex(LOCAL_PART_REGEX, '올바른 이메일 형식이 아니에요.'),
})
type EmailForm = z.infer<typeof emailSchema>

// TODO: 실제 dispatchCountry enum 전체 목록으로 교체 예정
const DISPATCH_COUNTRIES = [
  { value: 'GERMANY', label: '독일' },
  { value: 'FRANCE', label: '프랑스' },
  { value: 'ITALY', label: '이탈리아' },
  { value: 'SPAIN', label: '스페인' },
  { value: 'NETHERLANDS', label: '네덜란드' },
  { value: 'UK', label: '영국' },
]

type Step = 'school' | 'email' | 'code' | 'dispatch' | 'done'

const STEP_META: Record<Step, { title: string; index: number }> = {
  school: { title: '학교 선택', index: 1 },
  email: { title: '이메일 인증', index: 2 },
  code: { title: '인증 코드', index: 3 },
  dispatch: { title: '파견 지역', index: 4 },
  done: { title: '완료', index: 5 },
}
const TOTAL_STEPS = 5
const RESEND_COOLDOWN = 60 // 스웨거 명세 기준

export function SchoolEmailVerifyPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('school')
  const [school, setSchool] = useState<School | null>(null)
  const [domainIndex, setDomainIndex] = useState(0)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState<string[]>(Array(6).fill(''))
  const [error, setError] = useState('')
  const [secondsLeft, setSecondsLeft] = useState(298)
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN)
  const [isVerifying, setIsVerifying] = useState(false)
  const [showInvalidAccessModal, setShowInvalidAccessModal] = useState(false)
  const [verifiedProfile, setVerifiedProfile] = useState<VerifiedProfileData | null>(null)
  const [editableName, setEditableName] = useState('')
  const [dispatchCountry, setDispatchCountry] = useState('')
  const [selectedGender, setSelectedGender] = useState<'MALE' | 'FEMALE' | null>(null)
  const [signupError, setSignupError] = useState('')
  const [schoolSearch, setSchoolSearch] = useState('')
  const [countrySearch, setCountrySearch] = useState('')
  const [showDomainReportModal, setShowDomainReportModal] = useState(false)
  const [domainReportMessage, setDomainReportMessage] = useState('')
  const [domainReportSubmitted, setDomainReportSubmitted] = useState(false)

  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([])

  const { data: schoolsData, isLoading: isSchoolsLoading } = useSchools()
  const schools = schoolsData?.data ?? []
  const filteredSchools = schools.filter((s) =>
    s.name.toLowerCase().includes(schoolSearch.toLowerCase()),
  )
  const filteredCountries = DISPATCH_COUNTRIES.filter(
    (c) =>
      c.label.includes(countrySearch) ||
      c.value.toLowerCase().includes(countrySearch.toLowerCase()),
  )
  const pendingKey = useSignupStore((s) => s.key)
  const sendVerification = useSendVerification()
  const verifyCode = useVerifyCode()
  const signup = useSignup()
  const reportDomain = useReportDomain()

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
    setDomainIndex(0)
    setStep('email')
  }

  const onSubmitEmail = ({ local }: EmailForm) => {
    if (!school) return
    if (!pendingKey) {
      setError('잘못된 접근이에요. 처음부터 다시 시도해주세요.')
      return
    }
    const fullEmail = `${local}@${school.emailDomains[domainIndex]}`

    // 발송 완료를 기다리지 않고 바로 다음 화면으로 이동 — 실패 시 code 화면에서 에러 표시
    sendVerification.mutate(
      { pendingKey, schoolId: school.id, email: fullEmail },
      {
        onError: () => {
          setError('인증 메일 발송에 실패했어요. 코드 재전송을 눌러 다시 시도해주세요.')
        },
      },
    )

    setEmail(fullEmail)
    setStep('code')
    setSecondsLeft(298)
    setResendCooldown(RESEND_COOLDOWN)
    setTimeout(() => codeInputRefs.current[0]?.focus(), 0)
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
    if (!school || !pendingKey) {
      setError('잘못된 접근이에요. 처음부터 다시 시도해주세요.')
      return
    }
    setIsVerifying(true)
    try {
      const res = await verifyCode.mutateAsync({
        pendingKey,
        schoolId: school.id,
        email,
        code: entered,
      })
      setError('')
      setVerifiedProfile(res.data)
      setEditableName(res.data.nickname)
      setStep('dispatch')
    } catch {
      setError('코드가 일치하지 않아요. 다시 확인해주세요.')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResend = async () => {
    if (resendCooldown > 0) return
    if (!pendingKey || !school) return
    setCode(Array(6).fill(''))
    setError('')
    setSecondsLeft(298)
    setResendCooldown(RESEND_COOLDOWN)
    try {
      await sendVerification.mutateAsync({ pendingKey, schoolId: school.id, email })
      codeInputRefs.current[0]?.focus()
    } catch {
      setError('재전송에 실패했어요. 다시 시도해주세요.')
    }
  }

  const handleSubmitDispatch = async () => {
    if (!pendingKey || !verifiedProfile) return
    if (!editableName.trim()) {
      setSignupError('이름을 입력해주세요.')
      return
    }
    const gender = verifiedProfile.gender ?? selectedGender
    if (!gender) {
      setSignupError('성별을 선택해주세요.')
      return
    }
    if (!dispatchCountry) {
      setSignupError('파견 지역을 선택해주세요.')
      return
    }
    setSignupError('')
    try {
      await signup.mutateAsync({
        pendingKey,
        name: editableName.trim(),
        dispatchCountry,
        ...(verifiedProfile.gender ? {} : { gender }),
      })
      useSignupStore.getState().reset()
      setStep('done')
    } catch {
      setSignupError('회원가입에 실패했어요. 다시 시도해주세요.')
    }
  }

  const handleGoHome = () => {
    navigate('/feed', { replace: true })
  }

  const handleBack = () => {
    if (step === 'dispatch') setStep('code')
    else if (step === 'code') setStep('email')
    else if (step === 'email') setStep('school')
    else setShowInvalidAccessModal(true) // school 단계: 잘못된 접근으로 안내
  }

  const handleConfirmInvalidAccess = () => {
    setShowInvalidAccessModal(false)
    navigate('/', { replace: true })
  }

  const handleSubmitDomainReport = () => {
    if (!school || !domainReportMessage.trim()) return
    reportDomain.mutate(
      { id: school.id, payload: { message: domainReportMessage } },
      {
        onSuccess: () => {
          setDomainReportSubmitted(true)
        },
      },
    )
  }

  const closeDomainReportModal = () => {
    setShowDomainReportModal(false)
    setDomainReportMessage('')
    setDomainReportSubmitted(false)
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

      {showDomainReportModal && school && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-8">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            {domainReportSubmitted ? (
              <div className="text-center">
                <p className="text-base font-semibold text-slate-900 mb-2">제보가 접수됐어요</p>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                  확인 후 학교 정보를 업데이트할게요. 감사해요!
                </p>
                <button
                  onClick={closeDomainReportModal}
                  className="w-full h-11 rounded-xl bg-primary text-white font-medium"
                >
                  확인
                </button>
              </div>
            ) : (
              <>
                <p className="text-base font-semibold text-slate-900 mb-2">도메인 제보하기</p>
                <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                  {school.name}의 실제 이메일 도메인을 알려주세요.
                </p>
                <textarea
                  value={domainReportMessage}
                  onChange={(e) => setDomainReportMessage(e.target.value)}
                  placeholder="예: 실제 도메인은 @abc.ac.kr이에요"
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm mb-4 resize-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={closeDomainReportModal}
                    className="flex-1 h-11 rounded-xl border border-slate-300 text-slate-600 font-medium"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleSubmitDomainReport}
                    disabled={!domainReportMessage.trim() || reportDomain.isPending}
                    className="flex-1 h-11 rounded-xl bg-primary text-white font-medium disabled:opacity-50"
                  >
                    {reportDomain.isPending ? '전송 중...' : '제보하기'}
                  </button>
                </div>
              </>
            )}
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

          {isSchoolsLoading ? (
            <p className="text-sm text-slate-400">학교 목록 불러오는 중...</p>
          ) : (
            <>
              <input
                value={schoolSearch}
                onChange={(e) => setSchoolSearch(e.target.value)}
                placeholder="학교 이름 검색"
                className="w-full px-4 py-2.5 rounded-xl border-2 border-primary text-sm mb-3 focus:outline-none"
              />
              <div className="flex flex-col gap-2">
                {filteredSchools.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSelectSchool(s)}
                    className="w-full text-left px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 hover:border-primary hover:bg-primary-light transition-colors"
                  >
                    {s.name}
                  </button>
                ))}
                {filteredSchools.length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-4">검색 결과가 없어요.</p>
                )}
              </div>
            </>
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
            학교 이메일 인증을 통해
            <br />
            해당 학교 학생들이 서비스를 이용하고 있어요.
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
            {school.emailDomains.length > 1 ? (
              <select
                value={domainIndex}
                onChange={(e) => setDomainIndex(Number(e.target.value))}
                className="text-sm text-slate-500 border border-slate-200 rounded-lg px-2 py-2.5"
              >
                {school.emailDomains.map((d, i) => (
                  <option key={d} value={i}>
                    @{d}
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-sm text-slate-500 whitespace-nowrap">
                @{school.emailDomains[0]}
              </span>
            )}
          </div>
          {errors.local && (
            <p className="text-xs text-red-500 mb-2">{errors.local.message}</p>
          )}
          <p className="text-xs text-red-500 mb-2 min-h-4">{error}</p>

          <button
            type="submit"
            className="w-full h-11 rounded-xl bg-primary text-white font-medium disabled:opacity-50"
          >
            인증 메일 보내기
          </button>

          <div className="flex justify-end mt-2">
            <button
              type="button"
              onClick={() => setShowDomainReportModal(true)}
              className="text-xs text-slate-400 underline"
            >
              학교 이메일 도메인이 다른가요? 제보하기
            </button>
          </div>
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
          <p className="text-xs text-red-500 mb-5 min-h-4">{error}</p>

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

          <p className="text-xs text-slate-400 mt-4 leading-relaxed">
            이메일 주소가 정확한지 다시 한 번 확인해주세요. 코드가 보이지 않는다면 스팸
            메일함도 확인해주세요.
          </p>
        </div>
      )}

      {step === 'dispatch' && verifiedProfile && (
        <div>
          <p className="text-sm text-primary font-medium mb-1.5">마지막 단계</p>
          <h1 className="text-xl font-bold text-slate-900 leading-snug mb-2">
            파견 지역을
            <br />
            알려주세요
          </h1>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            같은 지역 친구들을 더 쉽게 찾을 수 있어요.
          </p>

          <label className="text-sm text-slate-500 block mb-1.5">이름(닉네임)</label>
          <input
            value={editableName}
            onChange={(e) => setEditableName(e.target.value)}
            placeholder="네이버에서 가져온 이름"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm mb-5"
          />

          <label className="text-sm text-slate-500 block mb-1.5">성별</label>
          {verifiedProfile.gender ? (
            <div className="flex gap-2 mb-5">
              <button
                type="button"
                disabled
                className={`flex-1 h-11 rounded-xl border text-sm font-medium disabled:cursor-not-allowed ${
                  verifiedProfile.gender === 'MALE'
                    ? 'border-primary bg-primary-light text-primary'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                남성
              </button>
              <button
                type="button"
                disabled
                className={`flex-1 h-11 rounded-xl border text-sm font-medium disabled:cursor-not-allowed ${
                  verifiedProfile.gender === 'FEMALE'
                    ? 'border-primary bg-primary-light text-primary'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                여성
              </button>
            </div>
          ) : (
            <div className="flex gap-2 mb-5">
              <button
                type="button"
                onClick={() => setSelectedGender('MALE')}
                className={`flex-1 h-11 rounded-xl border text-sm font-medium ${
                  selectedGender === 'MALE'
                    ? 'border-primary bg-primary-light text-primary'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                남성
              </button>
              <button
                type="button"
                onClick={() => setSelectedGender('FEMALE')}
                className={`flex-1 h-11 rounded-xl border text-sm font-medium ${
                  selectedGender === 'FEMALE'
                    ? 'border-primary bg-primary-light text-primary'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                여성
              </button>
            </div>
          )}

          <label className="text-sm text-slate-500 block mb-1.5">파견 국가</label>
          <input
            value={countrySearch}
            onChange={(e) => setCountrySearch(e.target.value)}
            placeholder="국가 이름 검색"
            className="w-full px-4 py-2.5 rounded-xl border-2 border-primary text-sm mb-2 focus:outline-none"
          />
          <div className="flex flex-col gap-1.5 mb-5 max-h-48 overflow-y-auto">
            {filteredCountries.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setDispatchCountry(c.value)}
                className={`w-full text-left px-4 py-2.5 rounded-xl border text-sm font-medium ${
                  dispatchCountry === c.value
                    ? 'border-primary bg-primary-light text-primary'
                    : 'border-slate-200 text-slate-700'
                }`}
              >
                {c.label}
              </button>
            ))}
            {filteredCountries.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-4">검색 결과가 없어요.</p>
            )}
          </div>

          <p className="text-xs text-red-500 mb-3 min-h-4">{signupError}</p>

          <button
            onClick={handleSubmitDispatch}
            disabled={signup.isPending}
            className="w-full h-11 rounded-xl bg-primary text-white font-medium disabled:opacity-50"
          >
            {signup.isPending ? '가입하는 중...' : '가입 완료하기'}
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
            {school.name} 학생 인증이 완료됐어요.
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