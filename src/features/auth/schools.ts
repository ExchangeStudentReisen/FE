export interface School {
  id: string
  name: string
  domain: string
}

// TODO: 실제 서비스에서는 서버에서 학교 목록을 받아오거나, 더 많은 학교 추가 필요
export const SCHOOLS: School[] = [
  { id: 'yonsei', name: '연세대학교', domain: 'yonsei.ac.kr' },
  { id: 'korea', name: '고려대학교', domain: 'korea.ac.kr' },
  { id: 'ewha', name: '이화여자대학교', domain: 'ewha.ac.kr' },
  { id: 'hanyang', name: '한양대학교', domain: 'hanyang.ac.kr' },
]