import { Header } from '../../components/Header'

export function ProfilePage() {
  return (
    <div className="pb-8">
      <Header/>
        <div className='px-4'>
          <h1 className="text-2xl font-bold text-slate-900 mb-4">내 프로필</h1>
          {/* TODO: 인증 학교, 동행 완료/진행중/매너 평점, 진행중 모집 카드, 다녀온 도시 타임라인 */}
          <p className="text-m text-slate-400">프로필 정보가 이 자리에 표시됩니다.</p>
        </div>
    </div>
  )
}
