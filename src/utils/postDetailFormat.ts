import type { PostRecruitGender } from '../types/post'
import { calculateAge } from './eligibility'

const GENDER_LABEL: Record<PostRecruitGender, string> = {
  FEMALE: '여성만',
  MALE: '남성만',
  OTHER: '성별무관',
}

export function getGenderLabel(gender: PostRecruitGender | null) {
  if (!gender) return '성별무관'
  return GENDER_LABEL[gender] ?? gender
}

export function formatAgeRange(startAge: number, endAge: number) {
  return `${startAge} - ${endAge}세`
}

export function formatDateRange(startDate: string, endDate: string) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const nights = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

  const fmt = (d: Date) => `${d.getMonth() + 1}월 ${d.getDate()}일`

  if (nights <= 0) {
    return `${fmt(start)} (당일치기)`
  }
  return `${fmt(start)} - ${fmt(end)} (${nights}박 ${nights + 1}일)`
}

export function formatUpdatedDate(updatedAt: string): string {
  const date = new Date(updatedAt)
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}.${mm}.${dd}`
}

export function formatAgeFromBirthYear(birthYear: number): number {
  return calculateAge(birthYear)
}