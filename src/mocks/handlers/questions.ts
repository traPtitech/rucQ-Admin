import { HttpResponse } from 'msw'
import { http } from '@/mocks/http'
import type { components } from '@/api/schema'

type QuestionGroup = components['schemas']['QuestionGroupResponse']
type Question = components['schemas']['QuestionResponse']
type Option = components['schemas']['OptionResponse']
type Answer = components['schemas']['AnswerResponse']

const questionGroups: QuestionGroup[] = [
  {
    id: 0,
    name: 'バス',
    description: 'バス代は行き帰りそれぞれ4000円ほどです',
    due: '2024-12-27',
    questions: [
      {
        id: 0,
        title: '行き',
        description: '9:00集合',
        type: 'single',
        isPublic: true,
        isOpen: false,
        isRequired: true,
        options: [
          {
            id: 0,
            content: '乗る',
          },
          {
            id: 1,
            content: '乗らない',
          },
        ],
      },
      {
        id: 1,
        title: '帰り',
        description: '18:00解散',
        type: 'single',
        isPublic: true,
        isOpen: false,
        isRequired: true,
        options: [
          {
            id: 2,
            content: '乗る',
          },
          {
            id: 3,
            content: '乗らない',
          },
        ],
      },
    ],
  },
  {
    id: 1,
    name: 'スキー用品レンタル',
    description: '',
    due: '2024-12-27',
    questions: [
      {
        id: 2,
        title: 'スキーをしますか',
        description: '',
        type: 'single',
        isPublic: true,
        isOpen: true,
        isRequired: true,
        options: [
          {
            id: 4,
            content: 'する',
          },
          {
            id: 5,
            content: 'しない',
          },
        ],
      },
      {
        id: 3,
        title: 'スキー/スノボセット',
        description: '2500円',
        type: 'single',
        isPublic: false,
        isOpen: true,
        isRequired: true,
        options: [
          {
            id: 6,
            content: 'スキーセットを借りる',
          },
          {
            id: 7,
            content: 'スノボセットを借りる',
          },
          {
            id: 8,
            content: '借りない',
          },
        ],
      },
      {
        id: 4,
        title: 'スキーウェア',
        description: '2500円',
        type: 'single',
        isPublic: false,
        isOpen: true,
        isRequired: true,
        options: [
          {
            id: 9,
            content: 'S',
          },
          {
            id: 10,
            content: 'M',
          },
          {
            id: 11,
            content: 'L',
          },
          {
            id: 12,
            content: 'LL',
          },
          {
            id: 13,
            content: '借りない',
          },
        ],
      },
      {
        id: 5,
        title: '小物',
        description: '各550円',
        type: 'multiple',
        isPublic: false,
        isOpen: true,
        isRequired: false,
        options: [
          {
            id: 14,
            content: 'ゴーグル',
          },
          {
            id: 15,
            content: 'ニット帽',
          },
          {
            id: 16,
            content: 'グローブ',
          },
        ],
      },
      {
        id: 6,
        title: '身長',
        description: 'スキー/スノボをする人のみ',
        type: 'free_number',
        isPublic: false,
        isOpen: true,
        isRequired: false,
      },
      {
        id: 7,
        title: '足のサイズ',
        description: 'スキー/スノボセットを借りる人のみ',
        type: 'free_number',
        isPublic: false,
        isOpen: true,
        isRequired: false,
      },
    ],
  },
  {
    id: 2,
    name: 'その他',
    description: '',
    due: '2024-12-27',
    questions: [
      {
        id: 8,
        title: 'アレルギー',
        description: '',
        type: 'free_text',
        isPublic: false,
        isOpen: false,
        isRequired: false,
      },
      {
        id: 9,
        title: '合宿係への連絡事項',
        description: '',
        type: 'free_text',
        isPublic: false,
        isOpen: true,
        isRequired: false,
      },
    ],
  },
]
const answers: Answer[] = [
  // traP's answers
  {
    id: 0,
    type: 'single',
    questionId: 0,
    userId: 'traP',
    selectedOption: { id: 0, content: '乗る' },
  },
  {
    id: 1,
    type: 'single',
    questionId: 1,
    userId: 'traP',
    selectedOption: { id: 2, content: '乗る' },
  },
  {
    id: 2,
    type: 'single',
    questionId: 2,
    userId: 'traP',
    selectedOption: { id: 4, content: 'する' },
  },
  {
    id: 3,
    type: 'single',
    questionId: 3,
    userId: 'traP',
    selectedOption: { id: 6, content: 'スキーセットを借りる' },
  },
  {
    id: 4,
    type: 'single',
    questionId: 4,
    userId: 'traP',
    selectedOption: { id: 10, content: 'M' },
  },
  {
    id: 5,
    type: 'multiple',
    questionId: 5,
    userId: 'traP',
    selectedOptions: [
      { id: 14, content: 'ゴーグル' },
      { id: 16, content: 'グローブ' },
    ],
  },
  {
    id: 6,
    type: 'free_number',
    questionId: 6,
    userId: 'traP',
    content: 175,
  },
  {
    id: 7,
    type: 'free_number',
    questionId: 7,
    userId: 'traP',
    content: 27.0,
  },
  { id: 8, type: 'free_text', questionId: 8, userId: 'traP', content: 'えび' },
  { id: 9, type: 'free_text', questionId: 9, userId: 'traP', content: '' },

  // trap1's answers
  {
    id: 10,
    type: 'single',
    questionId: 0,
    userId: 'trap1',
    selectedOption: { id: 1, content: '乗らない' },
  },
  {
    id: 11,
    type: 'single',
    questionId: 1,
    userId: 'trap1',
    selectedOption: { id: 3, content: '乗らない' },
  },
  {
    id: 12,
    type: 'single',
    questionId: 2,
    userId: 'trap1',
    selectedOption: { id: 5, content: 'しない' },
  },
  {
    id: 13,
    type: 'single',
    questionId: 3,
    userId: 'trap1',
    selectedOption: { id: 8, content: '借りない' },
  },
  {
    id: 14,
    type: 'single',
    questionId: 4,
    userId: 'trap1',
    selectedOption: { id: 13, content: '借りない' },
  },
  {
    id: 15,
    type: 'free_text',
    questionId: 8,
    userId: 'trap1',
    content: 'なし',
  },
  {
    id: 16,
    type: 'free_text',
    questionId: 9,
    userId: 'trap1',
    content: '途中参加です',
  },

  // trap2's answers
  {
    id: 17,
    type: 'single',
    questionId: 0,
    userId: 'trap2',
    selectedOption: { id: 0, content: '乗る' },
  },
  {
    id: 18,
    type: 'single',
    questionId: 1,
    userId: 'trap2',
    selectedOption: { id: 3, content: '乗らない' },
  },
  {
    id: 19,
    type: 'single',
    questionId: 2,
    userId: 'trap2',
    selectedOption: { id: 4, content: 'する' },
  },
  {
    id: 20,
    type: 'single',
    questionId: 3,
    userId: 'trap2',
    selectedOption: { id: 7, content: 'スノボセットを借りる' },
  },
  {
    id: 21,
    type: 'single',
    questionId: 4,
    userId: 'trap2',
    selectedOption: { id: 9, content: 'S' },
  },
  {
    id: 22,
    type: 'multiple',
    questionId: 5,
    userId: 'trap2',
    selectedOptions: [{ id: 15, content: 'ニット帽' }],
  },
  {
    id: 23,
    type: 'free_number',
    questionId: 6,
    userId: 'trap2',
    content: 160,
  },
  {
    id: 24,
    type: 'free_number',
    questionId: 7,
    userId: 'trap2',
    content: 24.5,
  },
  {
    id: 25,
    type: 'free_text',
    questionId: 8,
    userId: 'trap2',
    content: '',
  },
  {
    id: 26,
    type: 'free_text',
    questionId: 9,
    userId: 'trap2',
    content: '',
  },
]

let nextQuestionGroupId = 3
let nextQuestionId = 10
let nextOptionId = 17
// let nextAnswerId = 27

export const questionsHandlers = [
  http.get('/api/camps/{campId}/question-groups', () => {
    return HttpResponse.json(questionGroups)
  }),

  http.post('/api/admin/camps/{campId}/question-groups', async ({ request }) => {
    const newQuestionGroup = await request.json()

    const questionGroupId = nextQuestionGroupId++
    const questions: Question[] = []
    for (const question of newQuestionGroup.questions) {
      const questionId = nextQuestionId++
      if (question.type === 'free_text' || question.type === 'free_number') {
        if ('options' in question) {
          return HttpResponse.json(
            { message: 'Options are not allowed for this question type.' },
            { status: 400 },
          )
        }
        questions.push({
          ...question,
          id: questionId,
        } as Question)
      } else {
        if (!question.options || question.options.length === 0) {
          return HttpResponse.json(
            { message: 'Options are required for this question type.' },
            { status: 400 },
          )
        }
        questions.push({
          ...question,
          id: questionId,
          options: question.options.map((option) => ({
            ...option,
            id: nextOptionId++,
          })),
        } as Question)
      }
    }

    const createdQuestionGroup: QuestionGroup = {
      ...newQuestionGroup,
      id: questionGroupId,
      questions,
    }

    questionGroups.push(createdQuestionGroup)

    return HttpResponse.json(createdQuestionGroup, { status: 201 })
  }),

  http.put('/api/admin/question-groups/{questionGroupId}', async ({ params, request }) => {
    const questionGroupId = Number.parseInt(params.questionGroupId, 10)
    const updatedQuestionGroupReq = await request.json()

    const index = questionGroups.findIndex((g) => g.id === questionGroupId)
    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    questionGroups[index].name = updatedQuestionGroupReq.name
    questionGroups[index].description = updatedQuestionGroupReq.description
    questionGroups[index].due = updatedQuestionGroupReq.due
    return HttpResponse.json(questionGroups[index])
  }),

  http.delete('/api/admin/question-groups/{questionGroupId}', ({ params }) => {
    const questionGroupId = Number.parseInt(params.questionGroupId, 10)
    const index = questionGroups.findIndex((g) => g.id === questionGroupId)
    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    questionGroups.splice(index, 1)
    return new HttpResponse(null, { status: 204 })
  }),

  http.post(
    '/api/admin/question-groups/{questionGroupId}/questions',
    async ({ params, request }) => {
      const questionGroupId = Number.parseInt(params.questionGroupId, 10)
      const questionGroup = questionGroups.find((g) => g.id === questionGroupId)
      if (!questionGroup) {
        return new HttpResponse(null, { status: 404 })
      }

      const question = await request.json()
      if (question.type === 'free_text' || question.type === 'free_number') {
        if ('options' in question) {
          return HttpResponse.json(
            { message: 'Options are not allowed for this question type.' },
            { status: 400 },
          )
        }
        const createdQuestion: Question = {
          ...question,
          isRequired: question.isRequired ?? false,
          id: nextQuestionId++,
        }
        questionGroup.questions.push(createdQuestion)
        return HttpResponse.json(createdQuestion, { status: 201 })
      } else {
        if (!question.options || question.options.length === 0) {
          return HttpResponse.json(
            { message: 'Options are required for this question type.' },
            { status: 400 },
          )
        }
        const options: Option[] = []
        for (const option of question.options) {
          options.push({
            ...option,
            id: nextOptionId++,
          })
        }
        const createdQuestion: Question = {
          ...question,
          isRequired: question.isRequired ?? false,
          id: nextQuestionId++,
          options: options,
        }
        questionGroup.questions.push(createdQuestion)
        return HttpResponse.json(createdQuestion, { status: 201 })
      }
    },
  ),

  http.put('/api/admin/questions/{questionId}', async ({ params, request }) => {
    const questionId = Number.parseInt(params.questionId, 10)
    const updatedQuestionReq = await request.json()

    for (const questionGroup of questionGroups) {
      const index = questionGroup.questions.findIndex((q) => q.id === questionId)
      if (index !== -1) {
        if (updatedQuestionReq.type !== questionGroup.questions[index].type) {
          return HttpResponse.json({ message: 'Type cannot be changed.' }, { status: 400 })
        }
        questionGroup.questions[index].title = updatedQuestionReq.title
        questionGroup.questions[index].description = updatedQuestionReq.description
        questionGroup.questions[index].isPublic = updatedQuestionReq.isPublic
        questionGroup.questions[index].isOpen = updatedQuestionReq.isOpen
        return HttpResponse.json(questionGroup.questions[index])
      }
    }

    return new HttpResponse(null, { status: 404 })
  }),

  http.delete('/api/admin/questions/{questionId}', ({ params }) => {
    const questionId = Number.parseInt(params.questionId, 10)
    for (const group of questionGroups) {
      const index = group.questions.findIndex((q) => q.id === questionId)
      if (index !== -1) {
        group.questions.splice(index, 1)
        return new HttpResponse(null, { status: 204 })
      }
    }
    return new HttpResponse(null, { status: 404 })
  }),

  http.get('/api/admin/questions/{questionId}/answers', ({ params, request }) => {
    const questionId = Number.parseInt(params.questionId, 10)
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')

    let filteredAnswers = answers.filter((a) => a.questionId === questionId)
    if (userId) {
      filteredAnswers = filteredAnswers.filter((a) => a.userId === userId)
    }

    return HttpResponse.json(filteredAnswers)
  }),

  http.get('/api/admin/question-groups/{questionGroupId}/answers', ({ params, request }) => {
    const questionGroupId = Number.parseInt(params.questionGroupId, 10)
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')

    const questionGroup = questionGroups.find((g) => g.id === questionGroupId)
    if (!questionGroup) {
      return new HttpResponse(null, { status: 404 })
    }
    const questionIds = questionGroup.questions.map((q) => q.id)

    let filteredAnswers = answers.filter((a) => questionIds.includes(a.questionId))
    if (userId) {
      filteredAnswers = filteredAnswers.filter((a) => a.userId === userId)
    }

    return HttpResponse.json(filteredAnswers)
  }),

  http.put('/api/admin/answers/{answerId}', async ({ params, request }) => {
    const answerId = Number.parseInt(params.answerId, 10)
    const updatedAnswerReq = await request.json()

    const index = answers.findIndex((a) => a.id === answerId)
    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }

    const findContent = (questionId: number, optionId: number) => {
      const question = questionGroups.flatMap((g) => g.questions).find((q) => q.id === questionId)
      if (!question || question.type === 'free_text' || question.type === 'free_number') return ''
      const option = question.options.find((o) => o.id === optionId)
      return option ? option.content : ''
    }

    switch (updatedAnswerReq.type) {
      case 'free_text':
        if (answers[index].type !== 'free_text') {
          return HttpResponse.json({ message: 'Type cannot be changed.' }, { status: 400 })
        }
        answers[index].content = updatedAnswerReq.content
        return HttpResponse.json(answers[index])
      case 'free_number':
        if (answers[index].type !== 'free_number') {
          return HttpResponse.json({ message: 'Type cannot be changed.' }, { status: 400 })
        }
        answers[index].content = updatedAnswerReq.content
        return HttpResponse.json(answers[index])
      case 'single':
        if (answers[index].type !== 'single') {
          return HttpResponse.json({ message: 'Type cannot be changed.' }, { status: 400 })
        }
        answers[index].selectedOption = {
          id: updatedAnswerReq.optionId,
          content: findContent(updatedAnswerReq.questionId, updatedAnswerReq.optionId),
        }
        return HttpResponse.json(answers[index])
      case 'multiple':
        if (answers[index].type !== 'multiple') {
          return HttpResponse.json({ message: 'Type cannot be changed.' }, { status: 400 })
        }
        answers[index].selectedOptions = updatedAnswerReq.optionIds.map((id: number) => ({
          id,
          content: findContent(updatedAnswerReq.questionId, id),
        }))
        return HttpResponse.json(answers[index])
      default:
        const _exhaustiveCheck: never = updatedAnswerReq
        return HttpResponse.json({ message: 'Invalid answer type.' }, { status: 400 })
    }
  }),
]
