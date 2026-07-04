import { BottomNav } from '../../components/BottomNav'

export function ProfilePage() {
  return (
    <div className="pb-20 p-4">
      <h1 className="text-lg font-bold text-slate-900 mb-4">내 프로필</h1>
      {/* TODO: 인증 학교, 동행 완료/진행중/매너 평점, 진행중 모집 카드, 다녀온 도시 타임라인 */}
      <p className="text-sm text-slate-400">프로필 정보가 이 자리에 표시됩니다.</p>
      <BottomNav />
    </div>
  )
}
