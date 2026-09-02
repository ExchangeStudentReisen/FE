// 본문 40자 제한 +말줄임
export function truncateContent(content: string, maxLength = 40): string {
  if (content.length <= maxLength) return content
  return content.slice(0, maxLength) + '...'
}

// "6.04-6.05" 형태의 날짜 범위
export function formatDateRange(startDate: string, endDate: string): string {
  const format = (d: string) => {
    const [, month, day] = d.split('-')
    return `${Number(month)}.${day}`
  }
  return `${format(startDate)}-${format(endDate)}`
}

// "15분 전", "3시간 전" 형태의 상대 시간 (updatedAt 기준)
export function formatRelativeTime(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime()
  const diffMin = Math.floor(diffMs / 1000 / 60)

  if (diffMin < 1) return '방금 전'
  if (diffMin < 60) return `${diffMin}분 전`
  const diffHour = Math.floor(diffMin / 60)
  if (diffHour < 24) return `${diffHour}시간 전`
  const diffDay = Math.floor(diffHour / 24)
  return `${diffDay}일 전`
}