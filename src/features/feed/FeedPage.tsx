import { useState } from 'react'
import { Header } from '../../components/Header'
import { FeedFilterBar } from '../../components/FeedFilterBar'
import { FeedPostCard } from '../../components/FeedPostCard'
import { useInfiniteFeed } from '../../hooks/useInfiniteFeed'
import { useInfiniteScrollTrigger } from '../../hooks/useInfiniteScrollerTrigger'
import { getCountryOptions } from '../../utils/countryMeta'
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
}

export function FeedPage() {
  const [filters, setFilters] = useState<FeedFilters>(DEFAULT_FILTERS)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteFeed(filters)

  const sentinelRef = useInfiniteScrollTrigger(() => fetchNextPage(), !!hasNextPage && !isFetchingNextPage)

  const { data: myProfile } = useMyProfile()
  const [onlyEligible, setOnlyEligible] = useState(false)

  const items = data?.pages.flatMap((page) => page.items) ?? []

  // 최신순은 백엔드가 이미 수정일 기준 내림차순으로 내려주는 순서를 그대로 사용
  // (updatedAt으로 프론트에서 다시 정렬하면 조회수 증가로 updatedAt이 갱신된 글이 "읽은 순서대로" 위로 튀어오름)
  const sortedItems = filters.sort === 'latest' ? items : [...items].sort((a, b) => b.view - a.view)

  const visibleItems =
    onlyEligible && myProfile ? sortedItems.filter((item) => isEligibleForPost(myProfile, item)) : sortedItems

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
        </header>
      </div>

      <div className='bg-[#f5fafe]'>
        <FeedFilterBar
          filters={filters}
          options={FILTER_OPTIONS}
          onChange={setFilters}
          onlyEligible={onlyEligible}
          onToggleEligible={() => setOnlyEligible((prev) => !prev)}
          eligibilityDisabled={!myProfile}
        />
      </div>

      <div className="px-4 flex flex-col gap-3 pt-2 bg-[#f5fafe]">
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