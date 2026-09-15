import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pencil } from 'lucide-react'
import { Header } from '../../components/Header'
import { FeedPostCard } from '../../components/FeedPostCard'
import { useMyProfile, useUpdateMyProfile, useDeleteMyProfile } from '../../hooks/useMyProfile'
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
  const navigate = useNavigate()
  const { data: myProfile } = useMyProfile()
  const memberId = myProfile?.id
  const updateProfile = useUpdateMyProfile()
  const deleteProfile = useDeleteMyProfile()

  const [isEditingName, setIsEditingName] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [nameError, setNameError] = useState('')
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [withdrawError, setWithdrawError] = useState('')

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useMyPosts(memberId)

  const sentinelRef = useInfiniteScrollTrigger(() => fetchNextPage(), !!hasNextPage && !isFetchingNextPage)

  const handleStartEditName = () => {
    if (!myProfile) return
    setNameInput(myProfile.name)
    setNameError('')
    setIsEditingName(true)
  }

  const handleCancelEditName = () => {
    setIsEditingName(false)
    setNameError('')
  }

  const handleSaveName = () => {
    if (!myProfile) return
    const trimmed = nameInput.trim()
    if (!trimmed) {
      setNameError('닉네임을 입력해주세요.')
      return
    }
    updateProfile.mutate(
      {
        id: myProfile.id,
        name: trimmed,
        gender: myProfile.gender,
        birthYear: myProfile.birthYear,
        dispatchCountry: myProfile.dispatchCountry,
      },
      {
        onSuccess: () => setIsEditingName(false),
        onError: () => setNameError('닉네임 변경에 실패했어요. 다시 시도해주세요.'),
      },
    )
  }

  const handleWithdraw = () => {
    if (!myProfile) return
    setWithdrawError('')
    deleteProfile.mutate(myProfile.id, {
      onSuccess: () => navigate('/', { replace: true }),
      onError: () => setWithdrawError('탈퇴에 실패했어요. 다시 시도해주세요.'),
    })
  }

  // id 내림차순 = 작성 순서 최신순. updatedAt은 조회수가 오를 때도 갱신돼서 최근 작성 여부와 안 맞음
  const myPosts = (data?.pages.flatMap((page) => page.data.content) ?? [])
    .slice()
    .sort((a, b) => b.id - a.id)

  return (
    <div className="pb-8">
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-8">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center">
            <p className="text-base font-semibold text-slate-900 mb-2">정말 탈퇴하시겠어요?</p>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              탈퇴하면 계정과 작성한 정보가 삭제되고 되돌릴 수 없어요.
            </p>
            {withdrawError && <p className="text-xs text-red-500 mb-3">{withdrawError}</p>}
            <div className="flex gap-2">
              <button
                onClick={() => setShowWithdrawModal(false)}
                disabled={deleteProfile.isPending}
                className="flex-1 h-11 rounded-xl border border-slate-300 text-slate-600 font-medium cursor-pointer disabled:opacity-50"
              >
                취소
              </button>
              <button
                onClick={handleWithdraw}
                disabled={deleteProfile.isPending}
                className="flex-1 h-11 rounded-xl bg-red-500 text-white font-medium cursor-pointer disabled:opacity-50"
              >
                {deleteProfile.isPending ? '탈퇴 중...' : '탈퇴하기'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Header/>
        <div className='px-4'>
          <h1 className="text-2xl font-bold text-slate-900 mb-4">내 프로필</h1>
          {/* TODO: 동행 완료/진행중/매너 평점, 다녀온 도시 타임라인 */}
          {myProfile ? (
            <div className="rounded-xl border border-slate-100 bg-white p-4">
              <div className="flex items-center justify-between">
                {isEditingName ? (
                  <div className="flex-1">
                    <input
                      value={nameInput}
                      onChange={(e) => {
                        setNameInput(e.target.value)
                        if (nameError) setNameError('')
                      }}
                      autoFocus
                      className={`w-full rounded-lg border px-2.5 py-1.5 text-sm font-medium outline-none ${
                        nameError
                          ? 'border-red-400 text-red-500 focus:border-red-400'
                          : 'border-slate-200 focus:border-blue-600'
                      }`}
                    />
                    {nameError && <p className="mt-1 text-xs text-red-500">{nameError}</p>}
                  </div>
                ) : (
                  <p className="text-lg font-bold text-slate-900">{myProfile.name}</p>
                )}

                <div className="flex items-center gap-2 shrink-0 ml-2">
                  {isEditingName ? (
                    <>
                      <button
                        type="button"
                        onClick={handleSaveName}
                        disabled={updateProfile.isPending}
                        className="rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-white cursor-pointer disabled:opacity-50"
                      >
                        {updateProfile.isPending ? '저장 중...' : '저장'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEditName}
                        disabled={updateProfile.isPending}
                        className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500 cursor-pointer disabled:opacity-50"
                      >
                        취소
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={handleStartEditName}
                        aria-label="닉네임 수정"
                        className="p-1 text-slate-400 cursor-pointer"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowWithdrawModal(true)}
                        className="text-xs font-medium text-slate-400 underline cursor-pointer whitespace-nowrap"
                      >
                        탈퇴
                      </button>
                    </>
                  )}
                </div>
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
