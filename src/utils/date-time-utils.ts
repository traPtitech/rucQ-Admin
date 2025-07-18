import { formatISO, isValid, parse, parseISO, set } from 'date-fns'
import { tz } from '@date-fns/tz'

/**
 * 与えられた文字列が有効なISO 8601形式の日付かどうかを判定します。
 * @param {string} date - ISO 8601形式の日付文字列。
 * @returns {boolean} 日付が有効な場合はtrue、そうでない場合はfalse。
 */
export const isValidDate = (date: string): boolean => {
  const parsedDate = parseISO(date)
  return isValid(parsedDate)
}

/**
 * 与えられた文字列が有効な 'HH:mm' 形式の時刻かどうかを判定します。
 * @param {string} time - 'HH:mm' 形式の時刻文字列。
 * @returns {boolean} 時刻が有効な場合はtrue、そうでない場合はfalse。
 */
export const isValidTime = (time: string): boolean => {
  const parsedTime = parse(time, 'HH:mm', new Date())
  return isValid(parsedTime)
}

/**
 * ISO 8601形式の日付と 'HH:mm' 形式の時刻を結合し、ISO 8601形式の文字列として返します。
 * タイムゾーンは 'Asia/Tokyo' に設定されます。
 * @param {string} date - ISO 8601形式の日付文字列。
 * @param {string} time - 'HH:mm' 形式の時刻文字列。
 * @returns {string} 結合されたISO 8601形式の日時文字列。
 */
export const combineDateAndTime = (date: string, time: string): string => {
  const parsedDate = parseISO(date)
  const parsedTime = parse(time, 'HH:mm', new Date())
  const combinedDateTime = set(
    parsedDate,
    {
      hours: parsedTime.getHours(),
      minutes: parsedTime.getMinutes(),
    },
    { in: tz('Asia/Tokyo') },
  )
  return formatISO(combinedDateTime)
}
