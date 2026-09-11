import type { FeedItem } from '../types/feed'
import type { MeData } from '../types/auth'

// 한국 나이(세는나이) 기준 — 태어나자마자 1살, 매년 1/1에 +1
// TODO: 백엔드가 실제로 세는나이 기준으로 자격을 판단하는지 확인 필요
export function calculateAge(birthYear: number): number {
  return new Date().getFullYear() - birthYear + 1
}

export function isEligibleForPost(user: MeData, post: FeedItem): boolean {
  const genderOk = post.gender === null || post.gender === 'OTHER' || post.gender === user.gender
  const age = calculateAge(user.birthYear)
  const ageOk = age >= post.startAge && age <= post.endAge
  return genderOk && ageOk
}