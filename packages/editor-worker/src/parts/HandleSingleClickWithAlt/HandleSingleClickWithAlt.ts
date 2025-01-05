import * as EditorGoToDefinition from '../EditorCommand/EditorCommandGoToDefinition.ts'

// TODO first change cursor position, then run go to definition
// cursor should appear at mousedown position immediately
export const handleSingleClickWithAlt = async (editor: any, position: any) => {
  const { rowIndex, columnIndex } = position
  const newEditor = { ...editor, selections: new Uint32Array([rowIndex, columnIndex, rowIndex, columnIndex]) }
  // TODO rectangular selection with alt click,
  // but also go to definition with alt click
  const newEditor2 = await EditorGoToDefinition.goToDefinition(newEditor)
  return newEditor2
}