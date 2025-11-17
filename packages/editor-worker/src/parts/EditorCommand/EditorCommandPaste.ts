import * as Assert from '../Assert/Assert.ts'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as EditorPasteText from './EditorCommandPasteText.ts'

export const paste = async (editor: any) => {
  // @ts-ignore
  const text = await RendererWorker.invoke('ClipBoard.readText')
  Assert.string(text)
  return EditorPasteText.pasteText(editor, text)
}
