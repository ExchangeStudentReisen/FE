import { Header } from '../../components/Header'
import { FeedPostCard } from '../../components/FeedPostCard'
import { useMyProfile } from '../../hooks/useMyProfile'
import { useMyPosts } from '../../hooks/useMyPosts'
import { useInfiniteScrollTrigger } from '../../hooks/useInfiniteScrollerTrigger'

export function ProfilePage() {
  const { data: myProfile } = useMyProfile()
  const memberId = myProfile?.id

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useMyPosts(memberId)

  const sentinelRef = useInfiniteScrollTrigger(() => fetchNextPage(), !!hasNextPage && !isFetchingNextPage)

  const myPosts = data?.pages.flatMap((page) => page.data.content) ?? []

  return (
    <div className="pb-8">
      <Header/>
        <div className='px-4'>
          <h1 className="text-2xl font-bold text-slate-900 mb-4">내 프로필</h1>
          {/* TODO: 인증 학교, 동행 완료/진행중/매너 평점, 다녀온 도시 타임라인 */}
          <p className="text-m text-slate-400">프로필 정보가 이 자리에 표시됩니다.</p>

          <h2 className="mt-8 mb-3 text-lg font-bold text-slate-900">내가 작성한 동행 글</h2>

          <div className="flex flex-col gap-3">
            {isLoading &&
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-24 rounded-xl bg-slate-100 animate-pulse" />
              ))}

            {!isLoading && myPosts.length === 0 && (
              <p className="text-center text-sm text-slate-400 py-10">작성한 동행 글이 없어요.</p>
            )}

            {myPosts.map((post) => (
              <FeedPostCard
                key={post.id}
                id={post.id}
                travelCity={post.travelCity}
                title={post.title}
                content={post.content}
                startDate={post.startDate}
                endDate={post.endDate}
                startAge={post.startAge}
                endAge={post.endAge}
                gender={post.gender}
                isRecruiting={post.isRecruiting}
                view={post.view}
                updatedAt={post.updatedAt}
              />
            ))}
          </div>

          <div ref={sentinelRef} className="h-4" />
          {isFetchingNextPage && <p className="text-center text-xs text-slate-400 py-4">불러오는 중...</p>}
        </div>
    </div>
  )
}
