// pages/post/PostDetailPage.tsx
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Header } from '../../components/Header'
import { KakaoChatModal } from '../../components/KakaoChatModal'
import { usePostDetail } from '../../hooks/usePostDetail'

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: post, isLoading } = usePostDetail(id)
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  if (isLoading || !post) {
    return (
      <div className="pb-8">
        <Header />
        <div className="px-4 mt-4 flex flex-col gap-3">
          <div className="h-48 rounded-xl bg-slate-100 animate-pulse" />
          <div className="h-6 w-2/3 rounded bg-slate-100 animate-pulse" />
          <div className="h-24 rounded-xl bg-slate-100 animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="pb-24">
      <Header />

      {/* 이미지 배너 */}
      <div className="relative">
        <img src={post.imageUrl} alt={post.title} className="h-56 w-full object-cover" />
        <p className="absolute bottom-3 left-4 text-xs text-white/90">{post.location}</p>
      </div>

      <div className="px-4">
        {/* 국기 + 도시 */}
        <p className="mt-4 text-sm text-slate-500">
          {post.flag} {post.city}
        </p>

        {/* 제목 */}
        <h1 className="mt-1 text-xl font-bold text-slate-900">{post.title}</h1>

        {/* 뱃지들 */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {post.isVerified && (
            <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-600">
              🛡️ 학생인증
            </span>
          )}
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            {post.ddayLabel}
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            {post.interestedCount}명 관심중
          </span>
        </div>

        {/* 작성자 카드 */}
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-100 p-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-600">
            {post.author.name[0]}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-900">
              {post.author.name} · {post.author.gender} · {post.author.age}살
            </p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
              {post.author.isSchoolVerified && (
                <span className="rounded bg-sky-50 px-1.5 py-0.5 text-[10px] text-sky-600">
                  연세대학교
                </span>
              )}
              {post.author.school}
            </p>
          </div>
          <button className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600">
            프로필
          </button>
        </div>

        {/* 일정 */}
        <section className="mt-5">
          <p className="text-sm font-semibold text-slate-900">일정</p>
          <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-100 px-3 py-2.5 text-sm text-slate-700">
            📅 {post.dateRangeLabel}
          </div>

          <ul className="mt-3 flex flex-col gap-3 border-l border-slate-100 pl-4">
            {post.itinerary.map((item, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-sky-500" />
                <p className="text-sm font-semibold text-slate-900">
                  {item.date} · {item.timeLabel}
                </p>
                <p className="mt-0.5 text-sm text-slate-500">{item.description}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* 모집 정보 */}
        <section className="mt-5">
          <p className="text-sm font-semibold text-slate-900">모집 정보</p>
          <div className="mt-2 flex flex-col gap-2 rounded-xl border border-slate-100 p-3 text-sm">
            <div className="flex justify-between text-slate-500">
              <span>모집 성별</span>
              <span className="font-medium text-slate-900">{post.recruit.gender}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>연령대</span>
              <span className="font-medium text-slate-900">{post.recruit.ageRange}</span>
            </div>
          </div>
        </section>
      </div>

      {/* 하단 고정 바 */}
      <div className="fixed bottom-0 left-0 right-0 flex items-center gap-3 border-t border-slate-100 bg-white px-4 py-3">
        <button
          onClick={() => setIsLiked((v) => !v)}
          className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200"
        >
          {isLiked ? '❤️' : '🤍'}
        </button>
        <button
          onClick={() => setIsChatModalOpen(true)}
          className="flex-1 rounded-xl bg-yellow-400 py-3.5 text-sm font-bold text-slate-900"
        >
          💬 카카오 오픈채팅 입장
        </button>
      </div>

      <KakaoChatModal
        open={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        authorName={post.author.name}
        chatUrl={post.kakaoOpenChatUrl}
      />
    </div>
  )
}