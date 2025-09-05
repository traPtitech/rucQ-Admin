export const queryKeys = {
  camps: {
    all: ['camps'] as const,
  },
  staffs: {
    all: ['staffs'] as const,
  },
  users: {
    all: ['users'] as const,
    me: () => [...queryKeys.users.all, 'me'] as const,
    detail: (userId: string) => [...queryKeys.users.all, userId] as const,
  },
  events: {
    all: (campId: number | undefined) => ['events', campId] as const,
  },
  participants: {
    all: (campId: number | undefined) => ['participants', campId] as const,
  },
  payments: {
    all: (campId: number | undefined) => ['payments', campId] as const,
  },
  questionGroups: {
    all: (campId: number | undefined) => ['questionGroups', campId] as const,
  },
  roomGroups: {
    all: (campId: number | undefined) => ['roomGroups', campId] as const,
  },
  answers: {
    root: ['answers'] as const,
    lists: () => [...queryKeys.answers.root, 'list'] as const,
    list: (questionId: number | undefined, userId?: string) =>
      [...queryKeys.answers.lists(), questionId, userId] as const,
    groups: () => [...queryKeys.answers.root, 'groups'] as const,
    group: (questionGroupId: number | undefined, userId?: string) =>
      [...queryKeys.answers.groups(), questionGroupId, userId] as const,
  },
}
