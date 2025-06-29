// DB採番IDが正の整数であることを前提に、負の整数で一時IDを生成
let _temporaryIdCounter = 0

/**
 * 新しい一時的な（未保存の）IDを生成します。
 * 連続する負の整数（-1, -2, -3, ...）を返します。
 * このIDは、エンティティがバックエンドに保存され、正式なIDが割り当てられるまでの
 * 仮の識別子として使用されます。
 *
 * @returns {number} 生成された一時的なID。
 */
export const generateNewTemporaryId = (): number => {
  return --_temporaryIdCounter
}

/**
 * 指定されたIDが一時的な（未保存の）IDであるかを判定します。
 * IDが負の整数である場合にtrueを返します。
 *
 * @param {number} id - 判定するID。
 * @returns {boolean} IDが一時的なものである場合はtrue、それ以外はfalse。
 */
export const isTemporaryId = (id: number): boolean => {
  return id < 0
}

/**
 * 指定されたIDが採番済み（バックエンドに保存され、正式なIDが割り当てられている）のIDであるかを判定します。
 * IDが正の整数である場合にtrueを返します。
 *
 * @param {number} id - 判定するID。
 * @returns {boolean} IDが採番済みである場合はtrue、それ以外はfalse。
 */
export const isAssignedId = (id: number): boolean => {
  // 正の整数かつ、有効な数値であるかをチェック
  return typeof id === 'number' && id >= 0 && Number.isInteger(id)
}
