import { isAfter, isEqual, formatISO, isValid, parse, parseISO, set } from 'date-fns'
import { tz } from '@date-fns/tz'

/**
 * 与えられた値が有効なISO 8601形式の日付文字列かを判定します。
 * @param {unknown} date - チェック対象の値。
 * @returns {boolean} 有効な日付文字列の場合はtrue、そうでない場合はfalse。
 */
export const isValidDate = (date: unknown): boolean => {
  if (typeof date !== 'string') return false
  const parsedDate = parseISO(date)
  return isValid(parsedDate)
}

/**
 * 与えられた値が有効な 'HH:mm' 形式の時刻文字列かを判定します。
 * @param {unknown} time - チェック対象の値。
 * @returns {boolean} 有効な時刻文字列の場合はtrue、そうでない場合はfalse。
 */
export const isValidTime = (time: unknown): boolean => {
  if (typeof time !== 'string') return false
  const parsedTime = parse(time, 'HH:mm', new Date())
  return isValid(parsedTime)
}

/**
 * ISO 8601形式の日付と 'HH:mm' 形式の時刻を結合し、ISO 8601形式の文字列として返します。
 * タイムゾーンは 'Asia/Tokyo' に設定されます。
 * この関数は、引数として有効な形式の文字列が渡されることを前提としています。
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

/**
 * 終了時刻が開始時刻以降であるかを判定するカリー化されたバリデーション関数。
 *
 * @param {unknown} timeStart - 'HH:mm' 形式の開始時刻として期待される値。
 * @returns {(timeEnd: unknown) => boolean} 終了時刻を受け取り、比較結果を返す関数。
 *
 * @example
 * const isLater = isTimeAfterOrEqual('10:00');
 * isLater('11:00'); // true
 * isLater('10:00'); // true
 * isLater('09:00'); // false
 * isLater(null); // false
 */
export const isTimeAfterOrEqual =
  (timeStart: unknown) =>
  (timeEnd: unknown): boolean => {
    if (!isValidTime(timeStart) || !isValidTime(timeEnd)) {
      return false
    }
    const referenceDate = new Date()
    // isValidTimeでstringであることが保証されている
    const start = parse(timeStart as string, 'HH:mm', referenceDate)
    const end = parse(timeEnd as string, 'HH:mm', referenceDate)
    return isAfter(end, start) || isEqual(end, start)
  }
