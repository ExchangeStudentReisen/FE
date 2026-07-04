import { BottomNav } from '../../components/BottomNav'

export function FeedPage() {
  return (
    <div className="pb-20">
      <header className="p-4">
        <p className="text-xs text-primary font-medium">지금 유럽</p>
        <h1 className="text-xl font-bold text-slate-900">
          오늘은 어디로
          <br />
          같이 가볼까요?
        </h1>
        <input
          className="w-full mt-3 px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
          placeholder="도시, 날짜로 동행 찾기"
        />
      </header>

      {/* TODO: TanStack Query로 실제 피드 데이터 연결 (useQuery(['feed', filters], fetchFeed)) */}
      <p className="px-4 text-sm text-slate-400">
        피드 목록이 이 자리에 표시됩니다.
      </p>

      <BottomNav />
    </div>
  )
}
