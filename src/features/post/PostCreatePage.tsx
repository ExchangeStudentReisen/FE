export function PostCreatePage() {
  return (
    <div className="p-4 pb-20">
      <h1 className="text-lg font-bold text-slate-900">모집글 작성</h1>
      {/* TODO: Step 1 도시·날짜 -> Step 2 모집 정보 -> Step 3 소개·링크
          React Hook Form + Zod로 3단계 상태를 하나의 폼 컨텍스트로 관리 */}
      <p className="text-sm text-slate-400 mt-2">Step 1 · 도시 · 날짜</p>
    </div>
  )
}
