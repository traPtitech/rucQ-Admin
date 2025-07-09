import { marked } from 'marked'
import sanitizeHtml from 'sanitize-html'

/**
 * マークダウン文字列をサニタイズされた安全なHTML文字列に変換します。
 *
 * @param {string} markdown - 変換対象のマークダウン文字列。
 * @returns {string} サニタイズ済みの安全なHTML文字列。
 */
export const convertMarkdownToSafeHtml = (markdown: string) => {
  const html = marked.parse(markdown, { gfm: true, breaks: true }) as string
  return sanitizeHtml(html, {
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      th: ['align'],
      td: ['align'],
    },
  })
}
