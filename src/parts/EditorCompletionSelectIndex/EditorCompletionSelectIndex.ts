import * as Command from '../Command/Command.ts'
import * as Completions from '../Completions/Completions.ts'
import * as ReplaceRange from '../EditorCommand/EditorCommandReplaceRange.ts'
import * as EditorCompletionState from '../EditorCompletionState/EditorCompletionState.ts'
import * as GetEditor from '../GetEditor/GetEditor.ts'

const getEdits = async (state: any, editor: any, completionItem: any) => {
  // @ts-ignore
  const { leadingWord, uid } = state
  const word = completionItem.label
  const resolvedItem = await Completions.resolveCompletion(editor, word, completionItem)
  const inserted = resolvedItem ? resolvedItem.snippet : word
  // TODO type and dispose commands should be sent to renderer process at the same time
  const { selections } = editor
  const [startRowIndex, startColumnIndex] = selections
  const leadingWordLength = leadingWord.length
  const replaceRange = new Uint32Array([startRowIndex, startColumnIndex - leadingWordLength, startRowIndex, startColumnIndex])
  const changes = ReplaceRange.replaceRange(editor, replaceRange, [inserted], '')
  return changes
}

const select = async (state: any, editor: any, completionItem: any) => {
  const changes = await getEdits(state, editor, completionItem)
  const index = editor.widgets
    .indexOf
    // ViewletModuleId.EditorCompletion
    ()
  if (index !== -1) {
    editor.widgets.splice(index, 1)
    editor.completionState = EditorCompletionState.None
    editor.completionUid = 0
  }
  await Command.execute('Editor.applyEdit', changes)
  // await Viewlet.dispose(uid)
  return state
}

export const selectIndex = (editorUid: number, state: any, index: number) => {
  const editor = GetEditor.getEditor(editorUid)
  const { items } = state
  if (index === -1) {
    return state
  }
  if (index > items.length) {
    throw new Error('index too large')
  }
  const actualIndex = index
  const completionItem = items[actualIndex]
  return select(state, editor, completionItem)
}
