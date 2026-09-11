import type { Country } from '../types/post'

interface CountryMeta {
  flag: string
  cityLabel: string // 국가 대표 도시(영문, 주로 수도)
  countryLabel: string // 한글 국가명
}

// TODO: cityLabel은 국가 대표 도시(주로 수도)로 임의 지정한 값 — travelCity가 국가 단위 enum이라
// 실제 게시글의 세부 도시와 다를 수 있음. 도시 단위 데이터가 필요하면 백엔드 Location API 연동 필요
const COUNTRY_META: Record<Country, CountryMeta> = {
  GERMANY: { flag: '🇩🇪', cityLabel: 'Berlin', countryLabel: '독일' },
  FRANCE: { flag: '🇫🇷', cityLabel: 'Paris', countryLabel: '프랑스' },
  UNITED_KINGDOM: { flag: '🇬🇧', cityLabel: 'London', countryLabel: '영국' },
  NETHERLANDS: { flag: '🇳🇱', cityLabel: 'Amsterdam', countryLabel: '네덜란드' },
  SPAIN: { flag: '🇪🇸', cityLabel: 'Madrid', countryLabel: '스페인' },
  ITALY: { flag: '🇮🇹', cityLabel: 'Rome', countryLabel: '이탈리아' },
  SWEDEN: { flag: '🇸🇪', cityLabel: 'Stockholm', countryLabel: '스웨덴' },
  DENMARK: { flag: '🇩🇰', cityLabel: 'Copenhagen', countryLabel: '덴마크' },
  NORWAY: { flag: '🇳🇴', cityLabel: 'Oslo', countryLabel: '노르웨이' },
  FINLAND: { flag: '🇫🇮', cityLabel: 'Helsinki', countryLabel: '핀란드' },
  AUSTRIA: { flag: '🇦🇹', cityLabel: 'Vienna', countryLabel: '오스트리아' },
  SWITZERLAND: { flag: '🇨🇭', cityLabel: 'Zurich', countryLabel: '스위스' },
  SINGAPORE: { flag: '🇸🇬', cityLabel: 'Singapore', countryLabel: '싱가포르' },
  CZECH_REPUBLIC: { flag: '🇨🇿', cityLabel: 'Prague', countryLabel: '체코' },
  POLAND: { flag: '🇵🇱', cityLabel: 'Warsaw', countryLabel: '폴란드' },
  HUNGARY: { flag: '🇭🇺', cityLabel: 'Budapest', countryLabel: '헝가리' },
  PORTUGAL: { flag: '🇵🇹', cityLabel: 'Lisbon', countryLabel: '포르투갈' },
  BELGIUM: { flag: '🇧🇪', cityLabel: 'Brussels', countryLabel: '벨기에' },
  AUSTRALIA: { flag: '🇦🇺', cityLabel: 'Sydney', countryLabel: '호주' },
  NEW_ZEALAND: { flag: '🇳🇿', cityLabel: 'Auckland', countryLabel: '뉴질랜드' },
  JAPAN: { flag: '🇯🇵', cityLabel: 'Tokyo', countryLabel: '일본' },
  CANADA: { flag: '🇨🇦', cityLabel: 'Toronto', countryLabel: '캐나다' },
  CHINA: { flag: '🇨🇳', cityLabel: 'Beijing', countryLabel: '중국' },
  SOUTH_KOREA: { flag: '🇰🇷', cityLabel: 'Seoul', countryLabel: '대한민국' },
  UNITED_STATES: { flag: '🇺🇸', cityLabel: 'New York', countryLabel: '미국' },
}

export function getCityMeta(travelCity: string) {
  return COUNTRY_META[travelCity as Country] ?? { flag: '🌍', cityLabel: travelCity, countryLabel: '' }
}

export function getCountryOptions(): { value: string; label: string }[] {
  return (Object.keys(COUNTRY_META) as Country[]).map((value) => ({
    value,
    label: COUNTRY_META[value].countryLabel,
  }))
}
