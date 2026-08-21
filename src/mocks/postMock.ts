import type { ApiResponse } from '../types/api'
import type { CreatePostRequest, CreatePostResponseData } from '../types/post'

// TODO: 백엔드 붙으면 실제 axios/fetch 호출로 교체
export async function createPost(
  payload: CreatePostRequest
): Promise<ApiResponse<CreatePostResponseData>> {
  await new Promise((r) => setTimeout(r, 400))
  console.log('[mock] createPost payload:', payload)

  const now = new Date().toISOString()

  return {
    result: 'SUCCESS',
    data: {
      id: Date.now(),
      authorId: payload.authorId,
      authorName: '목데이터유저', // TODO: 실제로는 로그인 유저 닉네임
      title: payload.title,
      content: payload.content,
      kakaotalkLink: payload.kakaotalkLink,
      maxMembers: payload.maxMembers,
      startAge: payload.startAge,
      endAge: payload.endAge,
      gender: payload.gender,
      startDate: payload.startDate,
      endDate: payload.endDate,
      tripCity: payload.tripCity,
      isRecruiting: true,
      view: 0,
      clickCnt: 0,
      createdAt: now,
      updatedAt: now,
    },
    title: '',
    message: '게시글이 등록되었어요',
  }
}