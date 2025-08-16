export interface BillingItem {
  id: number
  targets: string[]
  amount: number | null
}
interface UserBillingAddition {
  userId: string
  amount: number
}

export const aggregateBillingItems = (items: BillingItem[]): UserBillingAddition[] => {
  return items.reduce((acc, item) => {
    const amount = item.amount
    if (amount === null) return acc
    item.targets.forEach((userId) => {
      const addition = acc.find((a) => a.userId === userId)
      if (addition) addition.amount += amount
      else acc.push({ userId, amount })
    })
    return acc
  }, [] as UserBillingAddition[])
}
