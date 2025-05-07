export type CodeSnippet = {
  code: string
  lang: string
}

export const parseMarkdownCodeSnippets = (markdown: string): CodeSnippet[] => {
  const results: CodeSnippet[] = []
  const blocksReg = /```(.*?)```/gs
  while (true) {
    const match = blocksReg.exec(markdown)
    if (!match) {
      break
    }
    const content = match[1]
    const [firstLine, ...lines] = content.split('\n')
    lines.pop()
    const lang = firstLine.replace(/[`\r]/g, '').trim() || 'plain'
    const code = lines.join('\n')
    const result: CodeSnippet = {
      code,
      lang,
    }
    results.push(result)
  }
  return results
}

export const parseMarkdownSourceCode = (
  markdown: string,
  lang = 'markdown',
): string | undefined => {
  const codeSnippets = parseMarkdownCodeSnippets(markdown)
  return codeSnippets.find((codeSnippet) => codeSnippet.lang === lang)?.code
}
