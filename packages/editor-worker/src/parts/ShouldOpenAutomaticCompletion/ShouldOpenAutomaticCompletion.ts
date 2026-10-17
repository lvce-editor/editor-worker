import { isTypeScriptCode } from '../IsTypeScriptCode/IsTypeScriptCode.ts'

export const shouldOpenAutomaticCompletion = (editor: any): boolean => {
  const { completionsOnType, isQuickSuggestionsEnabled, languageId, largeFile, lines, selections } = editor
  if (largeFile || !(completionsOnType || (languageId === 'typescript' && isQuickSuggestionsEnabled))) {
    return false
  }
  if (languageId !== 'typescript') {
    return true
  }
  const rowIndex = selections[0]
  const columnIndex = selections[1]
  const prefix = [...lines.slice(0, rowIndex), lines[rowIndex].slice(0, columnIndex)].join('\n')
  return /[\w$.]$/u.test(prefix) && isTypeScriptCode(prefix)
}
