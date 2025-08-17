export interface BillingItem {
  id: number
  targets: string[] // 重複、空文字列を許容
  amount: number | null
}
interface UserBillingAddition {
  userId: string
  amount: number
}

export const aggregateBillingItems = (items: BillingItem[]): UserBillingAddition[] => {
  return items.reduce((acc, item) => {
    const targets = new Set(item.targets.filter((user) => user))
    const amount = item.amount
    if (amount === null) return acc
    targets.forEach((userId) => {
      const addition = acc.find((a) => a.userId === userId)
      if (addition) addition.amount += amount
      else acc.push({ userId, amount })
    })
    return acc
  }, [] as UserBillingAddition[])
}
