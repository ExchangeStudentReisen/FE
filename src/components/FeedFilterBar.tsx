import { useEffect, useState } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, MapPin, User, Calendar } from 'lucide-react'
import type { FeedFilterOptions, FeedFilters } from '../types/feed'

interface Props {
  filters: FeedFilters
  options: FeedFilterOptions
  onChange: (next: FeedFilters) => void
  onlyEligible: boolean
  onToggleEligible: () => void
  eligibilityDisabled?: boolean
}

export function FeedFilterBar({
  filters,
  options,
  onChange,
  onlyEligible,
  onToggleEligible,
  eligibilityDisabled,
}: Props) {
  const [openDropdown, setOpenDropdown] = useState<'country' | 'gender' | 'date' | null>(null)

  const countryLabel =
    options.countries.find((c) => c.value === filters.travelCity)?.label ?? '전체'
  const genderLabel =
    options.genders.find((g) => g.value === filters.gender)?.label ?? '전체'

  return (
    <div className="px-4 pt-3">
      <div className="flex items-center gap-1.5 pb-2">
        <Dropdown
          icon={<MapPin size={14} />}
          label={countryLabel}
          options={[{ value: '', label: '전체' }, ...options.countries]}
          isOpen={openDropdown === 'country'}
          onToggle={() => setOpenDropdown((prev) => (prev === 'country' ? null : 'country'))}
          onSelect={(value) => {
            onChange({ ...filters, travelCity: value || undefined })
            setOpenDropdown(null)
          }}
        />
        <Dropdown
          icon={<User size={14} />}
          label={genderLabel}
          options={[{ value: '', label: '전체' }, ...options.genders]}
          isOpen={openDropdown === 'gender'}
          onToggle={() => setOpenDropdown((prev) => (prev === 'gender' ? null : 'gender'))}
          onSelect={(value) => {
            onChange({ ...filters, gender: (value || undefined) as FeedFilters['gender'] })
            setOpenDropdown(null)
          }}
        />
        <DateRangeDropdown
          startDate={filters.startDate}
          endDate={filters.endDate}
          isOpen={openDropdown === 'date'}
          onToggle={() => setOpenDropdown((prev) => (prev === 'date' ? null : 'date'))}
          onSelect={(range) => {
            onChange({ ...filters, startDate: range.startDate, endDate: range.endDate })
            setOpenDropdown(null)
          }}
          onClear={() => {
            onChange({ ...filters, startDate: undefined, endDate: undefined })
            setOpenDropdown(null)
          }}
        />
      </div>

      <div className="flex items-center justify-between pb-3">
        <button
          onClick={onToggleEligible}
          disabled={eligibilityDisabled}
          className="shrink-0 cursor-pointer flex items-center gap-1.5 text-sm text-slate-600 whitespace-nowrap disabled:opacity-40"
        >
          <span
            className={`relative inline-flex h-4 w-7 shrink-0 items-center rounded-full transition-colors
              ${onlyEligible ? 'bg-sky-500' : 'bg-slate-300'}`}
          >
            <span
              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform
                ${onlyEligible ? 'translate-x-3.5' : 'translate-x-0.5'}`}
            />
          </span>
          내 조건만
        </button>

        <button
          onClick={() => onChange({ ...filters, sort: filters.sort === 'latest' ? 'popular' : 'latest' })}
          className="cursor-pointer text-sm text-slate-500"
        >
          {filters.sort === 'latest' ? '최신순' : '인기순'}
        </button>
      </div>
    </div>
  )
}

function Dropdown({
  icon,
  label,
  options,
  isOpen,
  onToggle,
  onSelect,
}: {
  icon: React.ReactNode
  label: string
  options: { value: string; label: string }[]
  isOpen: boolean
  onToggle: () => void
  onSelect: (value: string) => void
}) {
  return (
    <div className="relative shrink-0">
      <button
        onClick={onToggle}
        className="shrink-0 cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-white text-sm text-slate-600"
      >
        {icon}
        {label}
        <ChevronDown size={14} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 z-10 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden min-w-30">
          <div className="max-h-64 overflow-y-auto">
            {options.map((opt) => (
              <button
                key={opt.value || 'all'}
                onClick={() => onSelect(opt.value)}
                className="cursor-pointer block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ---- 날짜 범위 피커 ----

function toISODate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function formatShort(iso: string): string {
  const [, m, d] = iso.split('-')
  return `${Number(m)}.${Number(d)}`
}

// 해당 달의 날짜 그리드(앞쪽 빈 칸 포함, 일요일 시작)
function getMonthGrid(viewDate: Date): (Date | null)[] {
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const leadingBlanks = firstDay.getDay()

  const cells: (Date | null)[] = Array(leadingBlanks).fill(null)
  for (let day = 1; day <= lastDay.getDate(); day++) {
    cells.push(new Date(year, month, day))
  }
  return cells
}

function DateRangeDropdown({
  startDate,
  endDate,
  isOpen,
  onToggle,
  onSelect,
  onClear,
}: {
  startDate?: string
  endDate?: string
  isOpen: boolean
  onToggle: () => void
  onSelect: (range: { startDate: string; endDate: string }) => void
  onClear: () => void
}) {
  const [viewDate, setViewDate] = useState(() => (startDate ? new Date(startDate) : new Date()))
  const [tempStart, setTempStart] = useState<string | undefined>(startDate)
  const [tempEnd, setTempEnd] = useState<string | undefined>(endDate)

  // 팝오버가 다시 열릴 때 현재 필터값으로 초기화
  useEffect(() => {
    if (isOpen) {
      setTempStart(startDate)
      setTempEnd(endDate)
      setViewDate(startDate ? new Date(startDate) : new Date())
    }
  }, [isOpen, startDate, endDate])

  const label = startDate && endDate ? `${formatShort(startDate)} - ${formatShort(endDate)}` : '날짜'

  const handleDayClick = (dateStr: string) => {
    if (!tempStart || tempEnd) {
      setTempStart(dateStr)
      setTempEnd(undefined)
      return
    }
    if (dateStr < tempStart) {
      setTempStart(dateStr)
      setTempEnd(undefined)
      return
    }
    setTempEnd(dateStr)
    onSelect({ startDate: tempStart, endDate: dateStr })
  }

  const cells = getMonthGrid(viewDate)

  return (
    <div className="relative shrink-0">
      <button
        onClick={onToggle}
        className="shrink-0 cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-white text-sm text-slate-600"
      >
        <Calendar size={14} />
        {label}
        <ChevronDown size={14} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 z-10 rounded-xl border border-slate-200 bg-white shadow-lg p-3 w-64">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
              className="cursor-pointer p-1 text-slate-500 hover:text-slate-700"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-medium text-slate-700">
              {viewDate.getFullYear()}년 {viewDate.getMonth() + 1}월
            </span>
            <button
              onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
              className="cursor-pointer p-1 text-slate-500 hover:text-slate-700"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-y-1 text-center text-xs text-slate-400 mb-1">
            {['일', '월', '화', '수', '목', '금', '토'].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-1">
            {cells.map((date, i) => {
              if (!date) return <span key={i} />
              const dateStr = toISODate(date)
              const isStart = dateStr === tempStart
              const isEnd = dateStr === tempEnd
              const inRange = tempStart && tempEnd && dateStr > tempStart && dateStr < tempEnd

              return (
                <button
                  key={dateStr}
                  onClick={() => handleDayClick(dateStr)}
                  className={`cursor-pointer text-xs h-7 w-7 mx-auto rounded-full flex items-center justify-center
                    ${isStart || isEnd ? 'bg-sky-500 text-white' : ''}
                    ${inRange ? 'bg-sky-100 text-sky-700' : ''}
                    ${!isStart && !isEnd && !inRange ? 'text-slate-600 hover:bg-slate-100' : ''}
                  `}
                >
                  {date.getDate()}
                </button>
              )
            })}
          </div>

          {(tempStart || tempEnd) && (
            <button onClick={onClear} className="cursor-pointer mt-2 w-full text-center text-xs text-slate-400 hover:text-slate-600">
              초기화
            </button>
          )}
        </div>
      )}
    </div>
  )
}