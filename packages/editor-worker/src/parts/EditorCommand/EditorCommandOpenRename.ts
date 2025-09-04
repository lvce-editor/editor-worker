import type { RenameState } from '../RenameState/RenameState.ts'
import * as AddWidgetToEditor from '../AddWidgetToEditor/AddWidgetToEditor.ts'
import * as Editors from '../Editors/Editors.ts'
import * as FocusKey from '../FocusKey/FocusKey.ts'
import * as GetPositionAtCursor from '../GetPositionAtCursor/GetPositionAtCursor.ts'
import * as RenameWidgetFactory from '../RenameWidgetFactory/RenameWidgetFactory.ts'
import * as RenameWorker from '../RenameWorker/RenameWorker.ts'
import { WidgetId } from '@lvce-editor/constants'
import * as EditorCommandGetWordAt from './EditorCommandGetWordAt.ts'

const newStateGenerator = async (state: RenameState, parentUid: number): Promise<RenameState> => {
  const { uid, x, y, width, height } = state
  const { newState } = Editors.get(parentUid)
  const { languageId } = newState
  await RenameWorker.invoke('Rename.create', uid, x, y, width, height, parentUid, languageId)
  await RenameWorker.invoke('Rename.loadContent', uid)
  const diff = await RenameWorker.invoke('Rename.diff2', uid)
  const commands = await RenameWorker.invoke('Rename.render2', uid, diff)
  return {
    ...state,
    commands,
  }
}

export const openRename = async (editor: any) => {
  const { rowIndex, columnIndex } = GetPositionAtCursor.getPositionAtCursor(editor)
  const { word } = EditorCommandGetWordAt.getWordAt(editor, rowIndex, columnIndex)
  if (!word) {
    return editor
  }

  const fullFocus = true
  return AddWidgetToEditor.addWidgetToEditor(
    WidgetId.Rename,
    FocusKey.FocusEditorRename,
    editor,
    RenameWidgetFactory.create,
    newStateGenerator,
    fullFocus,
  )
}
