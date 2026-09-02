const CHO_LIST = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
]

function getChosung(text: string): string {
  let result = ''
  for (const char of text) {
    const code = char.charCodeAt(0) - 0xac00
    if (code >= 0 && code <= 11171) {
      result += CHO_LIST[Math.floor(code / 588)]
    } else {
      result += char
    }
  }
  return result
}

// query가 초성(ㅍ, ㅍㄹ 등)이든 완성형 글자든 text에 포함되는지 확인
export function matchesQuery(query: string, text: string): boolean {
  if (!query) return true
  const normalizedQuery = query.trim()
  if (text.includes(normalizedQuery)) return true
  return getChosung(text).includes(normalizedQuery)
}