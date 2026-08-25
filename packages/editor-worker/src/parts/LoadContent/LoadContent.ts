import { WhenExpression } from '@lvce-editor/constants'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { EditorState } from '../State/State.ts'
import * as Editor from '../Editor/Editor.ts'
import * as EditorStates from '../EditorStates/EditorStates.ts'
import * as EditorText from '../EditorText/EditorText.ts'
import { getDocumentSymbols } from '../GetDocumentSymbols/GetDocumentSymbols.ts'
import { getEditorPreferences } from '../GetEditorPreferences/GetEditorPreferences.ts'
import { getEndOfLine } from '../GetEndOfLine/GetEndOfLine.ts'
import { getLanguageId } from '../GetLanguageId/GetLanguageId.ts'
import { getLanguages } from '../GetLanguages/GetLanguages.ts'
import * as LinkDetection from '../LinkDetection/LinkDetection.ts'
import * as MeasureCharacterWidth from '../MeasureCharacterWidth/MeasureCharacterWidth.ts'
import { normalizeLineEndings } from '../NormalizeLineEndings/NormalizeLineEndings.ts'
import * as Preferences from '../Preferences/Preferences.ts'
import * as SyncIncremental from '../SyncIncremental/SyncIncremental.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'
import * as Tokenizer from '../Tokenizer/Tokenizer.ts'
import * as TokenizerMap from '../TokenizerMap/TokenizerMap.ts'
import * as TokenizerState from '../TokenizerState/TokenizerState.ts'

const getWorkspaceUri = async (): Promise<string> => {
  try {
    return await RendererWorker.invoke('Workspace.getPath')
  } catch {
    return ''
  }
}

const getTokenizePath = (languages: readonly any[], languageId: string): string => {
  for (const language of languages) {
    if (language?.id === languageId && language.tokenize) {
      return language.tokenize
    }
  }
  return ''
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }
  return String(error)
}

const getSavedHistory = (
  savedState: unknown,
  content: string,
): { readonly redoStack: readonly any[]; readonly undoStack: readonly any[] } | undefined => {
  if (!savedState || typeof savedState !== 'object') {
    return undefined
  }
  const { lines, redoStack, undoStack } = savedState as Record<string, unknown>
  if (!Array.isArray(lines) || lines.some((line) => typeof line !== 'string') || lines.join('\n') !== content) {
    return undefined
  }
  if (!Array.isArray(redoStack) || !Array.isArray(undoStack)) {
    return undefined
  }
  return { redoStack, undoStack }
}

export const loadContent = async (state: EditorState, savedState: unknown) => {
  const { assetDir, height, id, platform, uri, width, x, y } = state
  const {
    breadcrumbsEnabled,
    completionTriggerCharacters,
    diagnosticsEnabled,
    dragAndDropEnabled,
    fontFamily,
    fontSize,
    fontWeight,
    highlightActiveLineNumber,
    hoverEnabled,
    insertSpaces,
    isAutoClosingBracketsEnabled,
    isAutoClosingQuotesEnabled,
    isAutoClosingTagsEnabled,
    isQuickSuggestionsEnabled,
    letterSpacing,
    lineNumbers,
    mergeConflictActionsEnabled,
    minimapEnabled,
    rowHeight,
    tabSize,
  } = await getEditorPreferences()
  // TODO support overwriting language id by setting it explicitly or via settings
  const charWidth = await MeasureCharacterWidth.measureCharacterWidth(fontWeight, fontSize, fontFamily, letterSpacing)
  const languages = await getLanguages(platform, assetDir)
  TokenizerState.setTokenizePaths(languages)
  const computedLanguageId = getLanguageId(uri, languages)
  const tokenizePath = getTokenizePath(languages, computedLanguageId)
  await Tokenizer.loadTokenizer(computedLanguageId, tokenizePath)
  const tokenizer = Tokenizer.getTokenizer(computedLanguageId)
  const newTokenizerId = state.tokenizerId + 1
  TokenizerMap.set(newTokenizerId, tokenizer)
  const newEditor0: EditorState = {
    ...state,
    breadcrumbsEnabled,
    charWidth,
    completionTriggerCharacters,
    diagnosticsEnabled,
    dragAndDropEnabled,
    fontFamily,
    fontSize,
    fontWeight,
    highlightActiveLineNumber,
    hoverEnabled,
    insertSpaces,
    isAutoClosingBracketsEnabled,
    isAutoClosingQuotesEnabled,
    isAutoClosingTagsEnabled,
    isQuickSuggestionsEnabled,
    languageId: computedLanguageId,
    letterSpacing,
    lineNumbers,
    loadError: '',
    mergeConflictActionsEnabled,
    minimapEnabled,
    rowHeight,
    tabSize,
    tokenizerId: newTokenizerId,
  }
  let existingEditor: EditorState | undefined
  for (const key of EditorStates.getKeys()) {
    const editor = EditorStates.get(Number(key))?.newState
    if (editor && editor.id !== id && !editor.initial && editor.uri === uri) {
      existingEditor = editor
      break
    }
  }
  let content = existingEditor ? TextDocument.getText(existingEditor) : ''
  let endOfLine = existingEditor?.endOfLine || 'lf'
  try {
    if (!existingEditor) {
      content = await RendererWorker.readFile(uri)
      endOfLine = getEndOfLine(content)
      content = normalizeLineEndings(content)
    }
  } catch (error) {
    const newEditor1 = Editor.setBounds(newEditor0, x, y, width, height, 9)
    return {
      ...newEditor1,
      differences: [],
      focus: WhenExpression.FocusEditorText,
      focused: true,
      initial: false,
      loadError: getErrorMessage(error),
      textInfos: [],
    }
  }

  const savedHistory = existingEditor ? undefined : getSavedHistory(savedState, content)

  // TODO avoid creating intermediate editors here
  const newEditor1 = Editor.setBounds({ ...newEditor0, endOfLine }, x, y, width, height, 9)
  const newEditor2 = Editor.setText(newEditor1, content)
  let newEditor3 = newEditor2

  // Detect links and initialize decorations
  const linkDecorations = LinkDetection.detectAllLinksAsDecorations(newEditor3)
  const newEditor3WithLinks = {
    ...newEditor3,
    decorations: linkDecorations,
  }

  let documentSymbols = state.documentSymbols || []
  let workspaceUri = state.workspaceUri || ''
  if (breadcrumbsEnabled) {
    ;[documentSymbols, workspaceUri] = await Promise.all([getDocumentSymbols(newEditor3WithLinks), getWorkspaceUri()])
  }
  const newEditor3WithBreadcrumbs = {
    ...newEditor3WithLinks,
    documentSymbols,
    workspaceUri,
  }

  const syncIncremental = SyncIncremental.getEnabled()
  const { differences, textInfos } = await EditorText.getVisible(newEditor3WithBreadcrumbs, syncIncremental)
  const newEditor4 = {
    ...newEditor3WithBreadcrumbs,
    differences,
    focus: WhenExpression.FocusEditorText,
    focused: true,
    textInfos,
  }

  const completionsOnTypeRaw = await Preferences.get('editor.completionsOnType')
  const completionsOnType = Boolean(completionsOnTypeRaw)
  const newEditor5: EditorState = {
    ...newEditor4,
    completionsOnType,
    initial: false,
    modified: existingEditor?.modified || false,
    redoStack: existingEditor?.redoStack || savedHistory?.redoStack || [],
    undoStack: existingEditor?.undoStack || savedHistory?.undoStack || [],
  }
  return newEditor5
}
