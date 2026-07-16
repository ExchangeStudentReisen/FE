import { Header } from '../../components/Header'

export function SearchPage() {
  return (
    <div className="pb-20 p-4">
      <Header/>
        <div className='px-4'>
          <h1 className="text-lg font-bold text-slate-900 mb-4">검색 & 필터</h1>
          {/* TODO: 국가·도시 다중 선택, 날짜 범위, 모집 성별, 출생연도, 여행 스타일 필터 UI */}
          <p className="text-sm text-slate-400">검색 결과 목록이 이 자리에 표시됩니다.</p>
        </div>
    </div>
  )
}
