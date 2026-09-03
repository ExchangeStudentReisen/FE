import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, User } from 'lucide-react'

const PAGE_LABEL: Record<string, string> = {
  '/feed': 'Reisen',
  '/search': '탐색',
  '/post/new': '글쓰기',
  '/profile': '프로필 페이지',
}

function getLabel(pathname: string) {
  if (pathname.startsWith('/post/new')) return PAGE_LABEL['/post/new']
  if (pathname.startsWith('/profile')) return PAGE_LABEL['/profile']
  if (pathname.startsWith('/search')) return PAGE_LABEL['/search']
  return PAGE_LABEL['/feed']
}

// '/post/new'를 제외한 '/post/:id' 패턴인지 확인
function isPostDetail(pathname: string) {
  return pathname.startsWith('/post/') && pathname !== '/post/new'
}

export function Header() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const isHome = pathname === '/feed'
  const showBack = isPostDetail(pathname)
  const label = getLabel(pathname)

  return (
    <div className="mx-auto flex max-w-107.5 items-center px-4 py-3">
      {/* 로고: 홈에서는 풀 워드마크, 상세 페이지에서는 뒤로가기, 그 외엔 배지 + 페이지명 */}
      <div className="flex items-center gap-2">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="cursor-pointer -ml-1 w-7 h-7 flex items-center justify-center shrink-0 text-slate-700"
            aria-label="뒤로가기"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        {!showBack && (
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <span className="text-white text-m font-bold">R</span>
          </div>
        )}
        {!showBack && (
          isHome ? (
            <span className="text-primary font-bold text-lg">Reisen</span>
          ) : (
            <span className="text-slate-900 font-bold text-lg">{label}</span>
          )
        )}
      </div>

      {/* 우측 상단 네비게이션 */}
      <div className="flex items-center gap-3 ml-auto shrink-0">
        <button
          onClick={() => navigate('/post/new')}
          className={`cursor-pointer w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
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
          className={`cursor-pointer w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
            pathname.startsWith('/profile')
              ? 'bg-primary text-white'
              : 'bg-slate-100 text-slate-500'
          }`}
          aria-label="프로필 페이지"
        >
          <User size={18} />
        </button>
      </div>
    </div>
  )
}