import { fetchApi } from './client'
import type { ApiResponse } from '../types/api'
import type {
  ChatLinkApiData,
  CreatePostRequest,
  CreatePostResponseData,
  PostDetailResponse,
} from '../types/post'
import type { FeedFilters, FeedListData } from '../types/feed'

export function createPost(payload: CreatePostRequest) {
  return fetchApi<ApiResponse<CreatePostResponseData>>('/api/posts', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  })
}

// keyword/sort는 백엔드 쿼리 파라미터에 없음 — 호출부(useInfiniteFeed)에서 프론트 필터로 처리
export function getPosts(filters: FeedFilters, page: number, size = 10) {
  const params = new URLSearchParams()
  if (filters.travelCity) params.set('travelCity', filters.travelCity)
  if (filters.gender) params.set('gender', filters.gender)
  if (filters.startAge !== undefined) params.set('startAge', String(filters.startAge))
  if (filters.endAge !== undefined) params.set('endAge', String(filters.endAge))
  if (filters.startDate) params.set('startDate', filters.startDate)
  if (filters.endDate) params.set('endDate', filters.endDate)
  params.set('page', String(page))
  params.set('size', String(size))

  return fetchApi<ApiResponse<FeedListData>>(`/api/posts?${params.toString()}`)
}

export function getPostDetail(id: string | number) {
  return fetchApi<PostDetailResponse>(`/api/posts/${id}`)
}

// 응답 필드셋이 GET /api/posts와 동일해 FeedListData/FeedItem을 그대로 재사용함
export function getMyPosts(memberId: number, page: number, size = 10) {
  const params = new URLSearchParams({
    memberId: String(memberId),
    page: String(page),
    size: String(size),
  })
  return fetchApi<ApiResponse<FeedListData>>(`/api/posts/me?${params.toString()}`)
}

// 모집 조건(성별·나이·여행지) 충족 여부는 서버가 검증함 — 불충족 시 에러 응답
export function getChatLink(postId: string | number, memberId: number) {
  return fetchApi<ApiResponse<ChatLinkApiData>>(
    `/api/posts/${postId}/kakaotalk-link?memberId=${memberId}`,
  )
}
