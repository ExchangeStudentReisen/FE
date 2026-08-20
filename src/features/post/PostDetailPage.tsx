// pages/post/PostDetailPage.tsx
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Header } from '../../components/Header'
import { KakaoChatModal } from '../../components/KakaoChatModal'
import { usePostDetail } from '../../hooks/usePostDetail'
import {
  formatAgeRange,
  formatDateRange,
  getCityMeta,
  getGenderLabel,
} from '../../utils/postDetailFormat'

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: post, isLoading, isError } = usePostDetail(id)
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="mx-auto min-h-screen max-w-[430px] bg-white pb-8">
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
      <div className="mx-auto min-h-screen max-w-107.5 bg-white pb-8">
        <Header />
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <p className="text-sm text-slate-400">게시글을 찾을 수 없어요.</p>
        </div>
      </div>
    )
  }

  const city = getCityMeta(post.tripCity)

  return (
    <div className="relative mx-auto min-h-screen max-w-107.5 bg-white pb-24">
      <Header />

      <div className="px-4 mt-4">
        {/* 국가 + 모집 상태 */}
        <div className="flex items-center gap-2">
          <p className="text-sm text-slate-500">
            {city.flag} {city.label}
          </p>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
              post.isRecruiting
                ? 'bg-sky-50 text-sky-600'
                : 'bg-slate-100 text-slate-400'
            }`}
          >
            {post.isRecruiting ? '모집중' : '마감'}
          </span>
        </div>

        {/* 제목 */}
        <h1 className="mt-1 text-xl font-bold text-slate-900">{post.title}</h1>

        {/* 뱃지들 */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            최대 {post.maxMembers}명
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            조회 {post.view}
          </span>
        </div>

        {/* 작성자 */}
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-100 p-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-600">
            {post.authorName[0]}
          </div>
          <p className="text-sm font-semibold text-slate-900">{post.authorName}</p>
        </div>

        {/* 일정 */}
        <section className="mt-5">
          <p className="text-sm font-semibold text-slate-900">일정</p>
          <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-100 px-3 py-2.5 text-sm text-slate-700">
            📅 {formatDateRange(post.startDate, post.endDate)}
          </div>
          <p className="mt-3 whitespace-pre-line text-sm text-slate-600">{post.content}</p>
        </section>

        {/* 모집 정보 */}
        <section className="mt-5">
          <p className="text-sm font-semibold text-slate-900">모집 정보</p>
          <div className="mt-2 flex flex-col gap-2 rounded-xl border border-slate-100 p-3 text-sm">
            <div className="flex justify-between text-slate-500">
              <span>모집 성별</span>
              <span className="font-medium text-slate-900">{getGenderLabel(post.gender)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>연령대</span>
              <span className="font-medium text-slate-900">
                {formatAgeRange(post.startAge, post.endAge)}
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* 하단 고정 바 - 카카오 오픈채팅 버튼만 */}
      <div className="fixed bottom-0 left-1/2 w-full max-w-107.5 -translate-x-1/2 border-t border-slate-100 bg-white px-4 py-3">
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
        chatUrl={post.kakaotalkLink}
      />
    </div>
  )
}