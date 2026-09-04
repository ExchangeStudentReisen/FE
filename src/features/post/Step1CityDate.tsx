import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import type { PostCreateFormValues } from '../../schemas/postCreateSchema'
import { COUNTRY_OPTIONS, RECENT_COUNTRY_CODES } from '../../mocks/countryMock'

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

export function Step1CityDate() {
  const { watch, setValue, formState: { errors } } = useFormContext<PostCreateFormValues>()

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

  return (
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
  )
}