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

/**
 * オブジェクトまたは配列内のすべての仮ID（`id`プロパティがisTemporaryIdでtrueを返すもの）を再帰的に削除します。
 * 元のデータは変更せず、仮IDが削除された新しいオブジェクトまたは配列を返します。
 *
 * @param {T} data - 処理対象のデータ。オブジェクト、配列、またはプリミティブ型。
 * @returns {T} 仮IDが削除されたデータ。
 */
export const removeTemporaryId = <T>(data: T): T => {
  // データがプリミティブ型ならそのまま返す
  if (data === null || typeof data !== 'object') {
    return data
  }

  // データが配列なら、各要素に対して再帰的に処理を行う
  if (Array.isArray(data)) {
    return data.map((item) => removeTemporaryId(item)) as T
  }

  // データがオブジェクトなら、各プロパティに対して再帰的に処理を行う
  const newEntries = Object.entries(data)
    .filter(([key, value]) => {
      if (key === 'id' && typeof value === 'number' && isTemporaryId(value)) {
        return false
      }
      return true
    })
    .map(([key, value]) => [key, removeTemporaryId(value)])
  return Object.fromEntries(newEntries) as T
}
