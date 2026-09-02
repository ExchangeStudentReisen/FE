// utils/postDetailFormat.ts
import type { RecruitGender, TravelCity } from '../types/postDetail'

const CITY_META: Record<TravelCity, { flag: string; label: string }> = {
  GERMANY: { flag: '🇩🇪', label: 'Germany' },
  FRANCE: { flag: '🇫🇷', label: 'France' },
  ITALY: { flag: '🇮🇹', label: 'Italy' },
  CZECH: { flag: '🇨🇿', label: 'Czech' },
  AUSTRIA: { flag: '🇦🇹', label: 'Austria' },
  SPAIN: { flag: '🇪🇸', label: 'Spain' },
}

const GENDER_LABEL: Record<'MALE' | 'FEMALE' | 'OTHER', string> = {
  FEMALE: '여성만',
  MALE: '남성만',
  OTHER: '성별무관',
}

// city는 피드 쪽에서 string으로 넘어올 수도 있어서 넓게 받음
export function getCityMeta(city: string) {
  return CITY_META[city as TravelCity] ?? { flag: '🌍', label: city }
}

// gender는 null(전체)까지 받도록 확장
export function getGenderLabel(gender: RecruitGender | 'OTHER' | null) {
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