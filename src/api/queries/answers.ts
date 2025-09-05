import { computed, toValue, type MaybeRef } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { apiClient } from '@/api/apiClient'
import { queryKeys } from '@/api/query-keys'
import type { components } from '@/api/schema'
type Answer = components['schemas']['AnswerResponse']
type AnswerRequest = components['schemas']['AnswerRequest']

const fetchAnswers = async (questionId: number, userId?: string): Promise<Answer[]> => {
  const { data, error } = await apiClient.GET('/api/admin/questions/{questionId}/answers', {
    params: { path: { questionId }, query: { userId } },
  })
  if (error) throw error
  return data
}

const fetchAnswersForQuestionGroup = async (
  questionGroupId: number,
  userId?: string,
): Promise<Answer[]> => {
  const { data, error } = await apiClient.GET(
    '/api/admin/question-groups/{questionGroupId}/answers',
    {
      params: { path: { questionGroupId }, query: { userId } },
    },
  )
  if (error) throw error
  return data
}

const createAnswer = async (variables: {
  userId: string
  newAnswer: AnswerRequest
}): Promise<Answer> => {
  const { userId, newAnswer } = variables
  const { data, error } = await apiClient.POST('/api/admin/users/{userId}/answers', {
    params: { path: { userId } },
    body: newAnswer,
  })
  if (error) throw error
  return data
}

const updateAnswer = async (variables: {
  answerId: number
  updatedAnswer: AnswerRequest
}): Promise<Answer> => {
  const { answerId, updatedAnswer } = variables
  const { data, error } = await apiClient.PUT('/api/admin/answers/{answerId}', {
    params: { path: { answerId } },
    body: updatedAnswer,
  })
  if (error) throw error
  return data
}

export const useAnswersQuery = (
  questionId: MaybeRef<number | undefined>,
  userId?: MaybeRef<string | undefined>,
) => {
  return useQuery({
    queryKey: queryKeys.answers.list(toValue(questionId), toValue(userId)),
    queryFn: () => fetchAnswers(toValue(questionId)!, toValue(userId)),
    enabled: computed(() => toValue(questionId) !== undefined),
  })
}

export const useAnswersForQuestionGroupQuery = (
  questionGroupId: MaybeRef<number | undefined>,
  userId?: MaybeRef<string | undefined>,
) => {
  return useQuery({
    queryKey: queryKeys.answers.group(toValue(questionGroupId), toValue(userId)),
    queryFn: () => fetchAnswersForQuestionGroup(toValue(questionGroupId)!, toValue(userId)),
    enabled: computed(() => toValue(questionGroupId) !== undefined),
  })
}

export const useCreateAnswerMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createAnswer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.answers.root })
    },
  })
}

export const useUpdateAnswerMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateAnswer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.answers.root })
    },
  })
}