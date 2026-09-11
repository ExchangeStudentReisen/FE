import { useMutation } from '@tanstack/react-query'
import { sendVerificationEmail, verifyCode } from '../api/verfication'

export function useSendVerification() {
  return useMutation({
    mutationFn: sendVerificationEmail,
  })
}

export function useVerifyCode() {
  return useMutation({
    mutationFn: verifyCode,
  })
}