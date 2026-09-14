import { useNavigate } from 'react-router-dom'
import { Calendar } from 'lucide-react'
import { truncateContent, formatRelativeTime } from '../utils/feedFormat'
import { formatAgeRange, getGenderLabel } from '../utils/postDetailFormat'
import { formatDateRange as formatCardDateRange } from '../utils/feedFormat'
import { getCityMeta } from '../utils/countryMeta'

interface FeedPostCardProps {
  id: number
  travelCity: string
  title: string
  content: string
  startDate: string
  endDate: string
  startAge: number
  endAge: number
  gender: 'MALE' | 'FEMALE' | 'OTHER' | null
  isRecruiting: boolean
  view: number
  updatedAt: string
}

export function FeedPostCard({
  id,
  travelCity,
  title,
  content,
  startDate,
  endDate,
  startAge,
  endAge,
  gender,
  isRecruiting,
  view,
  updatedAt,
}: FeedPostCardProps) {
  const navigate = useNavigate()
  const { flag, cityLabel } = getCityMeta(travelCity)

  return (
    <button
      onClick={() => navigate(`/post/${id}`)}
      className="cursor-pointer w-full text-left rounded-xl border border-slate-200 bg-white p-4"
    >
      <div className="flex items-center justify-between">
        <span className="text-base font-bold text-slate-900">
          {flag} {cityLabel}
        </span>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            isRecruiting ? 'bg-sky-50 text-sky-600' : 'bg-slate-100 text-slate-400'
          }`}
        >
          {isRecruiting ? '모집중' : '마감'}
        </span>
      </div>

      <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
        <Calendar className="w-3.5 h-3.5" strokeWidth={2} />
        <span>{formatCardDateRange(startDate, endDate)}</span>
      </div>

      <h3 className="mt-2 text-base font-bold text-slate-900">{title}</h3>

      <p className="mt-1 text-sm text-slate-500 truncate">
        {truncateContent(content)}
      </p>

      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <span>
          {getGenderLabel(gender)} · {formatAgeRange(startAge, endAge)}
        </span>
        <span>
          {formatRelativeTime(updatedAt)} · 조회 {view}
        </span>
      </div>
    </button>
  )
}