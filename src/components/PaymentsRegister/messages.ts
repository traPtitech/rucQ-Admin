import { addDays, formatISO, getHours, set } from 'date-fns'

export const getMessageContent = (amount: number, amountPaid: number, newAmountPaid: number) => {
  let content = ''
  if (newAmountPaid > 0) {
    content = `${newAmountPaid}円の振り込みが確認されました。`
  } else {
    content = `${-newAmountPaid}円の返金が確認されました。`
  }
  if (amountPaid + newAmountPaid !== amount) {
    content +=
      '\n現在の支払い金額に誤りがあります。合宿係にDMで問い合わせてください。' +
      `\nあなたの合宿費は${amount}円ですが、現在の支払い金額は${amountPaid + newAmountPaid}円です。`
  }
  return content
}

// 22時以降は、翌7時に送信
export const getMessageSendTime = () => {
  const now = new Date()
  const currentHour = getHours(now)
  if (currentHour >= 7 && currentHour < 22) return formatISO(now)
  let sendTime = set(now, {
    hours: 7,
    minutes: 0,
    seconds: 0,
  })
  if (currentHour >= 22) sendTime = addDays(sendTime, 1)
  return formatISO(sendTime)
}
