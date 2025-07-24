import type { components } from '@/api/schema'
type FreeTextQuestion = components['schemas']['FreeTextQuestionResponse']
type FreeNumberQuestion = components['schemas']['FreeNumberQuestionResponse']
type SingleChoiceQuestion = components['schemas']['SingleChoiceQuestionResponse']
type MultipleChoiceQuestion = components['schemas']['MultipleChoiceQuestionResponse']
type Answer = components['schemas']['AnswerResponse']
type FreeTextAnswer = components['schemas']['FreeTextAnswerResponse']
type FreeNumberAnswer = components['schemas']['FreeNumberAnswerResponse']
type SingleChoiceAnswer = components['schemas']['SingleChoiceAnswerResponse']
type MultipleChoiceAnswer = components['schemas']['MultipleChoiceAnswerResponse']

type QuestionType = components['schemas']['QuestionResponse']['type']
export type GroupedAnswer = {
  [T in QuestionType]: {
    type: T
    answerContent: {
      free_text: FreeTextAnswer['content']
      free_number: FreeNumberAnswer['content']
      single: SingleChoiceAnswer['selectedOption']
      multiple: MultipleChoiceAnswer['selectedOptions'][number]
    }[T]
    users: string[]
  }
}[QuestionType]

export const groupFreeTextAnswers = (
  question: FreeTextQuestion,
  answers: Answer[],
): GroupedAnswer[] => {
  const filteredAnswers = answers.filter(
    (answer): answer is FreeTextAnswer =>
      answer.type === 'free_text' && answer.questionId === question.id,
  )
  const answerMap = filteredAnswers.reduce(
    (acc, answer) => {
      if (!acc[answer.content]) {
        acc[answer.content] = {
          type: 'free_text',
          answerContent: answer.content,
          users: [],
        }
      }
      acc[answer.content].users.push(answer.userId)
      return acc
    },
    {} as Record<string, Extract<GroupedAnswer, { type: 'free_text' }>>,
  )
  return Object.values(answerMap).sort((a, b) => {
    // 空文字列は最後に表示
    if (a.answerContent === '' && b.answerContent === '') return 0
    if (a.answerContent === '') return 1
    if (b.answerContent === '') return -1
    return a.answerContent.localeCompare(b.answerContent)
  })
}

export const groupFreeNumberAnswers = (
  question: FreeNumberQuestion,
  answers: Answer[],
): GroupedAnswer[] => {
  const filteredAnswers = answers.filter(
    (answer): answer is FreeNumberAnswer =>
      answer.type === 'free_number' && answer.questionId === question.id,
  )
  if (filteredAnswers.length === 0) return []

  const answerMap = filteredAnswers.reduce(
    (acc, answer) => {
      if (!acc[answer.content]) {
        acc[answer.content] = {
          type: 'free_number',
          answerContent: answer.content,
          users: [],
        }
      }
      acc[answer.content].users.push(answer.userId)
      return acc
    },
    {} as Record<number, Extract<GroupedAnswer, { type: 'free_number' }>>,
  )
  return Object.values(answerMap).sort((a, b) => {
    return a.answerContent - b.answerContent
  })
}

export const groupSingleChoiceAnswers = (
  question: SingleChoiceQuestion,
  answers: Answer[],
): GroupedAnswer[] => {
  const filteredAnswers = answers.filter(
    (answer): answer is SingleChoiceAnswer => answer.type === 'single',
  )
  const options: Extract<GroupedAnswer, { type: 'single' }>[] = question.options.map((option) => ({
    type: 'single',
    answerContent: option,
    users: [],
  }))
  return filteredAnswers.reduce((acc, answer) => {
    const group = acc.find((g) => g.answerContent.id === answer.selectedOption.id)
    if (!group) return acc
    group.users.push(answer.userId)
    return acc
  }, options)
}

export const groupMultipleChoiceAnswers = (
  question: MultipleChoiceQuestion,
  answers: Answer[],
): GroupedAnswer[] => {
  const filteredAnswers = answers.filter(
    (answer): answer is MultipleChoiceAnswer => answer.type === 'multiple',
  )
  const options: Extract<GroupedAnswer, { type: 'multiple' }>[] = question.options.map(
    (option) => ({
      type: 'multiple',
      answerContent: option,
      users: [],
    }),
  )
  return filteredAnswers.reduce((acc, answer) => {
    answer.selectedOptions.forEach((selectedOption) => {
      const group = acc.find((g) => g.answerContent.id === selectedOption.id)
      if (!group) return
      group.users.push(answer.userId)
    })
    return acc
  }, options)
}

export const groupKey = (group: GroupedAnswer) => {
  switch (group.type) {
    case 'free_text':
    case 'free_number':
      return group.answerContent
    case 'single':
    case 'multiple':
      return group.answerContent.id
    default:
      const _exhaustiveCheck: never = group
      throw new Error(`Unexpected type: ${(_exhaustiveCheck as GroupedAnswer).type}`)
  }
}

export const answerContent = (group: GroupedAnswer) => {
  switch (group.type) {
    case 'free_text':
    case 'free_number':
      return group.answerContent
    case 'single':
    case 'multiple':
      return group.answerContent.content
    default:
      const _exhaustiveCheck: never = group
      throw new Error(`Unexpected type: ${(_exhaustiveCheck as GroupedAnswer).type}`)
  }
}
