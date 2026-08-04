import { useState } from 'react'
import { ChevronDown, SlidersHorizontal } from 'lucide-react'
import type { FeedFilterOptions, FeedFilters } from '../types/feed'

interface Props {
  filters: FeedFilters
  options: FeedFilterOptions
  onChange: (next: FeedFilters) => void
  onOpenFilterSheet: () => void
  activeFilterCount: number
}

export function FeedFilterBar({ filters, options, onChange, onOpenFilterSheet, activeFilterCount }: Props) {
  const [openDropdown, setOpenDropdown] = useState<'month' | 'gender' | null>(null)

  return (
    <div className="px-4">
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3">
        {options.categories.map((c) => (
          <button
            key={c.key}
            onClick={() => onChange({ ...filters, category: c.key })}
            className={`shrink-0 cursor-pointer px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filters.category === c.key ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <Dropdown
            label={filters.month}
            options={options.months}
            isOpen={openDropdown === 'month'}
            onToggle={() => setOpenDropdown((prev) => (prev === 'month' ? null : 'month'))}
            onSelect={(v) => {
              onChange({ ...filters, month: v })
              setOpenDropdown(null)
            }}
          />
          <Dropdown
            label={filters.gender}
            options={options.genders}
            isOpen={openDropdown === 'gender'}
            onToggle={() => setOpenDropdown((prev) => (prev === 'gender' ? null : 'gender'))}
            onSelect={(v) => {
              onChange({ ...filters, gender: v })
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
  label,
  options,
  isOpen,
  onToggle,
  onSelect,
}: {
  label: string
  options: string[]
  isOpen: boolean
  onToggle: () => void
  onSelect: (value: string) => void
}) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="cursor-pointer flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-200 text-sm text-slate-600"
      >
        {label}
        <ChevronDown size={14} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 z-10 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden min-w-[100px]">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => onSelect(opt)}
              className="cursor-pointer block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}