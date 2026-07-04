import { useParams } from 'react-router-dom'

export function PostDetailPage() {
  const { postId } = useParams()

  return (
    <div className="p-4 pb-20">
      <h1 className="text-lg font-bold text-slate-900">모집글 상세</h1>
      <p className="text-sm text-slate-400 mt-2">post id: {postId}</p>
      {/* TODO: 일정, 모집 정보, "카카오 오픈채팅 입장" 모달 연결 */}
    </div>
  )
}
