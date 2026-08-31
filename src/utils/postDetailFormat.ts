// utils/postDetailFormat.ts
import type { RecruitGender, TripCity } from '../types/postDetail'

const CITY_META: Record<TripCity, { flag: string; label: string }> = {
  GERMANY: { flag: '🇩🇪', label: 'Germany' },
  FRANCE: { flag: '🇫🇷', label: 'France' },
  ITALY: { flag: '🇮🇹', label: 'Italy' },
  CZECH: { flag: '🇨🇿', label: 'Czech' },
  AUSTRIA: { flag: '🇦🇹', label: 'Austria' },
  SPAIN: { flag: '🇪🇸', label: 'Spain' },
}

const GENDER_LABEL: Record<RecruitGender, string> = {
  FEMALE: '여성만',
  MALE: '남성만',
}

export function getCityMeta(city: TripCity) {
  return CITY_META[city] ?? { flag: '🌍', label: city }
}

export function getGenderLabel(gender: RecruitGender) {
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