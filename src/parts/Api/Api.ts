interface EventMap {
  'ColorPicker.loadContent': (state: any) => Promise<any>
  'ColorPicker.handleSliderPointerDown': (state: any, x: number, y: number) => Promise<any>
  'ColorPicker.handleSliderPointerMove': (state: any, x: number, y: number) => Promise<any>
  'EditorCompletion.loadContent': (editorUid: number, state: any) => Promise<any>
  'EditorCompletion.selectCurrent': (editorUid: number, state: any) => Promise<any>
  'EditorCompletion.selectIndex': (editorUid: number, state: any, index: number) => Promise<any>
  'Hover.getHoverInfo': (editorUid: number, position: any) => Promise<any>
  'Font.ensure': (fontName: string, fontUrl: string) => Promise<void>
  'Editor.create': (options: any) => Promise<void>
  'Editor.render': (editorUid: number) => Promise<any>
  'FindWidget.loadContent': (editorUid: number) => Promise<any>
  'FindWidget.handleInput': (state: any, value: string) => Promise<any>
  'FindWidget.focusIndex': (state: any, index: number) => Promise<any>
  'FindWidget.focusFirst': (state: any) => Promise<any>
  'FindWidget.focusLast': (state: any) => Promise<any>
  'FindWidget.focusNext': (state: any) => Promise<any>
  'FindWidget.focusPrevious': (state: any) => Promise<any>
  'Editor.offsetAt': (textDocument: any, positionRowIndex: number, positionColumnIndex: number) => Promise<any>
}

export interface EditorWorker {
  readonly invoke: <K extends keyof EventMap>(method: K, ...params: Parameters<EventMap[K]>) => Promise<any>
}
