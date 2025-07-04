import { HttpResponse } from 'msw'
import { http } from '@/mocks/http'
import type { components } from '@/api/schema'

type QuestionGroup = components['schemas']['QuestionGroupResponse']
type Question = components['schemas']['QuestionResponse']
type Option = components['schemas']['OptionResponse']

const questionGroups: QuestionGroup[] = [
  {
    id: 0,
    name: 'バス',
    description: 'バス代は行き帰りそれぞれ4000円ほどです',
    due: '2024-12-27T00:00:00+09:00',
    questions: [
      {
        id: 0,
        title: '行き',
        description: '9:00集合',
        type: 'single',
        isPublic: true,
        isOpen: false,
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
    due: '2024-12-27T00:00:00+09:00',
    questions: [
      {
        id: 2,
        title: 'スキーをしますか',
        description: '',
        type: 'single',
        isPublic: true,
        isOpen: true,
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
        description: '',
        type: 'free_number',
        isPublic: false,
        isOpen: true,
      },
      {
        id: 7,
        title: '足のサイズ',
        description: 'スキー/スノボセットを借りる人のみ',
        type: 'free_number',
        isPublic: false,
        isOpen: true,
      },
    ],
  },
  {
    id: 2,
    name: 'その他',
    description: '',
    due: '2024-12-27T00:00:00+09:00',
    questions: [
      {
        id: 8,
        title: 'アレルギー',
        description: '',
        type: 'free_text',
        isPublic: false,
        isOpen: false,
      },
      {
        id: 9,
        title: '合宿係への連絡事項',
        description: '',
        type: 'free_text',
        isPublic: false,
        isOpen: true,
      },
    ],
  },
]
let nextQuestionGroupId = 3
let nextQuestionId = 10
let nextOptionId = 17

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
      const options: Option[] = []
      if ('options' in question && question.options !== undefined) {
        for (const option of question.options) {
          options.push({
            ...option,
            id: nextOptionId++,
          })
        }
        questions.push({
          ...question,
          id: questionId,
          options,
        } as Question)
      } else {
        questions.push({
          ...question,
          id: questionId,
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
    questionGroups[index] = {
      ...questionGroups[index],
      ...updatedQuestionGroupReq,
    }

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
  http.post('/api/question-groups/{questionGroupId}/questions', async ({ params, request }) => {
    const questionGroupId = Number.parseInt(params.questionGroupId, 10)
    const questionGroup = questionGroups.find((g) => g.id === questionGroupId)
    if (!questionGroup) {
      return new HttpResponse(null, { status: 404 })
    }

    const newQuestion = await request.json()
    const options: Option[] = []
    if ('options' in newQuestion && newQuestion.options !== undefined) {
      for (const option of newQuestion.options) {
        options.push({
          ...option,
          id: nextOptionId++,
        })
      }
    }

    const createdQuestion = {
      ...newQuestion,
      id: nextQuestionId++,
      options: options.length > 0 ? options : undefined,
    } as Question

    questionGroup.questions.push(createdQuestion)

    return HttpResponse.json(createdQuestion, { status: 201 })
  }),
  http.put('/api/admin/questions/{questionId}', async ({ params, request }) => {
    const questionId = Number.parseInt(params.questionId, 10)
    const updatedQuestionReq = await request.json()

    for (const questionGroup of questionGroups) {
      const index = questionGroup.questions.findIndex((q) => q.id === questionId)
      if (index !== -1) {
        questionGroup.questions[index] = {
          ...questionGroup.questions[index],
          ...updatedQuestionReq,
        }
        return HttpResponse.json(questionGroup.questions[index])
      }
    }

    return new HttpResponse(null, { status: 404 })
  }),
]
