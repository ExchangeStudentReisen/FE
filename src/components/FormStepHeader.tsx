import { X, ChevronLeft } from 'lucide-react'

interface FormStepHeaderProps {
  step: 1 | 2 | 3
  totalSteps?: number
  onBack: () => void
}

export function FormStepHeader({
  step,
  totalSteps = 3,
  onBack,
}: FormStepHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-white px-4 pt-3">
      <div className="flex items-center h-9">
        <button
          type="button"
          onClick={onBack}
          aria-label={step === 1 ? '닫기' : '뒤로가기'}
          className="p-1 -ml-1 cursor-pointer text-slate-700"
        >
          {step === 1 ? <X size={22} /> : <ChevronLeft size={22} />}
        </button>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
        <span className="text-xs text-slate-400 shrink-0">{step} / {totalSteps}</span>
      </div>
    </div>
  )
}