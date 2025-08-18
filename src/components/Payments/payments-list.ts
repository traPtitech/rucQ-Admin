export interface PaymentData {
  userId: string
  amount: number | undefined
  amountPaid: number | undefined
  status: '完了' | '未払い' | '要返金' | '一部未払い' | '未登録'
  statusValue: number
  isParticipant: boolean
}

export const statusColor = (status: PaymentData['status']) => {
  switch (status) {
    case '完了':
      return 'success'
    case '未払い':
      return 'warning'
    case '要返金':
      return 'info'
    case '一部未払い':
      return 'error'
    case '未登録':
      return 'grey'
    default:
      const _exhaustiveCheck: never = status
      throw new Error(`Unknown status: ${_exhaustiveCheck}`)
  }
}
