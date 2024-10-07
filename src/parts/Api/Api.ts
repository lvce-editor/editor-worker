interface EventMap {
  'ColorPicker.handleSliderPointerDown': (state: any, x: number, y: number) => Promise<any>
  'ColorPicker.handleSliderPointerMove': (state: any, x: number, y: number) => Promise<any>
  'ColorPicker.loadContent': (state: any) => Promise<any>
  'ColorPicker.render': (oldState: any, newState: any) => Promise<any>
  'Editor.create': (options: any) => Promise<void>
  'Editor.offsetAt': (textDocument: any, positionRowIndex: number, positionColumnIndex: number) => Promise<any>
  'Editor.render': (editorUid: number) => Promise<any>
  'EditorCompletion.loadContent': (editorUid: number, state: any) => Promise<any>
  'EditorCompletion.selectCurrent': (editorUid: number, state: any) => Promise<any>
  'EditorCompletion.selectIndex': (editorUid: number, state: any, index: number) => Promise<any>
  'EditorCompletion.openDetails': (editorUid: number, state: any) => Promise<any>
  'EditorCompletion.closeDetails': (editorUid: number, state: any) => Promise<any>
  'EditorCompletion.toggleDetails': (editorUid: number, state: any) => Promise<any>
  'FindWidget.focusFirst': (state: any) => Promise<any>
  'FindWidget.focusIndex': (state: any, index: number) => Promise<any>
  'FindWidget.focusLast': (state: any) => Promise<any>
  'FindWidget.focusNext': (state: any) => Promise<any>
  'FindWidget.focusPrevious': (state: any) => Promise<any>
  'FindWidget.handleInput': (state: any, value: string) => Promise<any>
  'FindWidget.loadContent': (editorUid: number) => Promise<any>
  'Font.ensure': (fontName: string, fontUrl: string) => Promise<void>
  'Hover.getHoverInfo': (editorUid: number, position: any) => Promise<any>
  'Hover.handleSashPointerDown': (state: any, eventX: number, eventY: number) => Promise<any>
  'Hover.handleSashPointerMove': (state: any, eventX: number, eventY: number) => Promise<any>
  'Hover.handleSashPointerUp': (state: any, eventX: number, eventY: number) => Promise<any>
  'Hover.loadContent': (editorUid: number, state: any, position: any) => Promise<any>
  'Hover.render': (oldState: any, newState: any) => Promise<any>
}

export interface EditorWorkerApi {
  readonly invoke: <K extends keyof EventMap>(method: K, ...params: Parameters<EventMap[K]>) => Promise<any>
}
