import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUserStore } from "../../hooks/useUserStore";

type Gender = "MALE" | "FEMALE" | "OTHER";

interface PendingProfile {
  nickname: string;
  gender: Gender | null;
  birthYear: number | null;
}

interface School {
  id: number;
  name: string;
  emailDomain: string;
}

const COUNTRIES: Record<string, string> = {
  GERMANY: "독일",
  FRANCE: "프랑스",
  JAPAN: "일본",
  UNITED_STATES: "미국",
  UNITED_KINGDOM: "영국",
  NETHERLANDS: "네덜란드",
  SPAIN: "스페인",
  ITALY: "이탈리아",
  SWEDEN: "스웨덴",
  DENMARK: "덴마크",
  NORWAY: "노르웨이",
  FINLAND: "핀란드",
  AUSTRIA: "오스트리아",
  SWITZERLAND: "스위스",
  AUSTRALIA: "호주",
  CANADA: "캐나다",
  CHINA: "중국",
  SOUTH_KOREA: "한국",
  SINGAPORE: "싱가포르",
  CZECH_REPUBLIC: "체코",
  POLAND: "폴란드",
  HUNGARY: "헝가리",
  PORTUGAL: "포르투갈",
  BELGIUM: "벨기에",
  NEW_ZEALAND: "뉴질랜드",
};

const GENDER_LABEL: Record<Gender, string> = {
  MALE: "남성",
  FEMALE: "여성",
  OTHER: "기타",
};

const schema = z.object({
  name: z.string().min(1, "이름을 입력해주세요."),
  dispatchCountry: z.string().min(1, "파견 국가를 선택해주세요."),
  schoolId: z.string().min(1, "학교를 선택해주세요."),
});

type FormValues = z.infer<typeof schema>;

export function ProfileSetupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const pendingKey: string = (location.state as { pendingKey?: string })?.pendingKey ?? "";

  const setUser = useUserStore((s) => s.setUser);

  const [pending, setPending] = useState<PendingProfile | null>(null);
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (!pendingKey) {
      navigate("/", { replace: true });
      return;
    }

    Promise.all([
      fetch(`/api/auth/pending?key=${encodeURIComponent(pendingKey)}`, {
        credentials: "include",
      }).then((r) => r.json()),
      fetch("/api/schools", { credentials: "include" }).then((r) => r.json()),
    ])
      .then(([pendingRes, schoolsRes]) => {
        if (!pendingRes.data) {
          navigate("/", { replace: true });
          return;
        }
        setPending(pendingRes.data);
        setValue("name", pendingRes.data.nickname);
        if (schoolsRes.data) setSchools(schoolsRes.data);
      })
      .catch(() => navigate("/", { replace: true }))
      .finally(() => setLoading(false));
  }, []);

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          pendingKey,
          name: values.name,
          dispatchCountry: values.dispatchCountry,
          schoolId: Number(values.schoolId),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "회원가입에 실패했습니다.");
        return;
      }
      const member = data.data;
      setUser({
        id: String(member.id),
        nickname: member.name,
        school: member.schoolName ?? "",
        isVerified: member.emailVerified,
        birthYear: member.birthYear ?? 0,
        gender: member.gender === "FEMALE" ? "female" : "male",
        currentCountry: COUNTRIES[member.dispatchCountry] ?? member.dispatchCountry ?? "",
        currentCity: "",
      });
      navigate("/feed", { replace: true });
    } catch {
      setError("서버 연결에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-400 text-sm">불러오는 중...</p>
      </div>
    );
  }

  const initial = pending?.nickname?.[0]?.toUpperCase() ?? "?";

  return (
    <div className="min-h-screen px-6 py-7 bg-white">
      {/* 헤더 */}
      <div className="mb-7">
        <div className="flex items-center justify-between mb-3">
          <div className="w-9" />
          <span className="text-sm font-medium text-slate-900">프로필 설정</span>
          <span className="text-xs text-slate-400 w-9 text-right">3 / 3</span>
        </div>
        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full w-full transition-all duration-300" />
        </div>
      </div>

      {/* 아바타 */}
      <div className="flex justify-center mb-5">
        <div className="w-20 h-20 rounded-full bg-primary-light flex items-center justify-center">
          <span className="text-3xl font-bold text-primary">{initial}</span>
        </div>
      </div>

      <h1 className="text-xl font-bold text-slate-900 text-center leading-snug mb-1">
        간단한 프로필을 만들어요
      </h1>
      <p className="text-sm text-slate-500 text-center mb-7 leading-relaxed">
        학교는 항상 공개돼요. 나머지는 필터 기준이에요.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* 이름 (닉네임) */}
        <div>
          <label className="text-sm text-slate-500 block mb-1.5">이름 (닉네임)</label>
          <input
            {...register("name")}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-primary"
            placeholder="닉네임을 입력해주세요"
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* 성별 — 비활성 */}
        <div>
          <label className="text-sm text-slate-500 block mb-1.5">성별</label>
          <input
            className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-sm text-slate-400 cursor-not-allowed"
            value={pending?.gender ? GENDER_LABEL[pending.gender] : "네이버에서 제공하지 않음"}
            disabled
            readOnly
          />
          <p className="text-xs text-slate-400 mt-1">네이버 계정 정보에서 자동으로 가져옵니다.</p>
        </div>

        {/* 출생연도 — 비활성 */}
        <div>
          <label className="text-sm text-slate-500 block mb-1.5">출생연도</label>
          <input
            className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-sm text-slate-400 cursor-not-allowed"
            value={pending?.birthYear ?? "네이버에서 제공하지 않음"}
            disabled
            readOnly
          />
          <p className="text-xs text-slate-400 mt-1">네이버 계정 정보에서 자동으로 가져옵니다.</p>
        </div>

        {/* 학교 */}
        <div>
          <label className="text-sm text-slate-500 block mb-1.5">학교</label>
          <select
            {...register("schoolId")}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white outline-none focus:border-primary"
          >
            <option value="">학교를 선택해주세요</option>
            {schools.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          {errors.schoolId && (
            <p className="text-xs text-red-500 mt-1">{errors.schoolId.message}</p>
          )}
        </div>

        {/* 현재 파견 국가 */}
        <div>
          <label className="text-sm text-slate-500 block mb-1.5">현재 파견 국가</label>
          <select
            {...register("dispatchCountry")}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white outline-none focus:border-primary"
          >
            <option value="">국가를 선택해주세요</option>
            {Object.entries(COUNTRIES).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
          {errors.dispatchCountry && (
            <p className="text-xs text-red-500 mt-1">{errors.dispatchCountry.message}</p>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-500 text-center bg-red-50 rounded-xl px-4 py-2.5">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full h-12 rounded-xl bg-primary text-white font-medium mt-2 disabled:opacity-50 transition-opacity"
        >
          {submitting ? "처리 중..." : "회원가입 완료"}
        </button>
      </form>
    </div>
  );
}
