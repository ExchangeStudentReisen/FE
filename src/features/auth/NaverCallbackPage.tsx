import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUserStore } from "../../hooks/useUserStore";

export function NaverCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setUser = useUserStore((s) => s.setUser);

  useEffect(() => {
    const isNewMember = searchParams.get("isNewMember") === "true";

    if (isNewMember) {
      const pendingKey = searchParams.get("pendingKey") ?? "";
      navigate("/onboarding/profile", { replace: true, state: { pendingKey } });
      return;
    }

    // 기존 회원
    const memberId = searchParams.get("memberId");
    const name = searchParams.get("name");

    if (!memberId || !name) {
      navigate("/", { replace: true });
      return;
    }

    setUser({
      id: memberId,
      nickname: name,
      school: "",
      isVerified: false,
      birthYear: 0,
      gender: "male",
      currentCountry: "",
      currentCity: "",
    });

    navigate("/feed", { replace: true });
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-slate-400 text-sm">로그인 처리 중...</p>
    </div>
  );
}
