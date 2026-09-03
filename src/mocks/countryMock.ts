// TODO: 백엔드 국가/도시 enum 정해지면 교체
export interface CityOption {
  code: string
  name: string
}

export interface CountryOption {
  code: string
  name: string
  flag: string
  cities: CityOption[]
}

export const COUNTRY_OPTIONS: CountryOption[] = [
  { code: 'CZ', name: '체코', flag: '🇨🇿', cities: [{ code: 'PRAGUE', name: '프라하' }] },
  { code: 'FR', name: '프랑스', flag: '🇫🇷', cities: [{ code: 'PARIS', name: '파리' }] },
  { code: 'AT', name: '오스트리아', flag: '🇦🇹', cities: [{ code: 'VIENNA', name: '빈' }] },
  { code: 'HU', name: '헝가리', flag: '🇭🇺', cities: [{ code: 'BUDAPEST', name: '부다페스트' }] },
]

// TODO: 실제로는 유저 최근 선택 기록(로컬스토리지 or 서버)에서 가져와야 함
export const RECENT_COUNTRY_CODES = ['FR', 'AT', 'HU']