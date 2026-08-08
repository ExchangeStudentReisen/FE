import { useState } from 'react'
import { Header } from '../../components/Header'
import { FeedFilterBar } from '../../components/FeedFilterBar'
import { FeedPostCard } from '../../components/FeedPostCard'
import { useInfiniteFeed } from '../../hooks/useInfiniteFeed'
import { useInfiniteScrollTrigger } from '../../hooks/useInfiniteScrollerTrigger'
import type { FeedFilterOptions, FeedFilters } from '../../types/feed'

// TODO: 실제 카테고리/월/성별 옵션으로 채우기
const FILTER_OPTIONS: FeedFilterOptions = {
  categories: [],
  months: [],
  genders: [],
}

// TODO: 초기 필터값 정의 (categories/months/genders의 '전체' 대응 값에 맞춰서)
const DEFAULT_FILTERS: FeedFilters = {
  category: 'all',
  month: '전체',
  gender: '전체',
  sort: 'latest',
  keyword: '',
}

export function FeedPage() {
  const [filters, setFilters] = useState<FeedFilters>(DEFAULT_FILTERS)
  const [searchInput, setSearchInput] = useState('')

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteFeed(filters)

  const sentinelRef = useInfiniteScrollTrigger(() => fetchNextPage(), !!hasNextPage && !isFetchingNextPage)

  const items = data?.pages.flatMap((page) => page.items) ?? []

  // TODO: '전체' 판정 조건은 정의한 옵션 값에 맞춰 조정
  const activeFilterCount =
    (filters.month !== DEFAULT_FILTERS.month ? 1 : 0) +
    (filters.gender !== DEFAULT_FILTERS.gender ? 1 : 0)

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFilters((prev) => ({ ...prev, keyword: searchInput }))
  }

  return (
    <div className="pb-8">
      <div className="bg-linear-to-b from-indigo-100 via-blue-50 to-white">
        <Header />
        <header className="px-4 pb-4">
          <p className="text-m text-primary font-medium">지금 유럽</p>
          <h1 className="text-2xl font-bold text-slate-900">
            오늘은 어디로
            <br />
            같이 가볼까요?
          </h1>
          <form onSubmit={handleSearchSubmit} className="mt-3">
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-m"
              placeholder="도시, 날짜로 동행 찾기"
            />
          </form>
        </header>
      </div>
      
      <FeedFilterBar
        filters={filters}
        options={FILTER_OPTIONS}
        onChange={setFilters}
        onOpenFilterSheet={() => {
          // TODO: 상세 필터 바텀시트 연결
        }}
        activeFilterCount={activeFilterCount}
      />

      <div className="px-4 flex flex-col gap-3 mt-2">
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-slate-100 animate-pulse" />
          ))}

        {!isLoading && items.length === 0 && (
          <p className="text-center text-sm text-slate-400 py-10">조건에 맞는 동행이 없어요.</p>
        )}

        {items.map((item) => (
            <FeedPostCard
    key={item.id}
    id={item.id}
    flag={item.flag}
    city={item.city}
    dateRange={item.dateRange}
    title={item.title}
    school={item.school}
    gender={item.gender}
    age={item.age}
    tag={item.tag}
    createdAgo={item.createdAgo}
  />
        ))}
      </div>

      <div ref={sentinelRef} className="h-4" />
      {isFetchingNextPage && <p className="text-center text-xs text-slate-400 py-4">불러오는 중...</p>}
    </div>
  )
}