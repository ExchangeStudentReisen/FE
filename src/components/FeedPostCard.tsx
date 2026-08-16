import { useNavigate } from 'react-router-dom'

interface FeedPostCardProps {
  id: string
  flag: string // 국기 이모지 or 이미지 URL
  city: string
  dateRange: string
  title: string
  school: string
  gender: string
  age: number
  tag: string
  createdAgo: string
}

export function FeedPostCard({
  id,
  flag,
  city,
  dateRange,
  title,
  school,
  gender,
  age,
  tag,
  createdAgo,
}: FeedPostCardProps) {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(`/post/${id}`)}
      className="cursor-pointer w-full flex items-start gap-3 py-3 text-left"
    >
      {/* 국기 아이콘 */}
      <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-xl shrink-0">
        {flag}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            {city} <span className="mx-1">·</span> {dateRange}
          </p>
        </div>

        <p className="text-base font-semibold text-slate-900 truncate mt-0.5">
          {title}
        </p>

        <div className="flex items-center justify-between mt-1">
          <p className="text-sm text-slate-500 truncate">
            <span className="text-primary">{school}</span>
            <span className="mx-1">·</span>
            {gender} · {age}살
            <span className="mx-1">·</span>
            {tag}
          </p>
          <span className="text-xs text-slate-400 shrink-0 ml-2">{createdAgo}</span>
        </div>
      </div>
    </button>
  )
}