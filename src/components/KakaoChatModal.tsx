import kakaoLogo from '../assets/KAKAOTALK.svg'
import { useChatLink } from '../hooks/usePost'

interface KakaoChatModalProps {
  open: boolean
  onClose: () => void
  authorName: string
  postId: string
  memberId?: number
}

export function KakaoChatModal({ open, onClose, authorName, postId, memberId }: KakaoChatModalProps) {
  const { data, isLoading } = useChatLink(postId, memberId, open)

  if (!open) return null

  const chatUrl = data?.result === 'SUCCESS' ? data.data?.kakaotalkLink : undefined
  const isEligible = !isLoading && !!chatUrl

  function handleEnter() {
    if (!chatUrl) return
    window.open(chatUrl, '_blank', 'noopener,noreferrer')
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={kakaoLogo} alt="카카오톡" className="mx-auto mb-4 h-14 w-14" />

        <h2 className="text-lg font-bold text-slate-900">카카오 오픈채팅으로 이동</h2>
        <p className="mt-1 text-sm text-slate-500">
          {authorName}님이 만든 채팅방으로 이동해 자유롭게 대화할 수 있어요.
        </p>

        <div className="mt-4 flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-left text-xs text-slate-500">
          <span className="mt-0.5">🛡️</span>
          <p>
            <span className="font-semibold text-slate-700">안전 안내</span> 외부 링크 공유, 송금
            요청 등은 즉시 신고해주세요.
          </p>
        </div>

        {isEligible ? (
          <div className="mt-3 flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-600">
            <span>🔗</span>
            <span className="truncate">{chatUrl.replace('https://', '')}</span>
          </div>
        ) : (
          !isLoading && (
            <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2.5 text-sm text-slate-400">
              {data?.message ?? '모집 요건에 맞지 않아 채팅방에 입장할 수 없어요.'}
            </p>
          )
        )}

        <button
          onClick={handleEnter}
          disabled={!isEligible}
          className={`mt-4 w-full rounded-xl py-3 text-sm font-bold ${
            isEligible
              ? 'bg-[#FEE500] text-slate-900'
              : 'cursor-not-allowed bg-slate-200 text-slate-400'
          }`}
        >
          {isLoading ? '확인 중...' : '채팅방 입장하기'}
        </button>
        <button
          onClick={onClose}
          className="mt-2 w-full rounded-xl bg-slate-100 py-3 text-sm font-medium text-slate-600"
        >
          취소
        </button>
      </div>
    </div>
  )
}