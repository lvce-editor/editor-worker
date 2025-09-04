import { WidgetId } from '@lvce-editor/constants'
import type { IFindWidget } from '../IFindWidget/IFindWidget.ts'
import * as Id from '../Id/Id.ts'

export const create = (): IFindWidget => {
  const uid = Id.create()
  const widget: IFindWidget = {
    id: WidgetId.Find,
    oldState: {
      uid,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      commands: [],
      editorUid: 0,
    },
    newState: {
      uid,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      commands: [],
      editorUid: 0,
    },
  }
  return widget
}
