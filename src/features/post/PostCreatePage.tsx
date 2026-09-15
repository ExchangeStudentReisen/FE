import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { DayPicker, type DateRange } from 'react-day-picker'
import { ko } from 'react-day-picker/locale'
import { ChevronLeft, ChevronRight, ChevronDown, Link as LinkIcon, ShieldCheck, X } from 'lucide-react'
import { createPostCreateSchema, type PostCreateFormValues } from '../../schemas/postCreateSchema'
import {
  RECRUIT_GENDER_TO_API,
  type CreatePostRequest,
  type UpdatePostRequest,
  type RecruitGender,
  type PostRecruitGender,
  type Country,
} from '../../types/post'
import { COUNTRY_OPTIONS } from '../../mocks/countryMock'
import { useMyProfile } from '../../hooks/useMyProfile'
import { usePostDetail } from '../../hooks/usePost'
import { calculateAge } from '../../utils/eligibility'
import { createPost, updatePost, getChatLink } from '../../api/post'

// PUT /api/posts/{id}·POST /api/posts 응답 모두 gender는 ApiGender/PostRecruitGender 값을 공유하므로 역매핑에 사용
function apiGenderToRecruit(gender: PostRecruitGender): RecruitGender {
  if (gender === 'FEMALE') return 'female'
  if (gender === 'MALE') return 'male'
  return 'any'
}

// Step 2 · 모집 정보
const GENDER_OPTIONS: { value: RecruitGender; label: string }[] = [
  { value: 'any', label: '상관없음' },
  { value: 'female', label: '여성만' },
  { value: 'male', label: '남성만' },
]
const HEADCOUNT_OPTIONS = [2, 3, 4, 5] as const
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
  const { postId } = useParams<{ postId?: string }>()
  const isEditMode = !!postId

  const { data: myProfile } = useMyProfile()
  const { data: editingPost, isLoading: isEditingPostLoading } = usePostDetail(isEditMode ? postId : undefined)

  // 수정 권한은 서버가 최종 검증하지만(작성자 본인만 수정 가능), 클라이언트에서도 다른 사람 글로 잘못 들어오면 바로 돌려보냄
  useEffect(() => {
    if (isEditMode && editingPost && myProfile && editingPost.authorId !== myProfile.id) {
      navigate(`/post/${postId}`, { replace: true })
    }
  }, [isEditMode, editingPost, myProfile, postId, navigate])

  // 서비스 연령 범위(20~30세) 밖이면(프로필 미로딩 포함) 나이 범위 검증을 건너뜀
  const myAge = myProfile ? calculateAge(myProfile.birthYear) : undefined
  const myAgeForValidation = myAge !== undefined && myAge >= MIN_AGE && myAge <= MAX_AGE ? myAge : undefined
  const schema = useMemo(() => createPostCreateSchema(myAgeForValidation), [myAgeForValidation])

  // GET /api/posts/{id}는 kakaotalkLink를 안 내려줘서 별도 엔드포인트로 받아옴 — 수정 모드에선 이 값을 그대로 쓰고 수정 불가
  const { data: chatLinkRes } = useQuery({
    queryKey: ['postKakaoLink', postId, myProfile?.id],
    queryFn: () => getChatLink(postId as string, myProfile?.id as number),
    enabled: isEditMode && !!postId && !!myProfile?.id,
  })
  const existingKakaoLink = chatLinkRes?.data?.kakaotalkLink ?? ''

  // 수정 모드일 때만 기존 글 값으로 폼을 채움
  const editingValues: PostCreateFormValues | undefined = useMemo(() => {
    if (!editingPost) return undefined
    const country = COUNTRY_OPTIONS.find((c) => c.code === editingPost.travelCity)
    return {
      country: editingPost.travelCity,
      city: country?.cities[0]?.code ?? '',
      startDate: editingPost.startDate,
      endDate: editingPost.endDate,
      recruitGender: apiGenderToRecruit(editingPost.gender),
      minAge: editingPost.startAge,
      maxAge: editingPost.endAge,
      headcount: editingPost.maxMembers,
      title: editingPost.title,
      content: editingPost.content,
      kakaoOpenChatUrl: existingKakaoLink,
    }
  }, [editingPost, existingKakaoLink])

  const { watch, setValue, register, handleSubmit, formState: { errors } } = useForm<PostCreateFormValues>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    defaultValues: {
      country: '', city: '', startDate: '', endDate: '',
      recruitGender: 'any', minAge: 20, maxAge: 23, headcount: 2,
      title: '', content: '', kakaoOpenChatUrl: '',
    },
    values: editingValues,
  })

  const createMutation = useMutation({
    mutationFn: (payload: CreatePostRequest) => createPost(payload),
    onSuccess: (res) => {
      // TODO: result !== 'SUCCESS' 케이스(실패 응답) 핸들링 필요 — 백엔드 에러 스펙 확인 후 추가
      navigate(`/post/${res.data.id}`)
    },
  })

  const updateMutation = useMutation({
    mutationFn: (payload: UpdatePostRequest) => updatePost(postId as string, myProfile?.id as number, payload),
    onSuccess: (res) => {
      navigate(`/post/${res.data.id}`)
    },
  })

  const isPending = isEditMode ? updateMutation.isPending : createMutation.isPending

  // 제출을 한 번이라도 시도했는지 — 시도 전에는 미입력 필드를 빨갛게 표시하지 않음
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false)
  const showError = (hasError: boolean) => hasAttemptedSubmit && hasError

  const onInvalidSubmit = () => {
    setHasAttemptedSubmit(true)
  }

  const onSubmit = (values: PostCreateFormValues) => {
    const payload = {
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
    }
    if (isEditMode) {
      // 모집 상태(모집중/마감)는 이 폼이 아니라 글 상세 페이지에서 별도로 변경함 — 기존 값 그대로 전달
      updateMutation.mutate({ ...payload, isRecruiting: editingPost?.isRecruiting ?? true })
    } else {
      createMutation.mutate(payload)
    }
  }

  // ── 도시 · 날짜 ──
  const countryCode = watch('country')
  const startDate = watch('startDate')
  const endDate = watch('endDate')

  const [countryOpen, setCountryOpen] = useState(false)
  const [cityOpen, setCityOpen] = useState(false)

  const selectedCountry = COUNTRY_OPTIONS.find((c) => c.code === countryCode)

  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const selectedRange: DateRange | undefined = {
    from: startDate ? new Date(startDate) : undefined,
    to: endDate ? new Date(endDate) : undefined,
  }

  const handleRangeSelect = (range: DateRange | undefined) => {
    setValue('startDate', range?.from ? formatDate(range.from) : '', { shouldValidate: true })
    setValue('endDate', range?.to ? formatDate(range.to) : '', { shouldValidate: true })
  }

  // ── 모집 정보 ──
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

  // ── 소개 · 링크 ──
  const title = watch('title') ?? ''
  const content = watch('content') ?? ''

  if (isEditMode && (isEditingPostLoading || !editingPost)) {
    return (
      <div className="px-4 pt-6 flex flex-col gap-3">
        <div className="h-6 w-2/3 rounded bg-slate-100 animate-pulse" />
        <div className="h-40 rounded-xl bg-slate-100 animate-pulse" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalidSubmit)} className="pb-24">
      <div className="sticky top-0 z-10 bg-[#f5fafe] px-4 pt-3 pb-2 flex items-center h-9">
        <button
          type="button"
          onClick={() => (isEditMode ? navigate(-1) : navigate('/feed'))}
          aria-label="닫기"
          className="p-1 -ml-1 cursor-pointer text-slate-700"
        >
          <X size={22} />
        </button>
      </div>

      <div className="px-4 pb-4">
        <p className="mt-2 text-sm font-medium text-primary">{isEditMode ? '모집글 수정' : '모집글 작성'}</p>
        <h1 className="text-lg font-bold text-slate-900">어디로, 언제 가나요?</h1>

        <p className="mt-5 text-sm font-medium text-slate-700">국가 · 도시</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setCountryOpen((v) => !v)
                setCityOpen(false)
              }}
              className={[
                'w-full flex items-center justify-between border rounded-xl px-3 py-2.5 text-sm bg-white cursor-pointer',
                showError(!!errors.country) ? 'border-red-400' : 'border-slate-200',
              ].join(' ')}
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
              onClick={() => {
                setCityOpen((v) => !v)
                setCountryOpen(false)
              }}
              className={[
                'w-full flex items-center justify-between border rounded-xl px-3 py-2.5 text-sm bg-white disabled:opacity-40 cursor-pointer',
                showError(!!errors.city) ? 'border-red-400' : 'border-slate-200',
              ].join(' ')}
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
        {showError(!!(errors.country || errors.city)) && (
          <p className="mt-1 text-xs text-red-500">{errors.country?.message ?? errors.city?.message}</p>
        )}

        <p className="mt-5 text-sm font-medium text-slate-700">여행 날짜</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div className={`border rounded-xl px-3 py-2.5 bg-white ${showError(!!errors.startDate) ? 'border-red-400' : 'border-slate-200'}`}>
            <p className="text-xs text-slate-400">출발</p>
            <p className="text-sm font-medium mt-0.5">{startDate ? formatDisplay(startDate) : '날짜 선택'}</p>
          </div>
          <div className={`border rounded-xl px-3 py-2.5 bg-white ${showError(!!errors.endDate) ? 'border-red-400' : 'border-slate-200'}`}>
            <p className="text-xs text-slate-400">도착</p>
            <p className="text-sm font-medium mt-0.5">{endDate ? formatDisplay(endDate) : '날짜 선택'}</p>
          </div>
        </div>
        {showError(!!errors.startDate) && <p className="mt-1 text-xs text-red-500">{errors.startDate?.message}</p>}
        {showError(!!errors.endDate) && <p className="mt-1 text-xs text-red-500">{errors.endDate?.message}</p>}

        <div className="mt-4">
          <DayPicker
            mode="range"
            locale={ko}
            selected={selectedRange}
            onSelect={handleRangeSelect}
            disabled={{ before: today }}
            defaultMonth={startDate ? new Date(startDate) : today}
            showOutsideDays
            formatters={{
              formatCaption: (date) => `${date.getFullYear()}년 ${date.getMonth() + 1}월`,
            }}
            components={{
              Chevron: ({ orientation }) =>
                orientation === 'left' ? (
                  <ChevronLeft size={18} className="text-slate-400" />
                ) : (
                  <ChevronRight size={18} className="text-slate-400" />
                ),
            }}
            classNames={{
              months: 'relative',
              month: 'w-full',
              month_caption: 'flex justify-center items-center h-9',
              caption_label: 'text-sm font-medium text-slate-900',
              nav: 'flex items-center justify-between absolute inset-x-0 top-0 h-9',
              button_previous: 'cursor-pointer p-1',
              button_next: 'cursor-pointer p-1',
              month_grid: 'w-full mt-3 border-collapse',
              weekdays: 'flex',
              weekday: 'flex-1 text-center text-xs text-slate-400 font-normal py-1',
              week: 'flex mt-1',
              day: 'group flex-1 flex items-center justify-center p-0 text-sm',
              day_button: [
                'h-9 w-9 rounded-full cursor-pointer hover:bg-slate-50',
                'group-data-[outside=true]:text-slate-300',
                'group-data-[today=true]:font-semibold group-data-[today=true]:text-blue-600',
                'group-data-[selected=true]:!bg-blue-600 group-data-[selected=true]:!text-white group-data-[selected=true]:font-medium',
                'group-data-[selected=true]:hover:!bg-blue-600',
                'group-data-[disabled=true]:!text-slate-300 group-data-[disabled=true]:opacity-40',
                'group-data-[disabled=true]:!cursor-not-allowed group-data-[disabled=true]:hover:!bg-transparent',
              ].join(' '),
              hidden: 'invisible',
            }}
          />
        </div>
      </div>

      <div className="px-4 pb-4 mt-6 pt-6 border-t border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">어떤 분과 함께할까요?</h2>

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
                  recruitGender === opt.value ? 'border-blue-600 bg-blue-600 text-white font-medium' : 'border-slate-200 bg-white text-slate-600',
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
        <div className="relative isolate mt-4 h-5">
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
        {showError(!!errors.maxAge) && <p className="mt-1 text-xs text-red-500">{errors.maxAge?.message}</p>}

        <p className="mt-6 text-sm font-medium text-slate-700">인원</p>
        <p className="mt-1 text-xs text-slate-400">나를 포함한 인원을 선택해주세요</p>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {HEADCOUNT_OPTIONS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setValue('headcount', n, { shouldValidate: true })}
              className={[
                'py-2.5 rounded-xl text-sm border cursor-pointer',
                headcount === n ? 'border-blue-600 bg-blue-600 text-white font-medium' : 'border-slate-200 bg-white text-slate-600',
              ].join(' ')}
            >
              {n === 5 ? '5+명' : `${n}명`}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pb-4 mt-6 pt-6 border-t border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">다른 여행자에게 뭐라고 소개할까요?</h2>

        <div className="mt-5">
          <p className="text-sm font-medium text-slate-700">한 줄 제목</p>
          <input
            {...register('title')}
            maxLength={30}
            placeholder="프라하 같이 다니실 여성분 구해요"
            className={`mt-2 w-full border rounded-xl px-3 py-2.5 text-sm bg-white outline-none ${showError(!!errors.title) ? 'border-red-400 focus:border-red-400' : 'border-slate-200 focus:border-blue-600'}`}
          />
          <div className="flex items-center justify-between mt-1">
            {showError(!!errors.title) ? <p className="text-xs text-red-500">{errors.title?.message}</p> : <span />}
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
            className={`mt-2 w-full border rounded-xl px-3 py-2.5 text-sm bg-white outline-none resize-none ${showError(!!errors.content) ? 'border-red-400 focus:border-red-400' : 'border-slate-200 focus:border-blue-600'}`}
          />
          <div className="flex items-center justify-between mt-1">
            {showError(!!errors.content) ? <p className="text-xs text-red-500">{errors.content?.message}</p> : <span />}
            <p className="text-xs text-slate-400">{content.length} / 500</p>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium text-slate-700">카카오 오픈채팅 링크</p>
          {isEditMode && (
            <p className="mt-1 text-xs text-slate-400">카카오 오픈채팅 링크는 수정할 수 없어요</p>
          )}
          <div className="mt-2 relative">
            <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              {...register('kakaoOpenChatUrl')}
              readOnly={isEditMode}
              placeholder="open.kakao.com/o/xxxxxxx"
              className={`w-full border rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none ${isEditMode ? 'bg-slate-50 text-slate-500' : 'bg-white'} ${showError(!!errors.kakaoOpenChatUrl) ? 'border-red-400 focus:border-red-400' : 'border-slate-200 focus:border-blue-600'}`}
            />
          </div>
          {showError(!!errors.kakaoOpenChatUrl) && <p className="mt-1 text-xs text-red-500">{errors.kakaoOpenChatUrl?.message}</p>}
        </div>

        <div className="mt-4 flex items-start gap-2 text-xs text-slate-400">
          <ShieldCheck size={14} className="mt-0.5 shrink-0" />
          <p>참가자가 직접 이 링크로 들어와요. 카톡 ID는 공개되지 않아요.</p>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 w-full max-w-107.5 -translate-x-1/2 bg-[#f5fafe] px-4 py-3 border-t border-slate-100">
        <button type="submit" disabled={isPending} className="w-full py-3 rounded-xl bg-blue-600 text-white font-medium cursor-pointer disabled:opacity-50">
          {isEditMode
            ? isPending ? '수정 중...' : '수정 완료'
            : isPending ? '등록 중...' : '동행 모집 시작'}
        </button>
      </div>
    </form>
  )
}
