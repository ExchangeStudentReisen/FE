import { Header } from '../../components/Header'
import { FeedPostCard } from '../../components/FeedPostCard'
import { useMyProfile } from '../../hooks/useMyProfile'
import { useMyPosts } from '../../hooks/useMyPosts'
import { useInfiniteScrollTrigger } from '../../hooks/useInfiniteScrollerTrigger'
import { calculateAge } from '../../utils/eligibility'
import type { MemberGender } from '../../types/auth'

const GENDER_LABEL: Record<MemberGender, string> = {
  MALE: '남성',
  FEMALE: '여성',
}

// TODO: dispatchCountry 실제 enum 전체 목록으로 교체 예정 (SchoolEmailVerifyPage의 DISPATCH_COUNTRIES 참고)
const DISPATCH_COUNTRY_LABEL: Record<string, string> = {
  GERMANY: '독일',
  FRANCE: '프랑스',
  ITALY: '이탈리아',
  SPAIN: '스페인',
  NETHERLANDS: '네덜란드',
  UK: '영국',
}

export function ProfilePage() {
  const { data: myProfile } = useMyProfile()
  const memberId = myProfile?.id

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useMyPosts(memberId)

  const sentinelRef = useInfiniteScrollTrigger(() => fetchNextPage(), !!hasNextPage && !isFetchingNextPage)

  // id 내림차순 = 작성 순서 최신순. updatedAt은 조회수가 오를 때도 갱신돼서 최근 작성 여부와 안 맞음
  const myPosts = (data?.pages.flatMap((page) => page.data.content) ?? [])
    .slice()
    .sort((a, b) => b.id - a.id)

  return (
    <div className="pb-8">
      <Header/>
        <div className='px-4'>
          <h1 className="text-2xl font-bold text-slate-900 mb-4">내 프로필</h1>
          {/* TODO: 동행 완료/진행중/매너 평점, 다녀온 도시 타임라인 */}
          {myProfile ? (
            <div className="rounded-xl border border-slate-100 bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-slate-900">{myProfile.name}</p>
                {myProfile.emailVerified && (
                  <span className="rounded-full bg-primary-light px-2.5 py-1 text-xs font-medium text-primary">
                    학교 인증 완료
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-slate-500">{myProfile.email}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                  {myProfile.schoolName}
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                  {GENDER_LABEL[myProfile.gender]} · {calculateAge(myProfile.birthYear)}세
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                  파견 {DISPATCH_COUNTRY_LABEL[myProfile.dispatchCountry] ?? myProfile.dispatchCountry}
                </span>
              </div>
            </div>
          ) : (
            <div className="h-24 rounded-xl bg-slate-100 animate-pulse" />
          )}

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
