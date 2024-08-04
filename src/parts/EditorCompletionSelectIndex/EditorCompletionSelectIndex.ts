import * as Completions from '../Completions/Completions.ts'
import * as ReplaceRange from '../EditorCommand/EditorCommandReplaceRange.ts'
import * as EditorCompletionState from '../EditorCompletionState/EditorCompletionState.ts'
import * as GetCompletionState from '../GetCompletionState/GetCompletionState.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

const getEdits = async (editor: any, completionItem: any) => {
  const child = GetCompletionState.getCompletionState(editor)
  // @ts-ignore
  const { leadingWord, uid } = child
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

const select = async (editor: any, completionItem: any) => {
  const changes = await getEdits(editor, completionItem)
  const index = editor.widgets
    .indexOf
    // ViewletModuleId.EditorCompletion
    ()
  if (index !== -1) {
    editor.widgets.splice(index, 1)
    editor.completionState = EditorCompletionState.None
    editor.completionUid = 0
  }
  // TODO dispose completion widget
  // TODO apply edit in editor worker instead of asking renderer worker
  await RendererWorker.invoke('Editor.applyEdit', changes)
  // await RendererWorker.invoke('Viewlet.dispose', state.uid)
  return editor
}

export const selectIndex = (editor: any, index: number) => {
  const child = GetCompletionState.getCompletionState(editor)

  const { items } = child
  if (index === -1) {
    return editor
  }
  if (index > items.length) {
    throw new Error('index too large')
  }
  const actualIndex = index
  const completionItem = items[actualIndex]
  return select(editor, completionItem)
}
