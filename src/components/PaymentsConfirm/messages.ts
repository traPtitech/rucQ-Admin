import { addDays, formatISO, getHours, set } from 'date-fns'

const SEND_HOUR_START = 7
const SEND_HOUR_END = 22

export const getMessageContent = (amount: number, amountPaid: number, newAmountPaid: number) => {
  const baseMessage =
    newAmountPaid > 0
      ? `${newAmountPaid}円の振込が確認されました。`
      : `${-newAmountPaid}円の返金が確認されました。`
  const errorMessage =
    amountPaid + newAmountPaid !== amount
      ? '\n現在の支払い金額に誤りがあります。合宿係にDMで問い合わせてください。' +
        `\nあなたの合宿費は${amount}円ですが、現在の支払い金額は${amountPaid + newAmountPaid}円です。`
      : ''
  return baseMessage + errorMessage
}

// 22時以降は、翌7時に送信
export const getMessageSendTime = () => {
  const now = new Date()
  const currentHour = getHours(now)
  if (currentHour >= SEND_HOUR_START && currentHour < SEND_HOUR_END) return formatISO(now)
  const baseTime = set(now, {
    hours: SEND_HOUR_START,
    minutes: 0,
    seconds: 0,
  })
  const sendTime = currentHour >= SEND_HOUR_END ? addDays(baseTime, 1) : baseTime
  return formatISO(sendTime)
}
