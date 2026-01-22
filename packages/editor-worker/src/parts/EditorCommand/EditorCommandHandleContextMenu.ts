import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { EditorState } from '../State/State.ts'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.ts'

export const handleContextMenu = async (editor: EditorState, button: any, x: number, y: number) => {
  const { uid } = editor
  await RendererWorker.showContextMenu2(uid, MenuEntryId.Editor, x, y, {
    menuId: MenuEntryId.Editor,
  })
  return editor
}
