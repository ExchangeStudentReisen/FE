import { useQuery } from '@tanstack/react-query'
import type { UserProfile } from '../types/user'

// TODO: 백엔드 연동 시 아래 fetchMyProfile을 실제 fetch('/api/members/me')로 교체
const MOCK_MY_PROFILE: UserProfile = {
  id: 1,
  name: '김바보',
  email: 'baboo@example.com',
  gender: 'FEMALE',
  birthYear: 1997,
  dispatchCountry: 'GERMANY',
  emailVerified: true,
  schoolId: 1,
  schoolName: '경북대학교',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

async function fetchMyProfile(): Promise<UserProfile> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return MOCK_MY_PROFILE
}

export function useMyProfile() {
  return useQuery({
    queryKey: ['myProfile'],
    queryFn: fetchMyProfile,
    staleTime: 5 * 60 * 1000,
  })
}