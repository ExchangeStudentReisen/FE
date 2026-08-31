import type { FeedFilters, FeedItem, FeedPageResult } from '../types/feed'

const ALL_ITEMS: FeedItem[] = [
  {
    id: 1,
    title: '프라하 같이 다니실 여성분 구해요',
    content: '프라하 처음이라 같이 다니실 분! 일정 일부만 겹쳐도 OK',
    startAge: 20,
    endAge: 25,
    gender: 'FEMALE',
    startDate: '2026-06-04',
    endDate: '2026-06-05',
    travelCity: 'CZECH', // TODO: 실제 백엔드 enum 값으로 교체
    isRecruiting: true,
    view: 40,
    clickCnt: 40,
    updatedAt: new Date(Date.now() - 15 * 60_000).toISOString(),
    category: 'prague',
    month: '6월',
  },
  {
    id: 2,
    title: '빈 — 부다페스트 같이 도실 분?',
    content: '빈 2일 + 부다 1일. 클래식 공연 같이 가실 분 우대!',
    startAge: 22,
    endAge: 27,
    gender: 'MALE',
    startDate: '2026-06-11',
    endDate: '2026-06-13',
    travelCity: 'AUSTRIA',
    isRecruiting: true,
    view: 55,
    clickCnt: 55,
    updatedAt: new Date(Date.now() - 60 * 60_000).toISOString(),
    category: 'vienna',
    month: '6월',
  },
  {
    id: 3,
    title: '파리에서 같이 미술관 보실 분',
    content: '루브르, 오르세 같이 도실 분 구합니다. 미술 전공이면 더 좋아요.',
    startAge: 20,
    endAge: 24,
    gender: 'FEMALE',
    startDate: '2026-06-20',
    endDate: '2026-06-22',
    travelCity: 'FRANCE',
    isRecruiting: true,
    view: 30,
    clickCnt: 30,
    updatedAt: new Date(Date.now() - 3 * 60 * 60_000).toISOString(),
    category: 'paris',
    month: '6월',
  },
  {
    id: 4,
    title: '부다 당일치기 — 세체니 온천 ㄱ?',
    content: '부다페스트 당일치기 온천 같이 가실 분 구해요. 오전 출발 예정.',
    startAge: 21,
    endAge: 26,
    gender: 'MALE',
    startDate: '2026-06-07',
    endDate: '2026-06-08',
    travelCity: 'HUNGARY',
    isRecruiting: true,
    view: 18,
    clickCnt: 18,
    updatedAt: new Date(Date.now() - 5 * 60 * 60_000).toISOString(),
    category: 'budapest',
    month: '6월',
  },
    {
    id: 5,
    title: '뮌헨 옥토버페스트 같이 즐기실 분',
    content: '맥주 축제 기간에 같이 다닐 분 구해요. 숙소는 각자, 낮에만 같이 다녀도 좋아요. 독일어 몰라도 상관없어요.', // 40자 초과 - truncate 테스트
    startAge: 22,
    endAge: 28,
    gender: 'MALE',
    startDate: '2026-09-19',
    endDate: '2026-09-21',
    travelCity: 'GERMANY',
    isRecruiting: true,
    view: 72,
    clickCnt: 72,
    updatedAt: new Date(Date.now() - 30 * 60_000).toISOString(),
    category: 'munich',
    month: '9월',
  },
  {
    id: 6,
    title: '로마 콜로세움 같이 도실 분 구해요',
    content: '역사 좋아하시는 분이면 더 좋아요',
    startAge: 20,
    endAge: 26,
    gender: null, // 성별 무관 테스트
    startDate: '2026-07-02',
    endDate: '2026-07-04',
    travelCity: 'ITALY',
    isRecruiting: true,
    view: 15,
    clickCnt: 15,
    updatedAt: new Date(Date.now() - 2 * 60_000).toISOString(), // 방금 전 테스트
    category: 'rome',
    month: '7월',
  },
  {
    id: 7,
    title: '암스테르담 운하 투어 동행',
    content: '자전거 대여해서 같이 돌아다닐 분',
    startAge: 21,
    endAge: 27,
    gender: 'OTHER', // 전체 처리 테스트
    startDate: '2026-06-15',
    endDate: '2026-06-16',
    travelCity: 'NETHERLANDS',
    isRecruiting: false, // 마감된 글 테스트
    view: 120,
    clickCnt: 120,
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60_000).toISOString(), // 2일 전 테스트
    category: 'amsterdam',
    month: '6월',
  },
  {
    id: 8,
    title: '바르셀로나 사그라다 파밀리아 같이 보실 분 있나요 진짜 급함',
    content: '가우디 건축 투어 같이 다니실 분 구해요. 사그라다 파밀리아, 구엘공원, 까사바트요까지 하루에 다 돌 예정입니다.',
    startAge: 20,
    endAge: 25,
    gender: 'FEMALE',
    startDate: '2026-08-01',
    endDate: '2026-08-03',
    travelCity: 'SPAIN',
    isRecruiting: true,
    view: 8,
    clickCnt: 8,
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60_000).toISOString(), // 오래된 글 테스트
    category: 'barcelona',
    month: '8월',
  },
  {
    id: 9,
    title: '런던 웨스트엔드 뮤지컬 같이 보실 분',
    content: '위키드나 라이온킹 같이 보러 가실 분',
    startAge: 23,
    endAge: 29,
    gender: 'MALE',
    startDate: '2026-06-25',
    endDate: '2026-06-26',
    travelCity: 'UK',
    isRecruiting: true,
    view: 45,
    clickCnt: 45,
    updatedAt: new Date(Date.now() - 6 * 60 * 60_000).toISOString(),
    category: 'london',
    month: '6월',
  },
  {
    id: 10,
    title: '크라쿠프 아우슈비츠 투어 동행',
    content: '진지한 역사 탐방 목적이라 조용히 다니실 분 우대',
    startAge: 22,
    endAge: 30,
    gender: null,
    startDate: '2026-06-18',
    endDate: '2026-06-18',
    travelCity: 'POLAND',
    isRecruiting: true,
    view: 3,
    clickCnt: 3, // 조회수 0에 가까운 케이스 테스트
    updatedAt: new Date(Date.now() - 12 * 60 * 60_000).toISOString(),
    category: 'krakow',
    month: '6월',
  },
]

const PAGE_SIZE = 10

export async function fetchFeed(pageParam: number, filters: FeedFilters): Promise<FeedPageResult> {
  await new Promise((resolve) => setTimeout(resolve, 400))

  let filtered = ALL_ITEMS

  if (filters.category !== 'all') {
    filtered = filtered.filter((item) => item.category === filters.category)
  }
  if (filters.month !== '전체') {
    filtered = filtered.filter((item) => item.month === filters.month)
  }
  if (filters.keyword.trim()) {
    const keyword = filters.keyword.trim().toLowerCase()
    filtered = filtered.filter((item) => item.title.toLowerCase().includes(keyword))
  }

  filtered = [...filtered].sort((a, b) =>
    filters.sort === 'latest'
      ? new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      : b.clickCnt - a.clickCnt
  )

  const start = pageParam * PAGE_SIZE
  const items = filtered.slice(start, start + PAGE_SIZE)
  const nextPage = start + PAGE_SIZE < filtered.length ? pageParam + 1 : null

  return { items, nextPage }
}