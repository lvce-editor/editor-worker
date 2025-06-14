import type { EditorCreateOptions } from '../EditorCreateOptions/EditorCreateOptions.ts'
import * as Assert from '../Assert/Assert.ts'
import * as Editor from '../Editor/Editor.ts'
import * as EditorState from '../Editors/Editors.ts'
import * as EditorScrolling from '../EditorScrolling/EditorScrolling.ts'
import * as ExtensionHostCommandType from '../ExtensionHostCommandType/ExtensionHostCommandType.ts'
import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.ts'
import * as FocusKey from '../FocusKey/FocusKey.ts'
import * as MeasureCharacterWidth from '../MeasureCharacterWidth/MeasureCharacterWidth.ts'
import * as UpdateDiagnostics from '../UpdateDiagnostics/UpdateDiagnostics.ts'

const emptyEditor = {
  uri: '',
  languageId: '', // TODO use numeric language id?
  lines: [],
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  tokenizerId: 0,
  minLineY: 0,
  decorations: [],
  embeds: [],
  deltaX: 0,
  focused: false,
  deltaY: 0,
  scrollBarHeight: 0,
  longestLineWidth: 0,
  maxLineY: 0,
  undoStack: [],
  lineCache: [],
  selections: new Uint32Array(),
  diagnostics: [],
  highlightedLine: -1,
  debugEnabled: false,
}

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
  const charWidth = MeasureCharacterWidth.measureCharacterWidth(fontWeight, fontSize, fontFamily, letterSpacing)
  const editor = {
    uri,
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
    tokenizerId: 0,
    minLineY: 0,
    maxLineY: 0,
    lines: [],
    undoStack: [],
    lineCache: [],
    selections: new Uint32Array(),
    diagnostics: [],
    decorations: [],
    primarySelectionIndex: 0,
    deltaX: 0,
    deltaY: 0,
    numberOfVisiblelines: 0,
    finalY: 0,
    finalDeltaY: 0,
    columnWidth: 0,
    rowHeight,
    scrollBarWidth: 0,
    scrollBarHeight: 0,
    validLines: [],
    invalidStartIndex: 0,
    focused: false,
    handleOffsetX: 0,
    itemHeight: 20,
    fontFamily,
    fontWeight,
    tabSize,
    fontSize,
    cursorWidth: 2,
    completionState: '',
    longestLineWidth: 0,
    minimumSliderSize: 20,
    differences: [],
    completionUid: 0,
    lineNumbers,
    numberOfVisibleLines: 0,
    isMonospaceFont,
    letterSpacing,
    charWidth,
    uid: id,
    id,
    widgets: [],
    focusKey: FocusKey.Empty,
    diagnosticsEnabled,
  }
  // TODO avoid creating intermediate editors here
  const newEditor1 = Editor.setBounds(editor, x, y, width, height, 9)
  const newEditor2 = Editor.setText(newEditor1, content)
  let newEditor3

  if (lineToReveal && columnToReveal) {
    const delta = lineToReveal * rowHeight
    // TODO scroll to this line
    newEditor3 = EditorScrolling.setDeltaY(newEditor2, delta)
  } else {
    newEditor3 = EditorScrolling.setDeltaY(newEditor2, 0)
  }
  const newEditor4 = {
    ...newEditor3,
    focused: true,
  }
  EditorState.set(id, emptyEditor, newEditor4)
  // @ts-ignore
  await ExtensionHostWorker.invoke(ExtensionHostCommandType.TextDocumentSyncFull, uri, id, languageId, content)

  if (diagnosticsEnabled) {
    UpdateDiagnostics.updateDiagnostics(newEditor4)
  }
}
