import type { FeedItem } from '../types/feed'
import type { UserProfile } from '../types/user'

// TODO: 만 나이 / 한국 나이 기준 확정되면 수정
export function calculateAge(birthYear: number): number {
  return new Date().getFullYear() - birthYear
}

export function isEligibleForPost(user: UserProfile, post: FeedItem): boolean {
  const genderOk = post.gender === null || post.gender === 'OTHER' || post.gender === user.gender
  const age = calculateAge(user.birthYear)
  const ageOk = age >= post.startAge && age <= post.endAge
  return genderOk && ageOk
}