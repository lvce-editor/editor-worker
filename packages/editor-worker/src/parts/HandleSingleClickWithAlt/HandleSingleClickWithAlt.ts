import * as EditorGoToDefinition from '../EditorCommand/EditorCommandGoToDefinition.ts'
import * as LinkDetection from '../LinkDetection/LinkDetection.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'
import { openExternal } from './OpenExternal.ts'

// TODO first change cursor position, then run go to definition
// cursor should appear at mousedown position immediately
export const handleSingleClickWithAlt = async (editor: any, position: any) => {
  const { columnIndex, rowIndex } = position
  console.log({ columnIndex, rowIndex })

  // Check if the click is on a link
  const offset = TextDocument.offsetAt(editor, rowIndex, columnIndex)
  const url = LinkDetection.getUrlAtOffset(editor, offset)

  console.log({ url })
  if (url) {
    // Open the link
    await openExternal(url)
    return editor
  }

  // Otherwise, perform the default go to definition
  const newEditor = { ...editor, selections: new Uint32Array([rowIndex, columnIndex, rowIndex, columnIndex]) }
  const newEditor2 = await EditorGoToDefinition.goToDefinition(newEditor)
  return newEditor2
}
