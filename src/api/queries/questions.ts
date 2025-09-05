import { computed } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { useCurrentCampQuery } from '@/api/queries/camps'
import { apiClient } from '@/api/apiClient'
import { queryKeys } from '@/api/query-keys'
import type { components } from '@/api/schema'
type QuestionGroup = components['schemas']['QuestionGroupResponse']
type PostQuestionGroupRequest = components['schemas']['PostQuestionGroupRequest']
type PutQuestionGroupRequest = components['schemas']['PutQuestionGroupRequest']
type Question = components['schemas']['QuestionResponse']
type PostQuestionRequest = components['schemas']['PostQuestionRequest']
type PutQuestionRequest = components['schemas']['PutQuestionRequest']

const fetchQuestionGroups = async (campId: number): Promise<QuestionGroup[]> => {
  const { data, error } = await apiClient.GET('/api/camps/{campId}/question-groups', {
    params: { path: { campId } },
  })
  if (error) throw error
  return data
}

const createQuestionGroup = async (variables: {
  campId: number
  newQuestionGroup: PostQuestionGroupRequest
}): Promise<QuestionGroup> => {
  const { campId, newQuestionGroup } = variables
  const { data, error } = await apiClient.POST('/api/admin/camps/{campId}/question-groups', {
    params: { path: { campId } },
    body: newQuestionGroup,
  })
  if (error) throw error
  return data
}

const updateQuestionGroup = async (variables: {
  questionGroupId: number
  updatedQuestionGroup: PutQuestionGroupRequest
}): Promise<QuestionGroup> => {
  const { questionGroupId, updatedQuestionGroup } = variables
  const { data, error } = await apiClient.PUT('/api/admin/question-groups/{questionGroupId}', {
    params: { path: { questionGroupId } },
    body: updatedQuestionGroup,
  })
  if (error) throw error
  return data
}

const deleteQuestionGroup = async (variables: { questionGroupId: number }): Promise<void> => {
  const { questionGroupId } = variables
  const { data, error } = await apiClient.DELETE('/api/admin/question-groups/{questionGroupId}', {
    params: { path: { questionGroupId } },
  })
  if (error) throw error
  return data
}

const createQuestion = async (variables: {
  questionGroupId: number
  newQuestion: PostQuestionRequest
}): Promise<Question> => {
  const { questionGroupId, newQuestion } = variables
  const { data, error } = await apiClient.POST(
    '/api/admin/question-groups/{questionGroupId}/questions',
    {
      params: { path: { questionGroupId } },
      body: newQuestion,
    },
  )
  if (error) throw error
  return data
}

const updateQuestion = async (variables: {
  questionId: number
  updatedQuestion: PutQuestionRequest
}): Promise<Question> => {
  const { questionId, updatedQuestion } = variables
  const { data, error } = await apiClient.PUT('/api/admin/questions/{questionId}', {
    params: { path: { questionId } },
    body: updatedQuestion,
  })
  if (error) throw error
  return data
}

const deleteQuestion = async (variables: { questionId: number }): Promise<void> => {
  const { questionId } = variables
  const { data, error } = await apiClient.DELETE('/api/admin/questions/{questionId}', {
    params: { path: { questionId } },
  })
  if (error) throw error
  return data
}

export const useQuestionGroupsQuery = () => {
  const { data: camp } = useCurrentCampQuery()
  const campId = computed(() => camp.value?.id)
  return useQuery({
    queryKey: queryKeys.questionGroups.all(campId.value),
    queryFn: () => fetchQuestionGroups(campId.value!),
    enabled: computed(() => campId.value !== undefined),
  })
}

export const useCreateQuestionGroupMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createQuestionGroup,
    onSuccess: (data, variables) => {
      const { campId } = variables
      queryClient.setQueryData<QuestionGroup[]>(queryKeys.questionGroups.all(campId), (old) =>
        old ? [...old, data] : [data],
      )
    },
  })
}

export const useUpdateQuestionGroupMutation = () => {
  const { data: camp } = useCurrentCampQuery()
  const campId = computed(() => camp.value?.id)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateQuestionGroup,
    onSuccess: (data) => {
      queryClient.setQueryData<QuestionGroup[]>(queryKeys.questionGroups.all(campId.value), (old) =>
        old?.map((group) => (group.id === data.id ? data : group)),
      )
    },
  })
}

export const useDeleteQuestionGroupMutation = () => {
  const { data: camp } = useCurrentCampQuery()
  const campId = computed(() => camp.value?.id)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteQuestionGroup,
    onSuccess: (_data, variables) => {
      const { questionGroupId } = variables
      queryClient.setQueryData<QuestionGroup[]>(queryKeys.questionGroups.all(campId.value), (old) =>
        old?.filter((group) => group.id !== questionGroupId),
      )
    },
  })
}

export const useCreateQuestionMutation = () => {
  const { data: camp } = useCurrentCampQuery()
  const campId = computed(() => camp.value?.id)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createQuestion,
    onSuccess: (data, variables) => {
      const { questionGroupId } = variables
      queryClient.setQueryData<QuestionGroup[]>(
        queryKeys.questionGroups.all(campId.value),
        (old) =>
          old
            ? old.map((group) =>
                group.id === questionGroupId
                  ? { ...group, questions: [...group.questions, data] }
                  : group,
              )
            : [],
      )
    },
  })
}

export const useUpdateQuestionMutation = () => {
  const { data: camp } = useCurrentCampQuery()
  const campId = computed(() => camp.value?.id)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.questionGroups.all(campId.value) })
    },
  })
}

export const useDeleteQuestionMutation = () => {
  const { data: camp } = useCurrentCampQuery()
  const campId = computed(() => camp.value?.id)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteQuestion,
    onSuccess: (_data, variables) => {
      const { questionId } = variables
      queryClient.setQueryData<QuestionGroup[]>(queryKeys.questionGroups.all(campId.value), (old) =>
        old?.map((group) => ({
          ...group,
          questions: group.questions.filter((question) => question.id !== questionId),
        })),
      )
    },
  })
}
