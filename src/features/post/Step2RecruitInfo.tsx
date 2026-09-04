import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import type { PostCreateFormValues } from '../../schemas/postCreateSchema'
import type { RecruitGender, TravelStyle } from '../../types/post'

const GENDER_OPTIONS: { value: RecruitGender; label: string }[] = [
  { value: 'any', label: '상관없음' },
  { value: 'female', label: '여성만' },
  { value: 'male', label: '남성만' },
]

const HEADCOUNT_OPTIONS = [1, 2, 3, 4] as const

const TRAVEL_STYLE_OPTIONS: TravelStyle[] = [
  '카페', '야경', '관광', '미술관', '공연', '맛집',
  '저렴이', '브런치', '쇼핑', '역사', '야시장', '느긋',
]

const MAX_TRAVEL_STYLES = 5
const MIN_AGE = 18
const MAX_AGE = 99

export function Step2RecruitInfo() {
  const { watch, setValue, formState: { errors } } = useFormContext<PostCreateFormValues>()

  const recruitGender = watch('recruitGender')
  const minAge = watch('minAge')
  const maxAge = watch('maxAge')
  const headcount = watch('headcount')
  const travelStyles = watch('travelStyles') ?? []

  // 두 range input이 겹칠 때 방금 조작한 쪽이 위로 오도록(클릭 가로채기 방지)
  const [activeThumb, setActiveThumb] = useState<'min' | 'max'>('max')

  const toggleTravelStyle = (style: TravelStyle) => {
    if (travelStyles.includes(style)) {
      setValue('travelStyles', travelStyles.filter((s) => s !== style), { shouldValidate: true })
      return
    }
    if (travelStyles.length >= MAX_TRAVEL_STYLES) return
    setValue('travelStyles', [...travelStyles, style], { shouldValidate: true })
  }

  return (
    <div className="px-4 pb-4">
      {/* 듀얼 레인지 슬라이더 손잡이 스타일. index.css 수정 없이 이 컴포넌트에서만 적용됨 */}
      <style>{`
        .range-thumb {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
        }
        .range-thumb::-webkit-slider-runnable-track {
          -webkit-appearance: none;
          height: 0;
        }
        .range-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          pointer-events: auto;
          width: 20px;
          height: 20px;
          border-radius: 9999px;
          background: #fff;
          border: 2px solid #2563eb;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
          cursor: pointer;
        }
        .range-thumb::-moz-range-track {
          background: transparent;
          height: 0;
        }
        .range-thumb::-moz-range-thumb {
          pointer-events: auto;
          width: 20px;
          height: 20px;
          border-radius: 9999px;
          background: #fff;
          border: 2px solid #2563eb;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
          cursor: pointer;
        }
      `}</style>

      <h1 className="text-lg font-bold text-slate-900 mt-4">어떤 분과 함께할까요?</h1>

      <p className="mt-5 text-sm font-medium text-slate-700">모집 성별</p>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {GENDER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setValue('recruitGender', opt.value, { shouldValidate: true })}
            className={[
              'py-2.5 rounded-xl text-sm border cursor-pointer',
              recruitGender === opt.value ? 'border-blue-600 bg-blue-600 text-white font-medium' : 'border-slate-200 text-slate-600',
            ].join(' ')}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-700">연령대</p>
        <p className="text-sm text-blue-600 font-medium">{minAge} — {maxAge}세</p>
      </div>
      {/* 듀얼 레인지 슬라이더: range input 두 개를 겹쳐서 구현 */}
      <div className="relative mt-4 h-5">
        <div className="absolute top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 rounded-full" />
        <div
          className="absolute top-1/2 -translate-y-1/2 h-1 bg-blue-600 rounded-full"
          style={{
            left: `${((minAge - MIN_AGE) / (MAX_AGE - MIN_AGE)) * 100}%`,
            right: `${100 - ((maxAge - MIN_AGE) / (MAX_AGE - MIN_AGE)) * 100}%`,
          }}
        />
        <input
          type="range"
          min={MIN_AGE}
          max={MAX_AGE}
          value={minAge}
          onChange={(e) => setValue('minAge', Math.min(Number(e.target.value), maxAge), { shouldValidate: true })}
          onMouseDown={() => setActiveThumb('min')}
          onTouchStart={() => setActiveThumb('min')}
          style={{ zIndex: activeThumb === 'min' ? 5 : 3 }}
          className="absolute w-full appearance-none bg-transparent pointer-events-none range-thumb"
        />
        <input
          type="range"
          min={MIN_AGE}
          max={MAX_AGE}
          value={maxAge}
          onChange={(e) => setValue('maxAge', Math.max(Number(e.target.value), minAge), { shouldValidate: true })}
          onMouseDown={() => setActiveThumb('max')}
          onTouchStart={() => setActiveThumb('max')}
          style={{ zIndex: activeThumb === 'max' ? 5 : 3 }}
          className="absolute w-full appearance-none bg-transparent pointer-events-none range-thumb"
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

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-700">여행 스타일</p>
        <p className="text-xs text-slate-400">최대 {MAX_TRAVEL_STYLES}개</p>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {TRAVEL_STYLE_OPTIONS.map((style) => {
          const selected = travelStyles.includes(style)
          const disabled = !selected && travelStyles.length >= MAX_TRAVEL_STYLES
          return (
            <button
              key={style}
              type="button"
              disabled={disabled}
              onClick={() => toggleTravelStyle(style)}
              className={[
                'px-3 py-1.5 rounded-full text-sm border cursor-pointer disabled:opacity-40',
                selected ? 'border-blue-600 bg-blue-600 text-white font-medium' : 'border-slate-200 text-slate-600',
              ].join(' ')}
            >
              {selected && '✓ '}{style}
            </button>
          )
        })}
      </div>
      {errors.travelStyles && (
        <p className="mt-1 text-xs text-red-500">{errors.travelStyles.message as string}</p>
      )}
    </div>
  )
}