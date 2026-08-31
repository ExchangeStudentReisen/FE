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
      const pendingKey = searchParams.get("pendingKey");
      if (!pendingKey) {
        navigate("/", { replace: true });
        return;
      }
      navigate("/onboarding/school", { replace: true, state: { pendingKey } });
      return;
    }

    // 기존 회원 — 세션은 이미 심어져 있으니 내 정보를 조회해서 스토어를 채운다
    const memberId = searchParams.get("memberId");
    if (!memberId) {
      navigate("/", { replace: true });
      return;
    }

    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((body) => {
        const member = body.data;
        if (!member) {
          navigate("/", { replace: true });
          return;
        }
        setUser({
          id: String(member.id),
          nickname: member.name,
          school: member.schoolName ?? "",
          isVerified: member.emailVerified,
          birthYear: member.birthYear ?? 0,
          gender: member.gender === "FEMALE" ? "female" : "male",
          currentCountry: member.dispatchCountry ?? "",
          currentCity: "",
        });
        navigate("/feed", { replace: true });
      })
      .catch(() => navigate("/", { replace: true }));
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-slate-400 text-sm">로그인 처리 중...</p>
    </div>
  );
}
