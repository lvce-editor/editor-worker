import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.ts'

export const handleContextMenu = async (editor: any, button: any, x: number, y: number) => {
  await RendererWorker.invoke(/* ContextMenu.show */ 'ContextMenu.show', /* x */ x, /* y */ y, /* id */ MenuEntryId.Editor)
  return editor
}
