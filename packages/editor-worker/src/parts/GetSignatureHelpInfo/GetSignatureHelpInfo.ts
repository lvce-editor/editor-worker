import * as Assert from '../Assert/Assert.ts'
import * as Editors from '../EditorStates/EditorStates.ts'
import * as GetSignatureHelpContent from '../GetSignatureHelpContent/GetSignatureHelpContent.ts'
import * as GetSignatureHelpWidgetBounds from '../GetSignatureHelpWidgetBounds/GetSignatureHelpWidgetBounds.ts'
import * as MeasureTextHeight from '../MeasureTextHeight/MeasureTextHeight.ts'
import * as SignatureHelp from '../SignatureHelp/SignatureHelp.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'
import * as TokenizeCodeBlock from '../TokenizeCodeBlock/TokenizeCodeBlock.ts'

const documentationFontSize = 15
const documentationFontFamily = 'Fira Code'
const documentationLineHeight = '1.33333'
const borderLeft = 1
const borderRight = 1
const paddingLeft = 8
const paddingRight = 8
export const getSignatureHelpInfo = async (editorUid: number) => {
  Assert.number(editorUid)
  const instance = Editors.get(editorUid)
  const editor = instance.newState
  const { selections } = editor
  const rowIndex = selections[0]
  const columnIndex = selections[1]
  const offset = TextDocument.offsetAt(editor, rowIndex, columnIndex)
  const signatureHelp = await SignatureHelp.getSignatureHelp(editor, offset)
  if (!signatureHelp) {
    return undefined
  }
  const content = GetSignatureHelpContent.getSignatureHelpContent(signatureHelp)
  if (!content) {
    return undefined
  }
  const { displayString, documentation } = content
  const lineInfos = await TokenizeCodeBlock.tokenizeCodeBlock(displayString, editor.languageId || 'typescript', '')
  const fullWidth = Math.min(600, editor.width)
  const documentationWidth = fullWidth - paddingLeft - paddingRight - borderLeft - borderRight
  const documentationHeight = await MeasureTextHeight.measureTextBlockHeight(
    documentation,
    documentationFontFamily,
    documentationFontSize,
    documentationLineHeight,
    documentationWidth,
  )
  const bounds = GetSignatureHelpWidgetBounds.getSignatureHelpWidgetBounds(
    editor,
    rowIndex,
    columnIndex,
    lineInfos.length,
    documentationHeight,
    Boolean(documentation),
  )
  return {
    ...bounds,
    documentation,
    lineInfos,
  }
}
