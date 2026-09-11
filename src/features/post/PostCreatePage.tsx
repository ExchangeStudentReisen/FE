import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, ChevronDown, Link as LinkIcon, Check, ShieldCheck, CalendarClock } from 'lucide-react'
import { createPostCreateSchema, STEP_FIELDS, type PostCreateFormValues } from '../../schemas/postCreateSchema'
import { RECRUIT_GENDER_TO_API, type CreatePostRequest, type RecruitGender, type Country } from '../../types/post'
import { FormStepHeader } from '../../components/FormStepHeader.tsx'
import { COUNTRY_OPTIONS, RECENT_COUNTRY_CODES } from '../../mocks/countryMock'
import { useMyProfile } from '../../hooks/useMyProfile'
import { calculateAge } from '../../utils/eligibility'
import { createPost } from '../../api/post'

const TOTAL_STEPS = 3

// Step 2 · 모집 정보
const GENDER_OPTIONS: { value: RecruitGender; label: string }[] = [
  { value: 'any', label: '상관없음' },
  { value: 'female', label: '여성만' },
  { value: 'male', label: '남성만' },
]
const HEADCOUNT_OPTIONS = [1, 2, 3, 4] as const
// 교환학생 대상 서비스이므로 연령 범위는 20~30세로 고정
const MIN_AGE = 20
const MAX_AGE = 30

// 듀얼 레인지 슬라이더 핸들 스타일 (Tailwind 임의 변형자로 의사요소 스타일링).
// 트랙(빈 공간)은 클릭을 무시하고 실제 원형 핸들만 반응하도록 pointer-events를 썸에만 열어두고,
// 트랙 높이를 0으로 눌러둔 만큼 원(20px)을 위로 절반(-mt-2.5 = -10px) 당겨 세로 중앙에 오도록 함
const RANGE_THUMB_CLASS = [
  'absolute top-0 h-5 w-full appearance-none bg-transparent pointer-events-none',
  '[&::-webkit-slider-runnable-track]:appearance-none [&::-webkit-slider-runnable-track]:h-0',
  '[&::-moz-range-track]:bg-transparent [&::-moz-range-track]:h-0',
  '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto',
  '[&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:-mt-2.5',
  '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white',
  '[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-600',
  '[&::-webkit-slider-thumb]:shadow-[0_1px_3px_rgba(0,0,0,0.2)] [&::-webkit-slider-thumb]:cursor-pointer',
  '[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5',
  '[&::-moz-range-thumb]:-mt-2.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white',
  '[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-blue-600',
  '[&::-moz-range-thumb]:shadow-[0_1px_3px_rgba(0,0,0,0.2)] [&::-moz-range-thumb]:cursor-pointer',
].join(' ')

// Step 1 · 도시 · 날짜
function formatDate(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function formatDisplay(iso: string) {
  const date = new Date(iso)
  const days = ['일', '월', '화', '수', '목', '금', '토']
  return `${date.getMonth() + 1}월 ${date.getDate()}일 (${days[date.getDay()]})`
}

export function PostCreatePage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<1 | 2 | 3>(1)

  const { data: myProfile } = useMyProfile()
  // 서비스 연령 범위(20~30세) 밖이면(프로필 미로딩 포함) 나이 범위 검증을 건너뜀
  const myAge = myProfile ? calculateAge(myProfile.birthYear) : undefined
  const myAgeForValidation = myAge !== undefined && myAge >= MIN_AGE && myAge <= MAX_AGE ? myAge : undefined
  const schema = useMemo(() => createPostCreateSchema(myAgeForValidation), [myAgeForValidation])

  const { watch, setValue, register, trigger, handleSubmit, formState: { errors } } = useForm<PostCreateFormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      country: '', city: '', startDate: '', endDate: '',
      recruitGender: 'any', minAge: 20, maxAge: 23, headcount: 1,
      title: '', content: '', kakaoOpenChatUrl: '',
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: CreatePostRequest) => createPost(payload),
    onSuccess: (res) => {
      // TODO: result !== 'SUCCESS' 케이스(실패 응답) 핸들링 필요 — 백엔드 에러 스펙 확인 후 추가
      navigate(`/post/${res.data.id}`)
    },
  })

  const goBack = () => {
    if (step === 1) { navigate(-1); return }
    setStep((prev) => (prev - 1) as 1 | 2 | 3)
  }

  const goNext = async () => {
    const valid = await trigger(STEP_FIELDS[step])
    if (valid) setStep((prev) => (prev + 1) as 1 | 2 | 3)
  }

  const onSubmit = (values: PostCreateFormValues) => {
    mutate({
      title: values.title,
      content: values.content,
      kakaotalkLink: values.kakaoOpenChatUrl,
      maxMembers: values.headcount,
      startAge: values.minAge,
      endAge: values.maxAge,
      gender: RECRUIT_GENDER_TO_API[values.recruitGender],
      startDate: values.startDate,
      endDate: values.endDate,
      travelCity: values.country as Country, // country는 COUNTRY_OPTIONS(백엔드 Country enum 값)에서만 선택되므로 안전한 캐스팅
    })
  }

  // ── Step 1 · 도시 · 날짜 ──
  const countryCode = watch('country')
  const startDate = watch('startDate')
  const endDate = watch('endDate')

  const [viewDate, setViewDate] = useState(() => (startDate ? new Date(startDate) : new Date()))
  const [countryOpen, setCountryOpen] = useState(false)
  const [cityOpen, setCityOpen] = useState(false)

  const selectedCountry = COUNTRY_OPTIONS.find((c) => c.code === countryCode)
  const recentCountries = COUNTRY_OPTIONS.filter((c) => RECENT_COUNTRY_CODES.includes(c.code))

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const lastDate = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: lastDate }, (_, i) => i + 1),
  ]

  const handleDayClick = (day: number) => {
    const clicked = formatDate(new Date(year, month, day))
    if (!startDate || (startDate && endDate)) {
      setValue('startDate', clicked, { shouldValidate: true })
      setValue('endDate', '', { shouldValidate: true })
      return
    }
    if (clicked < startDate) {
      setValue('startDate', clicked, { shouldValidate: true })
    } else {
      setValue('endDate', clicked, { shouldValidate: true })
    }
  }

  // ── Step 2 · 모집 정보 ──
  const recruitGender = watch('recruitGender')
  const minAge = watch('minAge')
  const maxAge = watch('maxAge')
  const headcount = watch('headcount')

  // 작성자 본인 성별과 반대되는 모집 성별은 선택할 수 없도록 비활성화
  const disabledGenderOption: RecruitGender | undefined =
    myProfile?.gender === 'MALE' ? 'female' : myProfile?.gender === 'FEMALE' ? 'male' : undefined

  useEffect(() => {
    if (disabledGenderOption && recruitGender === disabledGenderOption) {
      setValue('recruitGender', 'any', { shouldValidate: true })
    }
  }, [disabledGenderOption, recruitGender, setValue])

  const minPercent = ((minAge - MIN_AGE) / (MAX_AGE - MIN_AGE)) * 100
  const maxPercent = ((maxAge - MIN_AGE) / (MAX_AGE - MIN_AGE)) * 100
  // 마지막으로 조작한 핸들을 위로 올려서, 두 핸들 값이 가까워져도
  // 원하는 쪽 핸들이 항상 클릭/드래그되도록 함
  const [activeThumb, setActiveThumb] = useState<'min' | 'max'>('min')

  // ── Step 3 · 소개 · 링크 ──
  const title = watch('title') ?? ''
  const content = watch('content') ?? ''
  const kakaoUrl = watch('kakaoOpenChatUrl') ?? ''
  const isKakaoValid = !errors.kakaoOpenChatUrl && kakaoUrl.length > 0
  const autoDeleteLabel = endDate
    ? `${new Date(endDate).getMonth() + 1}월 ${new Date(endDate).getDate() + 1}일에 자동 삭제`
    : '여행 종료 다음 날 자동 삭제'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pb-24">
      <FormStepHeader step={step} totalSteps={TOTAL_STEPS} onBack={goBack} />

      {step === 1 && (
        <div className="px-4 pb-4">
          <h1 className="text-lg font-bold text-slate-900 mt-4">어디로, 언제 가나요?</h1>

          <div className="mt-5 grid grid-cols-2 gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setCountryOpen((v) => !v)}
                className="w-full flex items-center justify-between border border-slate-200 rounded-xl px-3 py-2.5 text-sm cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  {selectedCountry ? (
                    <>
                      <span>{selectedCountry.flag}</span>
                      <span>{selectedCountry.name}</span>
                    </>
                  ) : (
                    <span className="text-slate-400">국가</span>
                  )}
                </span>
                <ChevronDown size={16} className="text-slate-400" />
              </button>
              {countryOpen && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                  {COUNTRY_OPTIONS.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => {
                        setValue('country', c.code, { shouldValidate: true })
                        setValue('city', c.cities[0]?.code ?? '', { shouldValidate: true })
                        setCountryOpen(false)
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 cursor-pointer flex items-center gap-1.5"
                    >
                      <span>{c.flag}</span>
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                disabled={!selectedCountry}
                onClick={() => setCityOpen((v) => !v)}
                className="w-full flex items-center justify-between border border-slate-200 rounded-xl px-3 py-2.5 text-sm disabled:opacity-40 cursor-pointer"
              >
                <span>
                  {selectedCountry?.cities.find((c) => c.code === watch('city'))?.name ?? (
                    <span className="text-slate-400">도시</span>
                  )}
                </span>
                <ChevronDown size={16} className="text-slate-400" />
              </button>
              {cityOpen && selectedCountry && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg">
                  {selectedCountry.cities.map((city) => (
                    <button
                      key={city.code}
                      type="button"
                      onClick={() => {
                        setValue('city', city.code, { shouldValidate: true })
                        setCityOpen(false)
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 cursor-pointer"
                    >
                      {city.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          {(errors.country || errors.city) && (
            <p className="mt-1 text-xs text-red-500">{errors.country?.message ?? errors.city?.message}</p>
          )}

          <div className="mt-3 flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-400 mr-1">최근:</span>
            {recentCountries.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => {
                  setValue('country', c.code, { shouldValidate: true })
                  setValue('city', c.cities[0]?.code ?? '', { shouldValidate: true })
                }}
                className="flex items-center gap-1 text-xs border border-slate-200 rounded-full px-2.5 py-1 cursor-pointer"
              >
                <span>{c.flag}</span>
                <span>{c.name}</span>
              </button>
            ))}
          </div>

          <p className="mt-5 text-sm font-medium text-slate-700">여행 날짜</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div className="border border-slate-200 rounded-xl px-3 py-2.5">
              <p className="text-xs text-slate-400">출발</p>
              <p className="text-sm font-medium mt-0.5">{startDate ? formatDisplay(startDate) : '날짜 선택'}</p>
            </div>
            <div className="border border-slate-200 rounded-xl px-3 py-2.5">
              <p className="text-xs text-slate-400">도착</p>
              <p className="text-sm font-medium mt-0.5">{endDate ? formatDisplay(endDate) : '날짜 선택'}</p>
            </div>
          </div>
          {errors.startDate && <p className="mt-1 text-xs text-red-500">{errors.startDate.message}</p>}
          {errors.endDate && <p className="mt-1 text-xs text-red-500">{errors.endDate.message}</p>}

          <div className="mt-4">
            <div className="flex items-center justify-between">
              <button type="button" onClick={() => setViewDate(new Date(year, month - 1, 1))} className="cursor-pointer">
                <ChevronLeft size={18} className="text-slate-400" />
              </button>
              <p className="text-sm font-medium">{year}년 {month + 1}월</p>
              <button type="button" onClick={() => setViewDate(new Date(year, month + 1, 1))} className="cursor-pointer">
                <ChevronRight size={18} className="text-slate-400" />
              </button>
            </div>
            <div className="mt-3 grid grid-cols-7 text-center text-xs text-slate-400">
              {['일', '월', '화', '수', '목', '금', '토'].map((d) => <div key={d} className="py-1">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 text-center text-sm gap-y-1">
              {cells.map((day, i) => {
                if (day === null) return <div key={i} />
                const iso = formatDate(new Date(year, month, day))
                const isStart = iso === startDate
                const isEnd = iso === endDate
                const inRange = startDate && endDate && iso > startDate && iso < endDate
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleDayClick(day)}
                    className={[
                      'h-9 rounded-full cursor-pointer',
                      isStart || isEnd ? 'bg-blue-600 text-white font-medium' : '',
                      inRange ? 'bg-blue-50 text-blue-600' : '',
                      !isStart && !isEnd && !inRange ? 'hover:bg-slate-50' : '',
                    ].join(' ')}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-400">날짜가 지나면 게시글은 자동 삭제돼요</p>
        </div>
      )}

      {step === 2 && (
        <div className="px-4 pb-4">
          <h1 className="text-lg font-bold text-slate-900 mt-4">어떤 분과 함께할까요?</h1>

          <p className="mt-5 text-sm font-medium text-slate-700">모집 성별</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {GENDER_OPTIONS.map((opt) => {
              const disabled = opt.value === disabledGenderOption
              return (
                <button
                  key={opt.value}
                  type="button"
                  disabled={disabled}
                  onClick={() => setValue('recruitGender', opt.value, { shouldValidate: true })}
                  className={[
                    'py-2.5 rounded-xl text-sm border cursor-pointer disabled:cursor-not-allowed disabled:opacity-40',
                    recruitGender === opt.value ? 'border-blue-600 bg-blue-600 text-white font-medium' : 'border-slate-200 text-slate-600',
                  ].join(' ')}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-700">연령대</p>
            <p className="text-sm text-blue-600 font-medium">{minAge} — {maxAge}세</p>
          </div>
          <div className="relative mt-4 h-5">
            <div className="absolute top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 rounded-full" />
            <div
              className="absolute top-1/2 -translate-y-1/2 h-1 bg-blue-600 rounded-full"
              style={{
                left: `${minPercent}%`,
                right: `${100 - maxPercent}%`,
              }}
            />
            <input
              type="range"
              min={MIN_AGE}
              max={MAX_AGE}
              value={minAge}
              onPointerDown={() => setActiveThumb('min')}
              onChange={(e) => setValue('minAge', Math.min(Number(e.target.value), maxAge), { shouldValidate: true })}
              style={{ zIndex: activeThumb === 'min' ? 2 : 1 }}
              className={RANGE_THUMB_CLASS}
            />
            <input
              type="range"
              min={MIN_AGE}
              max={MAX_AGE}
              value={maxAge}
              onPointerDown={() => setActiveThumb('max')}
              onChange={(e) => setValue('maxAge', Math.max(Number(e.target.value), minAge), { shouldValidate: true })}
              style={{ zIndex: activeThumb === 'max' ? 2 : 1 }}
              className={RANGE_THUMB_CLASS}
            />
          </div>
          {errors.maxAge && <p className="mt-1 text-xs text-red-500">{errors.maxAge.message}</p>}

          <p className="mt-6 text-sm font-medium text-slate-700">인원</p>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {HEADCOUNT_OPTIONS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setValue('headcount', n, { shouldValidate: true })}
                className={[
                  'py-2.5 rounded-xl text-sm border cursor-pointer',
                  headcount === n ? 'border-blue-600 bg-blue-600 text-white font-medium' : 'border-slate-200 text-slate-600',
                ].join(' ')}
              >
                {n === 4 ? '4+명' : `${n}명`}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="px-4 pb-4">
          <h1 className="text-lg font-bold text-slate-900 mt-4">마지막으로 한 줄만 더</h1>

          <div className="mt-5">
            <p className="text-sm font-medium text-slate-700">한 줄 제목</p>
            <input
              {...register('title')}
              maxLength={30}
              placeholder="프라하 같이 다니실 여성분 구해요"
              className="mt-2 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-600"
            />
            <div className="flex items-center justify-between mt-1">
              {errors.title ? <p className="text-xs text-red-500">{errors.title.message}</p> : <span />}
              <p className="text-xs text-slate-400">{title.length} / 30</p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm font-medium text-slate-700">소개</p>
            <textarea
              {...register('content')}
              maxLength={500}
              rows={5}
              placeholder="일정, 같이 하고 싶은 것, 원하는 동행 스타일을 자유롭게 적어주세요"
              className="mt-2 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-600 resize-none"
            />
            <div className="flex items-center justify-between mt-1">
              {errors.content ? <p className="text-xs text-red-500">{errors.content.message}</p> : <span />}
              <p className="text-xs text-slate-400">{content.length} / 500</p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm font-medium text-slate-700">카카오 오픈채팅 링크</p>
            <div className="mt-2 relative">
              <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                {...register('kakaoOpenChatUrl')}
                placeholder="open.kakao.com/o/xxxxxxx"
                className="w-full border border-slate-200 rounded-xl pl-9 pr-9 py-2.5 text-sm outline-none focus:border-blue-600"
              />
              {isKakaoValid && <Check size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600" />}
            </div>
            {errors.kakaoOpenChatUrl && <p className="mt-1 text-xs text-red-500">{errors.kakaoOpenChatUrl.message}</p>}
          </div>

          <div className="mt-4 flex items-start gap-2 text-xs text-slate-400">
            <ShieldCheck size={14} className="mt-0.5 shrink-0" />
            <p>참가자가 직접 이 링크로 들어와요. 카톡 ID는 공개되지 않아요.</p>
          </div>

          <div className="mt-3 flex items-center gap-2 border border-slate-100 bg-slate-50 rounded-xl px-3 py-2.5">
            <CalendarClock size={16} className="text-slate-400 shrink-0" />
            <div>
              <p className="text-sm font-medium">{autoDeleteLabel}</p>
              <p className="text-xs text-slate-400">여행 종료 다음 날 게시글이 사라져요</p>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-1/2 w-full max-w-107.5 -translate-x-1/2 bg-white px-4 py-3 border-t border-slate-100">
        {step < TOTAL_STEPS ? (
          <button type="button" onClick={goNext} className="w-full py-3 rounded-xl bg-blue-600 text-white font-medium cursor-pointer">
            다음
          </button>
        ) : (
          <button type="submit" disabled={isPending} className="w-full py-3 rounded-xl bg-blue-600 text-white font-medium cursor-pointer disabled:opacity-50">
            {isPending ? '등록 중...' : '동행 모집 시작'}
          </button>
        )}
      </div>
    </form>
  )
}