import { useNavigate } from 'react-router-dom'
import kakaoLoginButton from '../../assets/kakao_login_large_wide.png'
import { BoardingPassCard } from './BoardingPassCard'

export function WelcomePage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col min-h-screen p-6 pb-12 bg-linear-to-b from-primary-light to-white">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-white text-sm font-bold">R</span>
        </div>
        <span className="text-primary font-bold text-lg">Reisen</span>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <BoardingPassCard />
      </div>

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
        <button
          onClick={() => navigate('/onboarding/school')}
          className="w-full py-3 rounded-xl bg-primary text-white font-medium"
        >
          학교 이메일로 시작하기
        </button>
<button
  onClick={() => alert('카카오 로그인은 백엔드 연결 후 구현 예정입니다.')}
  className="w-full h-11 rounded-xl overflow-hidden"
>
  <img
    src={kakaoLoginButton}
    alt="카카오 로그인"
    className="w-full h-full object-fill"
  />
</button>
        {/* <button
          onClick={() => alert('카카오 로그인은 백엔드 연결 후 구현 예정입니다.')}
          className="w-full h-11 rounded-xl bg-[#FEE500] flex items-center justify-center gap-2"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10 3C5.582 3 2 5.83 2 9.318c0 2.24 1.482 4.207 3.716 5.33-.163.596-.591 2.166-.678 2.505-.107.418.153.412.323.3.133-.089 2.096-1.436 2.955-2.023.545.079 1.106.121 1.684.121 4.418 0 8-2.83 8-6.233C18 5.83 14.418 3 10 3Z"
              fill="black"
            />
          </svg>
          <span className="text-black/85 text-sm font-medium">카카오 로그인</span>
        </button> */}
        <p className="text-center text-xs text-slate-400 mt-2">
          이미 계정이 있어요 · <span
            onClick={() => navigate('/login')}
            className="text-slate-600 font-medium cursor-pointer"
          >
            로그인
          </span>
        </p>
      </div>
    </div>
  )
}