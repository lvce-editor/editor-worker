import { WhenExpression } from '@lvce-editor/constants'
import type { EditorCreateOptions } from '../EditorCreateOptions/EditorCreateOptions.ts'
import * as Assert from '../Assert/Assert.ts'
import * as Editor from '../Editor/Editor.ts'
import * as EditorState from '../Editors/Editors.ts'
import * as EditorScrolling from '../EditorScrolling/EditorScrolling.ts'
import * as EditorText from '../EditorText/EditorText.ts'
import { emptyEditor } from '../EmptyEditor/EmptyEditor.ts'
import { emptyIncrementalEdits } from '../EmptyIncrementalEdits/EmptyIncrementalEdits.ts'
import * as ExtensionHostCommandType from '../ExtensionHostCommandType/ExtensionHostCommandType.ts'
import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.ts'
import * as FocusKey from '../FocusKey/FocusKey.ts'
import { getLanguageId } from '../GetLanguageId/GetLanguageId.ts'
import { getLanguages } from '../GetLanguages/GetLanguages.ts'
import * as MeasureCharacterWidth from '../MeasureCharacterWidth/MeasureCharacterWidth.ts'
import * as SyncIncremental from '../SyncIncremental/SyncIncremental.ts'
import * as UpdateDiagnostics from '../UpdateDiagnostics/UpdateDiagnostics.ts'

export const createEditor = async ({
  id,
  content,
  savedDeltaY,
  rowHeight,
  fontSize,
  hoverEnabled,
  letterSpacing,
  tabSize,
  links,
  lineNumbers,
  formatOnSave,
  isAutoClosingBracketsEnabled,
  isAutoClosingTagsEnabled,
  isAutoClosingQuotesEnabled,
  isQuickSuggestionsEnabled,
  completionTriggerCharacters,
  savedSelections,
  languageId,
  x,
  y,
  width,
  height,
  fontWeight,
  fontFamily,
  isMonospaceFont,
  uri,
  diagnosticsEnabled,
  lineToReveal,
  columnToReveal,
}: EditorCreateOptions) => {
  Assert.number(id)
  Assert.string(content)
  // TODO support overwriting language id by setting it explicitly or via settings
  const charWidth = MeasureCharacterWidth.measureCharacterWidth(fontWeight, fontSize, fontFamily, letterSpacing)
  const languages = await getLanguages()
  const computedlanguageId = getLanguageId(uri, languages)
  const editor = {
    charWidth,
    columnWidth: 0,
    completionState: '',
    completionTriggerCharacters,
    completionUid: 0,
    cursorWidth: 2,
    decorations: [],
    deltaX: 0,
    deltaY: 0,
    diagnostics: [],
    diagnosticsEnabled,
    differences: [],
    finalDeltaY: 0,
    finalY: 0,
    focused: false,
    focusKey: FocusKey.Empty,
    fontFamily,
    fontSize,
    fontWeight,
    handleOffsetX: 0,
    height,
    id,
    incrementalEdits: emptyIncrementalEdits,
    invalidStartIndex: 0,
    isAutoClosingBracketsEnabled,
    isAutoClosingQuotesEnabled,
    isAutoClosingTagsEnabled,
    isMonospaceFont,
    isQuickSuggestionsEnabled,
    itemHeight: 20,
    languageId: computedlanguageId,
    letterSpacing,
    lineCache: [],
    lineNumbers,
    lines: [],
    longestLineWidth: 0,
    maxLineY: 0,
    minimumSliderSize: 20,
    minLineY: 0,
    numberOfVisiblelines: 0,
    numberOfVisibleLines: 0,
    primarySelectionIndex: 0,
    rowHeight,
    savedSelections,
    scrollBarHeight: 0,
    scrollBarWidth: 0,
    selections: new Uint32Array(),
    tabSize,
    textInfos: [],
    tokenizerId: 0,
    uid: id,
    undoStack: [],
    uri,
    validLines: [],
    widgets: [],
    width,
    x,
    y,
  }

  // TODO avoid creating intermediate editors here
  const newEditor1 = Editor.setBounds(editor, x, y, width, height, 9)
  const newEditor2 = Editor.setText(newEditor1, content)
  let newEditor3

  if (lineToReveal && columnToReveal) {
    const delta = lineToReveal * rowHeight
    // TODO scroll to this line
    newEditor3 = await EditorScrolling.setDeltaY(newEditor2, delta)
  } else {
    newEditor3 = await EditorScrolling.setDeltaY(newEditor2, 0)
  }

  const syncIncremental = SyncIncremental.getEnabled()
  const { textInfos, differences } = await EditorText.getVisible(newEditor3, syncIncremental)
  const newEditor4 = {
    ...newEditor3,
    focused: true,
    focus: WhenExpression.FocusEditorText,
    textInfos,
    differences,
  }

  EditorState.set(id, emptyEditor, newEditor4)

  // TODO only sync when needed
  // e.g. it might not always be necessary to send text to extension host worker
  // @ts-ignore
  await ExtensionHostWorker.invoke(ExtensionHostCommandType.TextDocumentSyncFull, uri, id, languageId, content)

  // TODO await promise
  if (diagnosticsEnabled) {
    await UpdateDiagnostics.updateDiagnostics(newEditor4)
  }
}
