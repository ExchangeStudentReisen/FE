import { useQuery, useMutation } from '@tanstack/react-query'
import { getSchools, reportDomain } from '../api/schools'
import type { DomainReportPayload } from '../types/school'

export function useSchools() {
  return useQuery({
    queryKey: ['schools'],
    queryFn: getSchools,
  })
}

export function useReportDomain() {
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: DomainReportPayload }) =>
      reportDomain(id, payload),
  })
}