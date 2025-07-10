import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import sanitizeHtml from 'sanitize-html'

/**
 * マークダウン文字列をサニタイズされた安全なHTML文字列に変換します。
 *
 * @param {string} markdown - 変換対象のマークダウン文字列。
 * @returns {string} サニタイズ済みの安全なHTML文字列。
 */
export const convertMarkdownToSafeHtml = (markdown: string): string => {
  const md: MarkdownIt = new MarkdownIt({
    breaks: true,
    linkify: true,
    highlight: (code, lang) => {
      if (lang && hljs.getLanguage(lang)) {
        try {
          const language = lang.split(':')[0]
          return hljs.highlight(code, { language, ignoreIllegals: true }).value
        } catch {
          // エラーは無視してフォールバック
        }
      }
      // ハイライトできない場合は、安全のためにHTMLエスケープしたコードを返す
      return md.utils.escapeHtml(code)
    },
  })

  const rawHtml = md.render(markdown || '')

  return sanitizeHtml(rawHtml, {
    allowedTags: [
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'p',
      'a',
      'ul',
      'ol',
      'li',
      'blockquote',
      'code',
      'pre',
      'strong',
      'em',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
      'hr',
      'br',
      'span',
      's',
      'del',
    ],
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      th: ['align'],
      td: ['align'],
      // hljsが生成するタグにclass属性を許可
      code: ['class'],
      span: ['class'],
    },
    allowedClasses: {
      // markdown-itとhljsが付与するクラス名を許可
      code: ['language-*', 'hljs'],
      span: ['hljs-*'],
    },
  })
}
