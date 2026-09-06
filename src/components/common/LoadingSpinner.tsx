interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZE_MAP = {
  sm: 'w-4 h-4 border-2',
  md: 'w-10 h-10 border-4',
  lg: 'w-14 h-14 border-4',
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  return (
    <div
      className={`${SIZE_MAP[size]} border-primary-light border-t-primary rounded-full animate-spin ${className}`}
      role="status"
      aria-label="로딩 중"
    />
  )
}