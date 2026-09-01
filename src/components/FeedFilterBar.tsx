import { useState } from 'react'
import { ChevronDown, SlidersHorizontal, MapPin, User } from 'lucide-react'
import type { FeedFilterOptions, FeedFilters } from '../types/feed'

interface Props {
  filters: FeedFilters
  options: FeedFilterOptions
  onChange: (next: FeedFilters) => void
  onOpenFilterSheet: () => void
  activeFilterCount: number
}

export function FeedFilterBar({ filters, options, onChange, onOpenFilterSheet, activeFilterCount }: Props) {
  const [openDropdown, setOpenDropdown] = useState<'country' | 'gender' | null>(null)

  const countryLabel =
    options.countries.find((c) => c.value === filters.travelCity)?.label ?? '전체'
  const genderLabel =
    options.genders.find((g) => g.value === filters.gender)?.label ?? '전체'

  return (
    <div className="px-4">
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2">
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
          <button
            onClick={onOpenFilterSheet}
            className="cursor-pointer flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-200 text-sm text-slate-600"
          >
            <SlidersHorizontal size={14} />
            필터{activeFilterCount > 0 ? ` ${activeFilterCount}` : ''}
          </button>
        </div>

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
    <div className="relative">
      <button
        onClick={onToggle}
        className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-sm text-slate-600"
      >
        {icon}
        {label}
        <ChevronDown size={14} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 z-10 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden min-w-30 max-h-64 overflow-y-auto">
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
      )}
    </div>
  )
}