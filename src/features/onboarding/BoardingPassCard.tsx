import { Plane } from "lucide-react";

interface BoardingPassCardProps {
  flightCode?: string;
  fromCode?: string;
  fromCity?: string;
  toCode?: string;
  toCity?: string;
  duration?: string;
  companionName?: string;
  companionSchool?: string;
  dateRange?: string;
}

export default function BoardingPassCard({
  flightCode = "RE · 0604",
  fromCode = "ICN",
  fromCity = "Seoul",
  toCode = "GR",
  toCity = "Frankfrut",
  duration = "direct · 11h",
  companionName = "서울 · 한국대",
  dateRange = "6.04 – 6.05",
}: BoardingPassCardProps) {
  return (
    <div className="relative mx-auto w-full max-w-xs rounded-3xl bg-white shadow-xl shadow-indigo-950/10">
      {/* notches for the ticket-stub effect */}
      <span className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[#eef1fb]" />
      <span className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[#eef1fb]" />

      <div className="px-6 pt-5 pb-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-wider text-indigo-600">
            BOARDING PASS
          </span>
          <span className="text-xs font-medium text-slate-400">{flightCode}</span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-3xl font-extrabold text-slate-900">{fromCode}</p>
            <p className="text-sm text-slate-400">{fromCity}</p>
          </div>

          <div className="flex flex-1 flex-col items-center px-3">
            <Plane className="h-4 w-4 rotate-90 text-indigo-500" />
            <div className="mt-1 h-px w-full bg-slate-200" />
            <p className="mt-1 text-[11px] text-slate-400">{duration}</p>
          </div>

          <div className="text-right">
            <p className="text-3xl font-extrabold text-slate-900">{toCode}</p>
            <p className="text-sm text-slate-400">{toCity}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-dashed border-slate-200" />

      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <p className="text-[11px] text-slate-400">동행</p>
          <p className="text-sm font-semibold text-slate-900">{companionName}</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-slate-400">날짜</p>
          <p className="text-sm font-semibold text-slate-900">{dateRange}</p>
        </div>
      </div>
    </div>
  );
}