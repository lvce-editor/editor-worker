import * as FocusSource from '../FocusSource/FocusSource.ts'
import * as Id from '../Id/Id.ts'
import type { IFindWidget } from '../IFindWidget/IFindWidget.ts'
import * as WidgetId from '../WidgetId/WidgetId.ts'

export const create = (): IFindWidget => {
  const uid = Id.create()
  const widget: IFindWidget = {
    id: WidgetId.Find,
    oldState: {
      value: '',
      ariaAnnouncement: '',
      matches: new Uint32Array(),
      matchIndex: -1,
      matchCount: 0,
      uid,
      replaceExpanded: false,
      useRegularExpression: false,
      matchCase: false,
      matchWholeWord: false,
      replacement: '',
      editorUid: 0,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      focused: false,
      focusSource: FocusSource.Unknown,
      focus: 0,
    },
    newState: {
      value: '',
      ariaAnnouncement: '',
      matches: new Uint32Array(),
      matchIndex: -1,
      matchCount: 0,
      uid,
      replaceExpanded: false,
      useRegularExpression: false,
      matchCase: false,
      matchWholeWord: false,
      replacement: '',
      editorUid: 0,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      focused: true,
      focusSource: FocusSource.Unknown,
      focus: 0,
    },
  }
  return widget
}
