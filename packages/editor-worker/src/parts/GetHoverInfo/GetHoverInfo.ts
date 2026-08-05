import * as Assert from '../Assert/Assert.ts'
import * as GetWordAt from '../EditorCommand/EditorCommandGetWordAt.ts'
import * as EditorPosition from '../EditorCommand/EditorCommandPosition.ts'
import * as Editors from '../EditorStates/EditorStates.ts'
import * as Hover from '../Hover/Hover.ts'
import * as MeasureTextHeight from '../MeasureTextHeight/MeasureTextHeight.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'
import * as TokenizeCodeBlock from '../TokenizeCodeBlock/TokenizeCodeBlock.ts'

const getHoverPosition = (position: any, selections: any) => {
  if (position) {
    return position
  }
  const rowIndex = selections[0]
  const columnIndex = selections[1]
  return {
    columnIndex,
    rowIndex,
  }
}

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

const getHover = async (editor: any, offset: number): Promise<any> => {
  try {
    return await Hover.getHover(editor, offset)
  } catch {
    return undefined
  }
}

const fallbackDisplayStringLanguageId = 'typescript' // TODO remove this

const hoverDocumentationFontSize = 15
const hoverDocumentationFontFamily = 'Fira Code'
const hoverDocumentationLineHeight = '1.33333'
const hoverBorderLeft = 1
const hoverBorderRight = 1
const hoverPaddingLeft = 8
const hoverPaddingRight = 8
const hovverFullWidth = 400
const hoverDocumentationWidth = hovverFullWidth - hoverPaddingLeft - hoverPaddingRight - hoverBorderLeft - hoverBorderRight

const getHoverPositionXy = (editor: any, rowIndex: number, wordStart: any, documentationHeight: any) => {
  const x = EditorPosition.x(editor, rowIndex, wordStart)
  const y = editor.height - EditorPosition.y(editor, rowIndex) + editor.y + 40
  return {
    x,
    y,
  }
}

export const getEditorHoverInfo = async (editorUid: number, position: any) => {
  Assert.number(editorUid)
  const instance = Editors.get(editorUid)
  const editor = instance.newState
  const { selections } = editor
  const { columnIndex, rowIndex } = getHoverPosition(position, selections)
  const offset = TextDocument.offsetAt(editor, rowIndex, columnIndex)
  const diagnostics = editor.diagnostics || []
  const matchingDiagnostics = getMatchingDiagnostics(diagnostics, rowIndex, columnIndex)
  const hover = await getHover(editor, offset)
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
  const documentationHeight = await MeasureTextHeight.measureTextBlockHeight(
    documentation,
    hoverDocumentationFontFamily,
    hoverDocumentationFontSize,
    hoverDocumentationLineHeight,
    hoverDocumentationWidth,
  )
  const { x, y } = getHoverPositionXy(editor, rowIndex, wordStart, documentationHeight)
  return {
    documentation,
    lineInfos,
    matchingDiagnostics,
    x,
    y,
  }
}
