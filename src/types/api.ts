// 백엔드 공통 응답 포맷.
// TODO: result 값이 "SUCCESS" 외에 "FAIL" 같은 다른 값도 오는지 확인 필요 (에러 응답 스펙 미확인)
export interface ApiResponse<T> {
  result: 'SUCCESS' | string
  data: T
  title: string
  message: string
}