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
const hoverBorderHeight = 2
const hoverSectionBorderHeight = 1
const hoverSectionGap = 3
const hoverSectionPaddingHeight = 8
const hoverMinHeight = 20
const hoverMaxWidth = 600
const hoverDocumentationWidth = hoverMaxWidth - hoverPaddingLeft - hoverPaddingRight - hoverBorderLeft - hoverBorderRight

const getHoverHeight = (editor: any, lineInfos: readonly any[], documentation: string, documentationHeight: number, diagnostics: readonly any[]) => {
  let height = hoverBorderHeight
  let sectionCount = 0
  if (diagnostics.length > 0) {
    height += editor.rowHeight + hoverSectionPaddingHeight
    sectionCount++
  }
  if (lineInfos.length > 0) {
    height += lineInfos.length * editor.rowHeight + hoverSectionPaddingHeight
    if (sectionCount > 0) {
      height += hoverSectionBorderHeight
    }
    sectionCount++
  }
  if (documentation) {
    height += documentationHeight + hoverSectionPaddingHeight
    sectionCount++
  }
  height += Math.max(0, sectionCount - 1) * hoverSectionGap
  return Math.min(Math.max(height, hoverMinHeight), editor.height)
}

const getHoverBounds = (editor: any, rowIndex: number, wordStart: number, height: number) => {
  const width = Math.min(hoverMaxWidth, editor.width)
  const editorRight = editor.x + editor.width
  const preferredX = EditorPosition.x(editor, rowIndex, wordStart)
  const x = Math.max(editor.x, Math.min(preferredX, editorRight - width))
  const rowBottom = EditorPosition.y(editor, rowIndex)
  const rowTop = rowBottom - editor.rowHeight
  const editorBottom = editor.y + editor.height
  const y = rowBottom + height <= editorBottom ? rowBottom : Math.max(editor.y, rowTop - height)
  return {
    height,
    width,
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
  const height = getHoverHeight(editor, lineInfos, documentation, documentationHeight, matchingDiagnostics)
  const { width, x, y } = getHoverBounds(editor, rowIndex, wordStart, height)
  return {
    documentation,
    height,
    lineInfos,
    matchingDiagnostics,
    width,
    x,
    y,
  }
}
