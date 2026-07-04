export function WelcomePage() {
  return (
    <div className="flex flex-col justify-end min-h-screen p-6 pb-12 bg-gradient-to-b from-primary-light to-white">
      <div className="mb-8">
        <p className="text-xs font-semibold text-primary mb-2">FOR EXCHANGE STUDENTS</p>
        <h1 className="text-2xl font-bold text-slate-900 leading-snug">
          교환학생끼리,
          <br />
          같은 일정을 만나요.
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          학교 인증된 친구들과 안전하게 유럽 여행 동행을 구하세요.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <button className="w-full py-3 rounded-xl bg-primary text-white font-medium">
          학교 이메일로 시작하기
        </button>
        <button className="w-full py-3 rounded-xl bg-yellow-400 text-slate-900 font-medium">
          카카오로 빠르게 시작
        </button>
      </div>
    </div>
  )
}
