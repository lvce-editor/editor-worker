import { expect, test } from '@jest/globals'
import { WhenExpression } from '@lvce-editor/constants'
import * as AddWidgetToEditor from '../src/parts/AddWidgetToEditor/AddWidgetToEditor.ts'
import * as EditorCommandBlur from '../src/parts/EditorCommand/EditorCommandBlur.ts'
import * as EditorStates from '../src/parts/EditorStates/EditorStates.ts'

const createDeferred = <T>() => {
  let resolve: (value: T) => void = () => {}
  const promise = new Promise<T>((innerResolve) => {
    resolve = innerResolve
  })
  return {
    promise,
    resolve,
  }
}

const createEditor = (uid: number) => ({
  additionalFocus: 0,
  focus: WhenExpression.FocusEditorText,
  focused: true,
  uid,
  widgets: [],
})

const createFactory = (widgetId: number, widgetUid: number) => () => ({
  id: widgetId,
  oldState: {
    editorUid: 0,
    uid: widgetUid,
  },
  newState: {
    editorUid: 0,
    uid: widgetUid,
  },
})

test('addWidgetToEditor stages full-focus widget before async load resolves', async () => {
  const widgetId = 9001
  const focusKey = 9011
  const editor = createEditor(9101)
  const deferred = createDeferred<any>()
  const promise = AddWidgetToEditor.addWidgetToEditor(
    widgetId,
    focusKey,
    editor,
    createFactory(widgetId, 9201),
    async (state: any) => {
      await deferred.promise
      return {
        ...state,
        loaded: true,
      }
    },
    true,
  )

  const stagedEditor = EditorStates.get(editor.uid).newState

  expect(stagedEditor).toMatchObject({
    additionalFocus: 0,
    focus: focusKey,
    focused: false,
  })
  expect(stagedEditor.widgets).toHaveLength(1)
  expect(stagedEditor.widgets[0].newState).toMatchObject({
    editorUid: editor.uid,
    uid: 9201,
  })

  deferred.resolve({})
  await promise
})

test('addWidgetToEditor makes blur a no-op while full-focus widget is loading', async () => {
  const widgetId = 9002
  const focusKey = 9012
  const editor = createEditor(9102)
  const deferred = createDeferred<any>()
  const promise = AddWidgetToEditor.addWidgetToEditor(
    widgetId,
    focusKey,
    editor,
    createFactory(widgetId, 9202),
    async (state: any) => {
      await deferred.promise
      return state
    },
    true,
  )

  const stagedEditor = EditorStates.get(editor.uid).newState
  const blurredEditor = EditorCommandBlur.handleBlur(stagedEditor)

  expect(blurredEditor).toBe(stagedEditor)

  deferred.resolve({})
  await promise
})

test('addWidgetToEditor hydrates full-focus widget against latest editor state', async () => {
  const widgetId = 9003
  const focusKey = 9013
  const editor = createEditor(9103)
  const deferred = createDeferred<any>()
  const promise = AddWidgetToEditor.addWidgetToEditor(
    widgetId,
    focusKey,
    editor,
    createFactory(widgetId, 9203),
    async (state: any) => {
      await deferred.promise
      return {
        ...state,
        loaded: true,
      }
    },
    true,
  )
  const stagedEditor = EditorStates.get(editor.uid).newState
  const latestEditor = {
    ...stagedEditor,
    latestChange: true,
  }
  EditorStates.set(editor.uid, stagedEditor, latestEditor)

  deferred.resolve({})
  const result = await promise

  expect(result.latestChange).toBe(true)
  expect(result.widgets[0].newState).toMatchObject({
    editorUid: editor.uid,
    loaded: true,
    uid: 9203,
  })
  expect(EditorStates.get(editor.uid).newState).toBe(result)
})

test('addWidgetToEditor does not resurrect full-focus widget removed during async load', async () => {
  const widgetId = 9004
  const focusKey = 9014
  const editor = createEditor(9104)
  const deferred = createDeferred<any>()
  const promise = AddWidgetToEditor.addWidgetToEditor(
    widgetId,
    focusKey,
    editor,
    createFactory(widgetId, 9204),
    async (state: any) => {
      await deferred.promise
      return {
        ...state,
        loaded: true,
      }
    },
    true,
  )
  const stagedEditor = EditorStates.get(editor.uid).newState
  const latestEditor = {
    ...stagedEditor,
    widgets: [],
  }
  EditorStates.set(editor.uid, stagedEditor, latestEditor)

  deferred.resolve({})
  const result = await promise

  expect(result.widgets).toEqual([])
  expect(EditorStates.get(editor.uid).newState.widgets).toEqual([])
})
