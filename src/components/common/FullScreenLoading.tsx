import { LoadingSpinner } from './LoadingSpinner'

interface FullScreenLoadingProps {
  message?: string
}

export function FullScreenLoading({ message }: FullScreenLoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-white">
      <LoadingSpinner size="lg" />
      {message && <p className="text-sm text-slate-500">{message}</p>}
    </div>
  )
}