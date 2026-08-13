import * as Assert from '../Assert/Assert.ts'
import * as GetWordAt from '../EditorCommand/EditorCommandGetWordAt.ts'
import * as EditorPosition from '../EditorCommand/EditorCommandPosition.ts'
import * as Editors from '../EditorStates/EditorStates.ts'
import * as Hover from '../Hover/Hover.ts'
import * as MeasureTextHeight from '../MeasureTextHeight/MeasureTextHeight.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'
import * as TokenizeCodeBlock from '../TokenizeCodeBlock/TokenizeCodeBlock.ts'

const containsPosition = (diagnostic: any, rowIndex: number, columnIndex: number): boolean => {
  const { columnIndex: startColumnIndex, endColumnIndex, endRowIndex, rowIndex: startRowIndex } = diagnostic
  if (rowIndex < startRowIndex || rowIndex > endRowIndex) {
    return false
  }
  if (rowIndex === startRowIndex && columnIndex < startColumnIndex) {
    return false
  }
  if (rowIndex === endRowIndex && columnIndex >= endColumnIndex) {
    return false
  }
  return true
}

const getMatchingDiagnostics = (diagnostics: any, rowIndex: number, columnIndex: number) => {
  const matching: any[] = []
  for (const diagnostic of diagnostics) {
    if (containsPosition(diagnostic, rowIndex, columnIndex)) {
      matching.push(diagnostic)
    }
  }
  return matching
}

const fallbackDisplayStringLanguageId = 'typescript' // TODO remove this

const hoverDocumentationFontSize = 15
const hoverDocumentationFontFamily = 'Fira Code'
const hoverDocumentationLineHeight = '1.33333'
const hoverWidth = 600
const hoverDocumentationWidth = hoverWidth - 18

const getDiagnosticText = (diagnostic: any): string => {
  return `${diagnostic.message} ${diagnostic.source} (${diagnostic.code})`
}

const getDiagnosticsHeight = async (diagnostics: readonly any[], editor: any): Promise<number> => {
  if (diagnostics.length === 0) {
    return 0
  }
  const text = diagnostics.map(getDiagnosticText).join('\n')
  const contentHeight = await MeasureTextHeight.measureTextBlockHeight(
    text,
    editor.fontFamily,
    editor.fontSize,
    `${editor.rowHeight}px`,
    hoverDocumentationWidth,
  )
  return contentHeight + 10
}

export const getEditorHoverInfo = async (editorUid: number, position: any) => {
  Assert.number(editorUid)
  const instance = Editors.get(editorUid)
  const editor = instance.newState
  const { selections } = editor
  const { columnIndex, rowIndex } = position || { columnIndex: selections[1], rowIndex: selections[0] }
  const offset = TextDocument.offsetAt(editor, rowIndex, columnIndex)
  const diagnostics = editor.diagnostics || []
  const matchingDiagnostics = getMatchingDiagnostics(diagnostics, rowIndex, columnIndex)
  let hover
  try {
    hover = await Hover.getHover(editor, offset)
  } catch {}
  if (!hover && matchingDiagnostics.length === 0) {
    return undefined
  }
  const { displayString = '', displayStringLanguageId = '', documentation = '' } = hover || {}
  const tokenizerPath = ''
  const lineInfos = displayString
    ? await TokenizeCodeBlock.tokenizeCodeBlock(displayString, displayStringLanguageId || fallbackDisplayStringLanguageId, tokenizerPath)
    : []
  const wordPart = GetWordAt.getWordBefore(editor, rowIndex, columnIndex)
  const wordStart = columnIndex - wordPart.length
  const documentationHeight = documentation
    ? await MeasureTextHeight.measureTextBlockHeight(
        documentation,
        hoverDocumentationFontFamily,
        hoverDocumentationFontSize,
        hoverDocumentationLineHeight,
        hoverDocumentationWidth,
      )
    : 0
  const diagnosticsHeight = await getDiagnosticsHeight(matchingDiagnostics, editor)
  const height = Math.min(
    diagnosticsHeight + (lineInfos.length > 0 ? lineInfos.length * editor.rowHeight + 12 : 0) + (documentation ? documentationHeight + 11 : 0) || 20,
    editor.height,
  )
  const x = Math.max(editor.x, Math.min(EditorPosition.x(editor, rowIndex, wordStart), editor.x + editor.width - hoverWidth))
  const rowBottom = EditorPosition.y(editor, rowIndex)
  const y = rowBottom + height <= editor.y + editor.height ? rowBottom : Math.max(editor.y, rowBottom - editor.rowHeight - height)
  return {
    documentation,
    height,
    lineInfos,
    matchingDiagnostics,
    x,
    y,
  }
}
