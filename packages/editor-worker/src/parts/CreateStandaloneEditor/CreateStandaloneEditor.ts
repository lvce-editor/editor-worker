import { WhenExpression } from '@lvce-editor/constants'
import { createEditor2 } from '../CreateEditor2/CreateEditor2.ts'
import * as Editor from '../Editor/Editor.ts'
import * as EditorSelection from '../EditorSelection/EditorSelection.ts'
import * as EditorStates from '../EditorStates/EditorStates.ts'
import * as EditorText from '../EditorText/EditorText.ts'
import * as Tokenizer from '../Tokenizer/Tokenizer.ts'
import * as TokenizerMap from '../TokenizerMap/TokenizerMap.ts'

export interface StandaloneEditorOptions {
  readonly assetDir: string
  readonly charWidth: number
  readonly content: string
  readonly fontFamily: string
  readonly fontSize: number
  readonly fontWeight: number
  readonly height: number
  readonly id: number
  readonly languageId: string
  readonly letterSpacing: number
  readonly lineNumbers: boolean
  readonly platform: number
  readonly rowHeight: number
  readonly tabSize: number
  readonly tokenizePath: string
  readonly uri: string
  readonly width: number
  readonly x: number
  readonly y: number
}

export const createStandaloneEditor = async ({
  assetDir,
  charWidth,
  content,
  fontFamily,
  fontSize,
  fontWeight,
  height,
  id,
  languageId,
  letterSpacing,
  lineNumbers,
  platform,
  rowHeight,
  tabSize,
  tokenizePath,
  uri,
  width,
  x,
  y,
}: StandaloneEditorOptions): Promise<void> => {
  createEditor2(id, uri, x, y, width, height, platform, assetDir)
  const createdEditor = EditorStates.get(id).newState

  await Tokenizer.loadTokenizer(languageId, tokenizePath)
  const tokenizerId = createdEditor.tokenizerId + 1
  TokenizerMap.set(tokenizerId, Tokenizer.getTokenizer(languageId))

  const configuredEditor = {
    ...createdEditor,
    charWidth,
    columnWidth: charWidth,
    completionsOnType: false,
    focus: WhenExpression.FocusEditorText,
    focused: true,
    fontFamily,
    fontSize,
    fontWeight,
    initial: false,
    isMonospaceFont: true,
    itemHeight: rowHeight,
    languageId,
    letterSpacing,
    lineNumbers,
    rowHeight,
    selections: new Uint32Array([0, 0, 0, 0]),
    tabSize,
    tokenizerId,
  }
  const boundedEditor = Editor.setBounds(configuredEditor, x, y, width, height, charWidth)
  const editorWithText = Editor.setText(boundedEditor, content)
  const { differences, textInfos } = await EditorText.getVisible(editorWithText, true)
  const editorWithVisibleText = {
    ...editorWithText,
    differences,
    textInfos,
  }
  const { cursorInfos, selectionInfos } = await EditorSelection.getVisible(editorWithVisibleText)
  const finalEditor = {
    ...editorWithVisibleText,
    cursorInfos,
    selectionInfos,
  }
  EditorStates.set(id, createdEditor, finalEditor)
}
