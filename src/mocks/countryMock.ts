import type { Country } from '../types/post'

// TODO: 도시는 아직 백엔드 enum이 없어 프론트 임의 표시용 (실제 전송값은 country만 사용)
export interface CityOption {
  code: string
  name: string
}

export interface CountryOption {
  code: Country // 백엔드 Country enum 값과 동일해야 함 (travelCity로 그대로 전송됨)
  name: string
  flag: string
  cities: CityOption[]
}

export const COUNTRY_OPTIONS: CountryOption[] = [
  { code: 'CZECH_REPUBLIC', name: '체코', flag: '🇨🇿', cities: [{ code: 'PRAGUE', name: '프라하' }] },
  { code: 'FRANCE', name: '프랑스', flag: '🇫🇷', cities: [{ code: 'PARIS', name: '파리' }] },
  { code: 'AUSTRIA', name: '오스트리아', flag: '🇦🇹', cities: [{ code: 'VIENNA', name: '빈' }] },
  { code: 'HUNGARY', name: '헝가리', flag: '🇭🇺', cities: [{ code: 'BUDAPEST', name: '부다페스트' }] },
]

// TODO: 실제로는 유저 최근 선택 기록(로컬스토리지 or 서버)에서 가져와야 함
export const RECENT_COUNTRY_CODES: Country[] = ['FRANCE', 'AUSTRIA', 'HUNGARY']