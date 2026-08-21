import { useNavigate } from "react-router-dom";
import { BoardingPassCard } from "./BoardingPassCard";

export function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className='flex flex-col min-h-screen p-6 pb-12 bg-linear-to-b from-primary-light to-white'>
      <div className='flex items-center gap-2'>
        <div className='w-7 h-7 rounded-lg bg-primary flex items-center justify-center'>
          <span className='text-white text-sm font-bold'>R</span>
        </div>
        <span className='text-primary font-bold text-lg'>Reisen</span>
      </div>
      <div className='flex-1 flex items-center justify-center'>
        <BoardingPassCard />
      </div>

      <div className='mb-8'>
        <p className='text-xs font-semibold text-primary mb-2'>
          FOR EXCHANGE STUDENTS
        </p>
        <h1 className='text-2xl font-bold text-slate-900 leading-snug'>
          교환학생끼리,
          <br />
          같은 일정을 만나요.
        </h1>
        <p className='text-sm text-slate-500 mt-2'>
          학교 인증된 친구들과 안전하게 유럽 여행 동행을 구하세요.
        </p>
      </div>

      <div className='flex flex-col gap-2'>
        <button
          onClick={() => navigate("/onboarding/school")}
          className='w-full py-3 rounded-xl bg-primary text-white font-medium'
        >
          학교 이메일로 시작하기
        </button>
        <button
          onClick={() => {
            console.log("hi");
            window.location.href = "http://localhost:8080/api/auth/naver";
          }}
          className='w-full h-11 rounded-xl bg-[#03C75A] flex items-center justify-center gap-2'
        >
          <span
            className='text-white font-black text-base leading-none'
            style={{ fontFamily: "Arial Black, sans-serif" }}
          >
            N
          </span>
          <span className='text-white text-sm font-bold'>네이버로 로그인</span>
        </button>
      </div>
    </div>
  );
}
