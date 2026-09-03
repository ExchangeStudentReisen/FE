import { useFormContext } from 'react-hook-form'
import { Link as LinkIcon, Check, ShieldCheck, CalendarClock } from 'lucide-react'
import type { PostCreateFormValues } from '@/schemas/postCreateSchema'

export function Step3IntroLink() {
  const { register, watch, formState: { errors } } = useFormContext<PostCreateFormValues>()

  const title = watch('title') ?? ''
  const content = watch('content') ?? ''
  const kakaoUrl = watch('kakaoOpenChatUrl') ?? ''
  const endDate = watch('endDate')

  const isKakaoValid = !errors.kakaoOpenChatUrl && kakaoUrl.length > 0

  const autoDeleteLabel = endDate
    ? `${new Date(endDate).getMonth() + 1}월 ${new Date(endDate).getDate() + 1}일에 자동 삭제`
    : '여행 종료 다음 날 자동 삭제'

  return (
    <div className="px-4 pb-4">
      <h1 className="text-lg font-bold text-slate-900 mt-4">마지막으로 한 줄만 더</h1>

      <div className="mt-5">
        <p className="text-sm font-medium text-slate-700">한 줄 제목</p>
        <input
          {...register('title')}
          maxLength={30}
          placeholder="프라하 같이 다니실 여성분 구해요"
          className="mt-2 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-600"
        />
        <div className="flex items-center justify-between mt-1">
          {errors.title ? <p className="text-xs text-red-500">{errors.title.message}</p> : <span />}
          <p className="text-xs text-slate-400">{title.length} / 30</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium text-slate-700">소개</p>
        <textarea
          {...register('content')}
          maxLength={500}
          rows={5}
          placeholder="일정, 같이 하고 싶은 것, 원하는 동행 스타일을 자유롭게 적어주세요"
          className="mt-2 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-600 resize-none"
        />
        <div className="flex items-center justify-between mt-1">
          {errors.content ? <p className="text-xs text-red-500">{errors.content.message}</p> : <span />}
          <p className="text-xs text-slate-400">{content.length} / 500</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium text-slate-700">카카오 오픈채팅 링크</p>
        <div className="mt-2 relative">
          <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            {...register('kakaoOpenChatUrl')}
            placeholder="open.kakao.com/o/xxxxxxx"
            className="w-full border border-slate-200 rounded-xl pl-9 pr-9 py-2.5 text-sm outline-none focus:border-blue-600"
          />
          {isKakaoValid && <Check size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600" />}
        </div>
        {errors.kakaoOpenChatUrl && <p className="mt-1 text-xs text-red-500">{errors.kakaoOpenChatUrl.message}</p>}
      </div>

      <div className="mt-4 flex items-start gap-2 text-xs text-slate-400">
        <ShieldCheck size={14} className="mt-0.5 shrink-0" />
        <p>참가자가 직접 이 링크로 들어와요. 카톡 ID는 공개되지 않아요.</p>
      </div>

      <div className="mt-3 flex items-center gap-2 border border-slate-100 bg-slate-50 rounded-xl px-3 py-2.5">
        <CalendarClock size={16} className="text-slate-400 shrink-0" />
        <div>
          <p className="text-sm font-medium">{autoDeleteLabel}</p>
          <p className="text-xs text-slate-400">여행 종료 다음 날 게시글이 사라져요</p>
        </div>
      </div>
    </div>
  )
}