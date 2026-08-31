// utils/cityMeta.ts (혹은 이미 있는 postDetailFormat.ts 안에)
interface CityMeta {
  cityLabel: string // 영문 도시명
  countryLabel: string // 한글 국가명
}

const CITY_META: Record<string, CityMeta> = {
  GERMANY: { cityLabel: 'Berlin', countryLabel: '독일' },
  CZECH: { cityLabel: 'Prague', countryLabel: '체코' },
  AUSTRIA: { cityLabel: 'Vienna', countryLabel: '오스트리아' },
  FRANCE: { cityLabel: 'Paris', countryLabel: '프랑스' },
  HUNGARY: { cityLabel: 'Budapest', countryLabel: '헝가리' },
  // TODO: 백엔드 enum 값 전체 목록 받아서 채우기
}

export function getCityMeta(travelCity: string): CityMeta {
  return CITY_META[travelCity] ?? { cityLabel: travelCity, countryLabel: '' }
}