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
        questionGroupId: 0,
        title: '行き',
        description: '9:00集合',
        type: 'single',
        isPublic: true,
        isOpen: false,
        options: [
          {
            id: 0,
            questionId: 0,
            content: '乗る',
          },
          {
            id: 1,
            questionId: 0,
            content: '乗らない',
          },
        ],
      },
      {
        id: 1,
        questionGroupId: 0,
        title: '帰り',
        description: '18:00解散',
        type: 'single',
        isPublic: true,
        isOpen: false,
        options: [
          {
            id: 2,
            questionId: 1,
            content: '乗る',
          },
          {
            id: 3,
            questionId: 1,
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
        questionGroupId: 1,
        title: 'スキーをしますか',
        description: '',
        type: 'single',
        isPublic: true,
        isOpen: true,
        options: [
          {
            id: 4,
            questionId: 2,
            content: 'する',
          },
          {
            id: 5,
            questionId: 2,
            content: 'しない',
          },
        ],
      },
      {
        id: 3,
        questionGroupId: 1,
        title: 'スキー/スノボセット',
        description: '2500円',
        type: 'single',
        isPublic: false,
        isOpen: true,
        options: [
          {
            id: 6,
            questionId: 3,
            content: 'スキーセットを借りる',
          },
          {
            id: 7,
            questionId: 3,
            content: 'スノボセットを借りる',
          },
          {
            id: 8,
            questionId: 3,
            content: '借りない',
          },
        ],
      },
      {
        id: 4,
        questionGroupId: 1,
        title: 'スキーウェア',
        description: '2500円',
        type: 'single',
        isPublic: false,
        isOpen: true,
        options: [
          {
            id: 9,
            questionId: 4,
            content: 'S',
          },
          {
            id: 10,
            questionId: 4,
            content: 'M',
          },
          {
            id: 11,
            questionId: 4,
            content: 'L',
          },
          {
            id: 12,
            questionId: 4,
            content: 'LL',
          },
          {
            id: 13,
            questionId: 4,
            content: '借りない',
          },
        ],
      },
      {
        id: 5,
        questionGroupId: 1,
        title: '小物',
        description: '各550円',
        type: 'multiple',
        isPublic: false,
        isOpen: true,
        options: [
          {
            id: 14,
            questionId: 5,
            content: 'ゴーグル',
          },
          {
            id: 15,
            questionId: 5,
            content: 'ニット帽',
          },
          {
            id: 16,
            questionId: 5,
            content: 'グローブ',
          },
        ],
      },
      {
        id: 6,
        questionGroupId: 1,
        title: '身長',
        description: '',
        type: 'free_number',
        isPublic: false,
        isOpen: true,
      },
      {
        id: 7,
        questionGroupId: 1,
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
        questionGroupId: 2,
        title: 'アレルギー',
        description: '',
        type: 'free_text',
        isPublic: false,
        isOpen: false,
      },
      {
        id: 9,
        questionGroupId: 2,
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
            questionId,
          })
        }
      }
      questions.push({
        ...question,
        id: questionId,
        questionGroupId,
        options,
      } as Question)
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

    const questionGroup = questionGroups.find((g) => g.id === questionGroupId)
    if (questionGroup === undefined) {
      return new HttpResponse(null, { status: 404 })
    }

    const questions: Question[] = []
    for (const question of updatedQuestionGroupReq.questions) {
      const questionId = question.id ?? nextQuestionId++
      const options: Option[] = []
      if ('options' in question && question.options !== undefined) {
        for (const option of question.options) {
          options.push({
            ...option,
            id: option.id ?? nextOptionId++,
            questionId,
          })
        }
      }
      questions.push({
        ...question,
        id: questionId,
        questionGroupId,
        options,
      } as Question)
    }

    const updatedQuestionGroup: QuestionGroup = {
      ...updatedQuestionGroupReq,
      id: questionGroupId,
      questions,
    }

    const index = questionGroups.findIndex((g) => g.id === questionGroupId)
    questionGroups[index] = updatedQuestionGroup

    return HttpResponse.json(updatedQuestionGroup)
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
]
