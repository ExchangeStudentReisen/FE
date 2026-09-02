import { useState } from 'react'
import { Search } from 'lucide-react'
import { Header } from '../../components/Header'
import { FeedFilterBar } from '../../components/FeedFilterBar'
import { FeedPostCard } from '../../components/FeedPostCard'
import { useInfiniteFeed } from '../../hooks/useInfiniteFeed'
import { useInfiniteScrollTrigger } from '../../hooks/useInfiniteScrollerTrigger'
import { matchesQuery } from '../../utils/hangul'
import { getCountryOptions } from '../../utils/cityMeta'
import type { FeedFilterOptions, FeedFilters } from '../../types/feed'
import { useMyProfile } from '../../hooks/useMyProfile'
import { isEligibleForPost } from '../../utils/eligibility'

const FILTER_OPTIONS: FeedFilterOptions = {
  countries: getCountryOptions(),
  genders: [
    { value: 'FEMALE', label: '여성만' },
    { value: 'MALE', label: '남성만' },
    { value: 'OTHER', label: '성별무관' },
  ],
}

const DEFAULT_FILTERS: FeedFilters = {
  travelCity: undefined,
  gender: undefined,
  startAge: undefined,
  endAge: undefined,
  startDate: undefined,
  endDate: undefined,
  sort: 'latest',
  keyword: '',
}

export function FeedPage() {
  const [filters, setFilters] = useState<FeedFilters>(DEFAULT_FILTERS)
  const [searchInput, setSearchInput] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteFeed(filters)

  const sentinelRef = useInfiniteScrollTrigger(() => fetchNextPage(), !!hasNextPage && !isFetchingNextPage)

  const { data: myProfile } = useMyProfile()
  const [onlyEligible, setOnlyEligible] = useState(false)

  const items = data?.pages.flatMap((page) => page.items) ?? []

  const visibleItems =
    onlyEligible && myProfile ? items.filter((item) => isEligibleForPost(myProfile, item)) : items

  const suggestions = searchInput.trim()
    ? getCountryOptions().filter((c) => matchesQuery(searchInput.trim(), c.label))
    : []

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFilters((prev) => ({ ...prev, keyword: searchInput }))
    setShowSuggestions(false)
  }

  function handleSelectCountry(label: string) {
    setSearchInput(label)
    setShowSuggestions(false)
    // TODO: FeedFilters에 country 필드 추가 후 여기서 setFilters로 실제 필터 연동
  }

  return (
    <div className="pb-8">
      <div className="bg-linear-to-b from-indigo-100 via-blue-50 to-white border-b border-slate-100">
        <Header />
        <header className="px-4 pb-4">
          <p className="text-m text-primary font-medium">지금 유럽</p>
          <h1 className="text-2xl font-bold text-slate-900">
            오늘은 어디로
            <br />
            같이 가볼까요?
          </h1>
          <form onSubmit={handleSearchSubmit} className="relative mt-3"> {/* className에 relative 추가 */}
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
              strokeWidth={2}
            /> {/* 추가 */}
            <input
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value)
                setShowSuggestions(true) // 추가
              }}
              onFocus={() => setShowSuggestions(true)} // 추가
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)} // 추가
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs shadow-sm bg-white" // px-4 → pl-10 pr-4 (아이콘 자리 확보)
              placeholder="도시, 날짜로 동행 찾기"
            />

            {showSuggestions && suggestions.length > 0 && ( // 추가
              <div className="absolute top-full left-0 right-0 mt-1 z-10 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                {suggestions.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => handleSelectCountry(c.label)}
                    className="cursor-pointer block w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            )}
          </form>
        </header>
      </div>

      <FeedFilterBar
        filters={filters}
        options={FILTER_OPTIONS}
        onChange={setFilters}
        onlyEligible={onlyEligible}
        onToggleEligible={() => setOnlyEligible((prev) => !prev)}
        eligibilityDisabled={!myProfile}
      />

      <div className="px-4 flex flex-col gap-3 mt-2">
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-slate-100 animate-pulse" />
          ))}

        {!isLoading && visibleItems.length === 0 && (
          <p className="text-center text-sm text-slate-400 py-10">조건에 맞는 동행이 없어요.</p>
        )}

        {visibleItems.map((item) => (
          <FeedPostCard
            key={item.id}
            id={item.id}
            travelCity={item.travelCity}
            title={item.title}
            content={item.content}
            startDate={item.startDate}
            endDate={item.endDate}
            startAge={item.startAge}
            endAge={item.endAge}
            gender={item.gender}
            isRecruiting={item.isRecruiting}
            view={item.view}
            updatedAt={item.updatedAt}
          />
        ))}
      </div>

      <div ref={sentinelRef} className="h-4" />
      {isFetchingNextPage && <p className="text-center text-xs text-slate-400 py-4">불러오는 중...</p>}
    </div>
  )
}