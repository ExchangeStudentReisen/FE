interface CityMeta {
  cityLabel: string // 영문 도시명
  countryLabel: string // 한글 국가명
}

// TODO: cityLabel은 국가 대표 도시(주로 수도)로 임의 지정한 값 — travelCity가 국가 단위 enum이라
// 실제 게시글의 세부 도시와 다를 수 있음. 도시 단위 데이터가 필요하면 백엔드에 별도 필드 요청 필요
const CITY_META: Record<string, CityMeta> = {
  GERMANY: { cityLabel: 'Berlin', countryLabel: '독일' },
  FRANCE: { cityLabel: 'Paris', countryLabel: '프랑스' },
  UNITED_KINGDOM: { cityLabel: 'London', countryLabel: '영국' },
  NETHERLANDS: { cityLabel: 'Amsterdam', countryLabel: '네덜란드' },
  SPAIN: { cityLabel: 'Madrid', countryLabel: '스페인' },
  ITALY: { cityLabel: 'Rome', countryLabel: '이탈리아' },
  SWEDEN: { cityLabel: 'Stockholm', countryLabel: '스웨덴' },
  DENMARK: { cityLabel: 'Copenhagen', countryLabel: '덴마크' },
  NORWAY: { cityLabel: 'Oslo', countryLabel: '노르웨이' },
  FINLAND: { cityLabel: 'Helsinki', countryLabel: '핀란드' },
  AUSTRIA: { cityLabel: 'Vienna', countryLabel: '오스트리아' },
  SWITZERLAND: { cityLabel: 'Zurich', countryLabel: '스위스' },
  SINGAPORE: { cityLabel: 'Singapore', countryLabel: '싱가포르' },
  CZECH_REPUBLIC: { cityLabel: 'Prague', countryLabel: '체코' },
  POLAND: { cityLabel: 'Warsaw', countryLabel: '폴란드' },
  HUNGARY: { cityLabel: 'Budapest', countryLabel: '헝가리' },
  PORTUGAL: { cityLabel: 'Lisbon', countryLabel: '포르투갈' },
  BELGIUM: { cityLabel: 'Brussels', countryLabel: '벨기에' },
}

export function getCityMeta(travelCity: string): CityMeta {
  return CITY_META[travelCity] ?? { cityLabel: travelCity, countryLabel: '' }
}

export function getCountryOptions(): { value: string; label: string }[] {
  return Object.entries(CITY_META).map(([value, meta]) => ({
    value,
    label: meta.countryLabel,
  }))
}