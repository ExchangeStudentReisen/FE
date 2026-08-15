export interface PostDetailItinerary {
  date: string        // '6.04 (목)'
  timeLabel: string    // '오후 5시 도착'
  description: string  // '카를교 야경 · 구시가 광장 저녁'
}

export interface PostDetail {
  id: string
  imageUrl: string
  location: string       // 'Prague · Charles Bridge · dusk'
  flag: string
  city: string
  title: string
  isVerified: boolean
  ddayLabel: string       // '2일 후 만료'
  interestedCount: number // 4 관심중

  author: {
    id: string
    name: string
    gender: string
    age: number
    school: string
    isSchoolVerified: boolean
    profileImageUrl?: string
  }

  dateRangeLabel: string // '6월 4일 - 6월 5일 (1박 2일)'
  itinerary: PostDetailItinerary[]

  recruit: {
    gender: string   // '여성만'
    ageRange: string // '20 - 23세'
  }

  kakaoOpenChatUrl: string // 'https://open.kakao.com/o/g/prg604'

  isLiked: boolean
}