import { useLocation, useNavigate } from 'react-router-dom'
import { Plus, User } from 'lucide-react'

const PAGE_LABEL: Record<string, string> = {
  '/feed': 'Reisen',
  '/search': '탐색',
  '/post/new': '글쓰기',
  '/profile': '나',
}

function getLabel(pathname: string) {
  if (pathname.startsWith('/post/new')) return PAGE_LABEL['/post/new']
  if (pathname.startsWith('/profile')) return PAGE_LABEL['/profile']
  if (pathname.startsWith('/search')) return PAGE_LABEL['/search']
  return PAGE_LABEL['/feed']
}

export function Header() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const isHome = pathname === '/feed'
  const label = getLabel(pathname)

  return (
    <div className="flex items-center justify-between px-4 py-3">
      {/* 로고: 홈에서는 풀 워드마크, 그 외 페이지에서는 배지 + 페이지명 */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <span className="text-white text-m font-bold">R</span>
        </div>
        {isHome ? (
          <span className="text-primary font-bold text-lg">Reisen</span>
        ) : (
          <span className="text-slate-900 font-bold text-lg">{label}</span>
        )}
      </div>

      {/* 우측 상단 네비게이션 */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/post/new')}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
            pathname.startsWith('/post/new')
              ? 'bg-primary text-white'
              : 'bg-slate-100 text-slate-500'
          }`}
          aria-label="글쓰기"
        >
          <Plus size={18} />
        </button>
        <button
          onClick={() => navigate('/profile')}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
            pathname.startsWith('/profile')
              ? 'bg-primary text-white'
              : 'bg-slate-100 text-slate-500'
          }`}
          aria-label="나"
        >
          <User size={18} />
        </button>
      </div>
    </div>
  )
}