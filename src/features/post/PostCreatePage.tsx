import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { postCreateSchema, STEP_FIELDS, type PostCreateFormValues } from '../../schemas/postCreateSchema'
import { RECRUIT_GENDER_TO_API, type CreatePostRequest } from '../../types/post'
import { FormStepHeader } from '../../components/FormStepHeader.tsx'
import { Step1CityDate } from './Step1CityDate'
import { Step2RecruitInfo } from './Step2RecruitInfo.tsx'
import { Step3IntroLink } from './Step3IntroLink'
import { createPost } from '../../mocks/postMock' // TODO: 백엔드 붙으면 실제 API 함수로 교체

const TOTAL_STEPS = 3
const CURRENT_USER_ID = 1 // TODO: 로그인 붙으면 auth store에서 가져오기

export function PostCreatePage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<1 | 2 | 3>(1)

  const methods = useForm<PostCreateFormValues>({
    resolver: zodResolver(postCreateSchema),
    mode: 'onChange',
    defaultValues: {
      country: '', city: '', startDate: '', endDate: '',
      recruitGender: 'any', minAge: 20, maxAge: 23, headcount: 1, travelStyles: [],
      title: '', content: '', kakaoOpenChatUrl: '',
    },
  })

  const { trigger, handleSubmit } = methods

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: CreatePostRequest) => createPost(payload),
    onSuccess: (res) => {
      // TODO: result !== 'SUCCESS' 케이스(실패 응답) 핸들링 필요 — 백엔드 에러 스펙 확인 후 추가
      navigate(`/posts/${res.data.id}`)
    },
  })

  const goBack = () => {
    if (step === 1) { navigate(-1); return }
    setStep((prev) => (prev - 1) as 1 | 2 | 3)
  }

  const goNext = async () => {
    const valid = await trigger(STEP_FIELDS[step])
    if (valid) setStep((prev) => (prev + 1) as 1 | 2 | 3)
  }

  const onSubmit = (values: PostCreateFormValues) => {
    mutate({
      authorId: CURRENT_USER_ID,
      title: values.title,
      content: values.content,
      kakaotalkLink: values.kakaoOpenChatUrl,
      maxMembers: values.headcount,
      startAge: values.minAge,
      endAge: values.maxAge,
      gender: RECRUIT_GENDER_TO_API[values.recruitGender],
      startDate: values.startDate,
      endDate: values.endDate,
      tripCity: values.city, // TODO: tripCity 스펙 확정되면 매핑 재점검
    })
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="pb-24">
        <FormStepHeader step={step} totalSteps={TOTAL_STEPS} onBack={goBack} />

        {step === 1 && <Step1CityDate />}
        {step === 2 && <Step2RecruitInfo />}
        {step === 3 && <Step3IntroLink />}

        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white px-4 py-3 border-t border-slate-100">
          {step < TOTAL_STEPS ? (
            <button type="button" onClick={goNext} className="w-full py-3 rounded-xl bg-blue-600 text-white font-medium cursor-pointer">
              다음
            </button>
          ) : (
            <button type="submit" disabled={isPending} className="w-full py-3 rounded-xl bg-blue-600 text-white font-medium cursor-pointer disabled:opacity-50">
              {isPending ? '등록 중...' : '동행 모집 시작'}
            </button>
          )}
        </div>
      </form>
    </FormProvider>
  )
}