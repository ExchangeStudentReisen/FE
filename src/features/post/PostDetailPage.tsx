// pages/post/PostDetailPage.tsx
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Header } from '../../components/Header'
import { KakaoChatModal } from '../../components/KakaoChatModal'
import { usePostDetail } from '../../hooks/usePost'
import { Calendar, Pencil } from 'lucide-react'
import {
  formatAgeFromBirthYear,
  formatAgeRange,
  formatDateRange,
  formatUpdatedDate,
  getGenderLabel,
} from '../../utils/postDetailFormat'
import { getCityMeta } from '../../utils/countryMeta'
import type { AuthorGender } from '../../types/post'
import { useMyProfile } from '../../hooks/useMyProfile'

function getPersonGenderLabel(gender: AuthorGender): string {
  return gender === 'FEMALE' ? '여성' : '남성'
}

export function PostDetailPage() {
  const navigate = useNavigate()
  const { postId } = useParams<{ postId: string }>()
  const { data: post, isLoading, isError } = usePostDetail(postId)
  const { data: myProfile } = useMyProfile()
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-[#f7fafe] pb-24">
        <Header />
        <div className="px-4 mt-4 flex flex-col gap-3">
          <div className="h-6 w-2/3 rounded bg-slate-100 animate-pulse" />
          <div className="h-24 rounded-xl bg-slate-100 animate-pulse" />
        </div>
      </div>
    )
  }

  if (isError || !post) {
    return (
      <div className="relative min-h-screen bg-[#f7fafe] pb-24">
        <Header />
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <p className="text-sm text-slate-400">게시글을 찾을 수 없어요.</p>
        </div>
      </div>
    )
  }

  const city = getCityMeta(post.travelCity)
  const isAuthor = myProfile?.id === post.authorId

  return (
    <div className="relative min-h-screen bg-[#f7fafe] pb-24">
      <Header />

      <div className="px-4 mt-4">
        {/* 국가 */}
        <div className="flex items-center gap-2">
          <p className="text-sm text-slate-500">
            {city.flag} {city.cityLabel}
          </p>
        </div>

        {/* 제목 */}
        <h1 className="mt-1 text-xl font-bold text-slate-900">{post.title}</h1>

        {/* 뱃지들 */}
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
              post.isRecruiting
                ? 'bg-sky-50 text-sky-600'
                : 'bg-slate-100 text-slate-400'
            }`}
          >
            {post.isRecruiting ? '모집중' : '마감'}
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            최대 {post.maxMembers}명
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            조회 {post.view}
          </span>
          <span className="text-xs text-slate-400">
            최종 수정 {formatUpdatedDate(post.updatedAt)}
          </span>
          {isAuthor && (
            <button
              type="button"
              onClick={() => navigate(`/post/${post.id}/edit`)}
              className="ml-auto flex items-center gap-1 text-xs font-medium text-blue-600 cursor-pointer"
            >
              <Pencil size={12} />
              수정하기
            </button>
          )}
        </div>

        {/* 작성자 */}
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-600">
            {post.authorName[0]}
          </div>
          <p className="text-sm font-semibold text-slate-900">
            {post.authorName} · {getPersonGenderLabel(post.authorGender)} ·{' '}
            {formatAgeFromBirthYear(post.authorBirthYear)}살
          </p>
        </div>

        {/* 일정 */}
        <section className="mt-5">
          <p className="text-sm font-semibold text-slate-900">일정</p>
          <div className="mt-2 rounded-xl border border-slate-100 bg-white text-sm">
            <div className="flex items-center gap-2 px-3 py-4 text-slate-700">
              <Calendar className="h-4 w-4 text-slate-400" strokeWidth={2} />
              {formatDateRange(post.startDate, post.endDate)}
            </div>
          </div>
        </section>

        {/* 소개 */}
        <section className="mt-5">
          <p className="text-sm font-semibold text-slate-900">소개</p>
          <div className="mt-2 rounded-xl border border-slate-100 bg-white text-sm">
            <p className="whitespace-pre-line px-3 py-4 text-slate-600">{post.content}</p>
          </div>
        </section>

        {/* 모집 정보 - 항목 사이 구분선 */}
        <section className="mt-5">
          <p className="text-sm font-semibold text-slate-900">모집 정보</p>
          <div className="mt-2 divide-y divide-slate-100 rounded-xl border border-slate-100 bg-white text-sm">
            <div className="flex px-3 py-4 text-slate-500">
              <span className="w-20 shrink-0">모집 성별</span>
              <span className="font-medium text-slate-900">{getGenderLabel(post.gender)}</span>
            </div>
            <div className="flex px-3 py-4 text-slate-500">
              <span className="w-20 shrink-0">연령대</span>
              <span className="font-medium text-slate-900">
                {formatAgeRange(post.startAge, post.endAge)}
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* 하단 고정 바 - 카카오 오픈채팅 버튼만 */}
      <div className="fixed bottom-0 left-1/2 w-full max-w-107.5 -translate-x-1/2 border-t border-slate-100 bg-[#fefefe] px-4 py-3">
        <button
          onClick={() => setIsChatModalOpen(true)}
          className="w-full rounded-xl bg-[#FEE500] py-3.5 text-sm font-bold text-black/85"
        >
          카카오 오픈채팅 입장
        </button>
      </div>

      <KakaoChatModal
        open={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        authorName={post.authorName}
        postId={post.id.toString()}
        memberId={myProfile?.id}
      />
    </div>
  )
}