import type { FindWidgetState } from '../FindWidgetState/FindWidgetState.ts'
import * as FindWidgetWorker from '../FindWidgetWorker/FindWidgetWorker.ts'
import * as GetEditor from '../GetEditor/GetEditor.ts'

export const loadContent = async (state: FindWidgetState, parentUid: number): Promise<FindWidgetState> => {
  const { uid } = state
  const editor = GetEditor.getEditor(parentUid)
  const { x, y, width, height } = editor
  await FindWidgetWorker.launch()
  await FindWidgetWorker.invoke('FindWidget.create', uid, x, y, width, height, parentUid)
  await FindWidgetWorker.invoke('FindWidget.loadContent', uid)
  const diff = await FindWidgetWorker.invoke('FindWidget.diff2', uid)
  const commands = await FindWidgetWorker.invoke('FindWidget.render2', uid, diff)
  return {
    ...state,
    commands,
  }
}

export const close = async (state: FindWidgetState) => {
  // TODO
  // await Viewlet.closeWidget(uid)
  return {
    ...state,
    disposed: true,
  }
}
