import { WidgetId } from '@lvce-editor/constants'
import type { IFindWidget } from '../IFindWidget/IFindWidget.ts'
import * as Id from '../Id/Id.ts'

export const create = (): IFindWidget => {
  const uid = Id.create()
  const widget: IFindWidget = {
    id: WidgetId.Find,
    newState: {
      commands: [],
      editorUid: 0,
      height: 0,
      uid,
      width: 0,
      x: 0,
      y: 0,
    },
    oldState: {
      commands: [],
      editorUid: 0,
      height: 0,
      uid,
      width: 0,
      x: 0,
      y: 0,
    },
  }
  return widget
}
