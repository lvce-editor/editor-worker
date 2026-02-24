import { WhenExpression } from '@lvce-editor/constants'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { EditorState } from '../State/State.ts'
import * as Editor from '../Editor/Editor.ts'
import * as EditorText from '../EditorText/EditorText.ts'
import * as ExtensionHostCommandType from '../ExtensionHostCommandType/ExtensionHostCommandType.ts'
import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.ts'
import { getEditorPreferences } from '../GetEditorPreferences/GetEditorPreferences.ts'
import { getLanguageId } from '../GetLanguageId/GetLanguageId.ts'
import { getLanguages } from '../GetLanguages/GetLanguages.ts'
import * as LinkDetection from '../LinkDetection/LinkDetection.ts'
import * as MeasureCharacterWidth from '../MeasureCharacterWidth/MeasureCharacterWidth.ts'
import * as Preferences from '../Preferences/Preferences.ts'
import * as SyncIncremental from '../SyncIncremental/SyncIncremental.ts'
import * as Tokenizer from '../Tokenizer/Tokenizer.ts'
import * as TokenizerMap from '../TokenizerMap/TokenizerMap.ts'
import * as UpdateDiagnostics from '../UpdateDiagnostics/UpdateDiagnostics.ts'

const getTokenizePath = (languages: readonly any[], languageId: string): string => {
  for (const language of languages) {
    if (language?.id === languageId) {
      return language.tokenize || ''
    }
  }
  return ''
}

export const loadContent = async (state: EditorState, savedState: unknown) => {
  const { assetDir, height, id, platform, uri, width, x, y } = state
  const {
    completionTriggerCharacters,
    diagnosticsEnabled,
    fontFamily,
    fontSize,
    fontWeight,
    isAutoClosingBracketsEnabled,
    isAutoClosingQuotesEnabled,
    isAutoClosingTagsEnabled,
    isQuickSuggestionsEnabled,
    letterSpacing,
    lineNumbers,
    rowHeight,
    tabSize,
  } = await getEditorPreferences()
  // TODO support overwriting language id by setting it explicitly or via settings
  const charWidth = await MeasureCharacterWidth.measureCharacterWidth(fontWeight, fontSize, fontFamily, letterSpacing)
  const languages = await getLanguages(platform, assetDir)
  const computedLanguageId = getLanguageId(uri, languages)
  const tokenizePath = getTokenizePath(languages, computedLanguageId)
  await Tokenizer.loadTokenizer(computedLanguageId, tokenizePath)
  const tokenizer = Tokenizer.getTokenizer(computedLanguageId)
  const newTokenizerId = state.tokenizerId + 1
  TokenizerMap.set(newTokenizerId, tokenizer)
  const newEditor0: EditorState = {
    ...state,
    charWidth,
    completionTriggerCharacters,
    diagnosticsEnabled,
    fontFamily,
    fontSize,
    fontWeight,
    isAutoClosingBracketsEnabled,
    isAutoClosingQuotesEnabled,
    isAutoClosingTagsEnabled,
    isQuickSuggestionsEnabled,
    languageId: computedLanguageId,
    letterSpacing,
    lineNumbers,
    rowHeight,
    tabSize,
    tokenizerId: newTokenizerId,
  }
  const content = await RendererWorker.readFile(uri)

  // TODO avoid creating intermediate editors here
  const newEditor1 = Editor.setBounds(newEditor0, x, y, width, height, 9)
  const newEditor2 = Editor.setText(newEditor1, content)
  let newEditor3 = newEditor2

  // Detect links and initialize decorations
  const linkDecorations = LinkDetection.detectAllLinksAsDecorations(newEditor3)
  const newEditor3WithLinks = {
    ...newEditor3,
    decorations: linkDecorations,
  }

  const syncIncremental = SyncIncremental.getEnabled()
  const { differences, textInfos } = await EditorText.getVisible(newEditor3WithLinks, syncIncremental)
  const newEditor4 = {
    ...newEditor3WithLinks,
    differences,
    focus: WhenExpression.FocusEditorText,
    focused: true,
    textInfos,
  }

  // TODO only sync when needed
  // e.g. it might not always be necessary to send text to extension host worker
  // @ts-ignore
  await ExtensionHostWorker.invoke(ExtensionHostCommandType.TextDocumentSyncFull, uri, id, computedLanguageId, content)

  // TODO await promise
  if (diagnosticsEnabled) {
    await UpdateDiagnostics.updateDiagnostics(newEditor4)
  }

  const completionsOnTypeRaw = await Preferences.get('editor.completionsOnType')
  const completionsOnType = Boolean(completionsOnTypeRaw)
  const newEditor5: EditorState = {
    ...newEditor4,
    completionsOnType,
    initial: false,
  }
  return newEditor5
}
