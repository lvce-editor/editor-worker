import { beforeEach, expect, test } from '@jest/globals'
import { WhenExpression } from '@lvce-editor/constants'
import * as AddWidgetToEditor from '../src/parts/AddWidgetToEditor/AddWidgetToEditor.ts'
import * as EditorCommandBlur from '../src/parts/EditorCommand/EditorCommandBlur.ts'
import * as EditorCommandCloseFind from '../src/parts/EditorCommand/EditorCommandCloseFind.ts'
import * as EditorStates from '../src/parts/EditorStates/EditorStates.ts'
import * as RenderWidgets from '../src/parts/RenderWidgets/RenderWidgets.ts'
import * as WidgetRegistry from '../src/parts/WidgetRegistry/WidgetRegistry.ts'
import * as WidgetRevision from '../src/parts/WidgetRevision/WidgetRevision.ts'

beforeEach(() => {
  WidgetRevision.reset()
})

const createDeferred = <T>() => {
  const { promise, resolve } = Promise.withResolvers<T>()
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
  newState: {
    editorUid: 0,
    uid: widgetUid,
  },
  oldState: {
    editorUid: 0,
    uid: widgetUid,
  },
})

const noGeneratedState = (_state: { editorUid: number }): undefined => undefined

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
  const blurredEditor = await EditorCommandBlur.handleBlur(stagedEditor)

  expect(blurredEditor).toBe(stagedEditor)

  deferred.resolve({})
  await promise
})

test('addWidgetToEditor hydrates full-focus widget against latest state after another revision', async () => {
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
    widgetRevision: WidgetRevision.next(editor.uid),
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
    widgetRevision: WidgetRevision.next(editor.uid),
    widgets: [],
  }
  EditorStates.set(editor.uid, stagedEditor, latestEditor)

  deferred.resolve({})
  const result = await promise

  expect(result.widgets).toEqual([])
  expect(EditorStates.get(editor.uid).newState.widgets).toEqual([])
})

test('addWidgetToEditor restores staged full-focus widget after a stale editor update', async () => {
  const widgetId = 9005
  const focusKey = 9015
  const editor = createEditor(9105)
  const deferred = createDeferred<any>()
  const promise = AddWidgetToEditor.addWidgetToEditor(
    widgetId,
    focusKey,
    editor,
    createFactory(widgetId, 9205),
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
    widgetRevision: WidgetRevision.next(editor.uid),
    widgets: editor.widgets,
  }
  EditorStates.set(editor.uid, stagedEditor, latestEditor)

  deferred.resolve({})
  const result = await promise

  expect(result.widgets[0].newState).toMatchObject({ loaded: true, uid: 9205 })
})

test('addWidgetToEditor does not add a widget without generated state', async () => {
  const editor = {
    uid: 42,
    widgets: [],
  }
  const widget = {
    id: 1,
    newState: {
      editorUid: 0,
    },
    oldState: {
      editorUid: 0,
    },
  }
  const result = await AddWidgetToEditor.addWidgetToEditor(1, 2, editor, () => widget, noGeneratedState)

  expect(result).toBe(editor)
  expect(result.widgets).toEqual([])
})

test('closing a widget while it opens prevents the delayed result from resurrecting it', async () => {
  const { promise: statePromise, resolve: resolveState } = Promise.withResolvers<{ uid: number }>()
  const editor = {
    uid: 42,
    widgetRevision: 0,
    widgets: [],
  }
  const widget = {
    id: 1,
    newState: { editorUid: 0, uid: 10 },
    oldState: { editorUid: 0, uid: 10 },
  }

  const opening = AddWidgetToEditor.addWidgetToEditor(
    1,
    2,
    editor,
    () => widget,
    () => statePromise,
  )
  expect(EditorCommandCloseFind.closeFind(editor)).toBe(editor)
  resolveState({ uid: 10 })
  const result = await opening

  expect(result).toBe(editor)
  expect(result.widgets).toEqual([])
})

test('loading a full-focus widget preserves the rendered baseline until its root is mounted', async () => {
  const widgetId = 9006
  const editor = createEditor(9106)
  const renderedEditor = { ...editor, previouslyRendered: true }
  EditorStates.set(editor.uid, renderedEditor as any, editor as any)
  WidgetRegistry.set(widgetId, {
    add: () => [['Viewlet.createFunctionalRoot', 'FindWidget', 9206, true]],
    render: () => [['update-widget', 9206]],
  })

  const result = await AddWidgetToEditor.addWidgetToEditor(widgetId, 9016, editor, createFactory(widgetId, 9206), async (state) => state, true)
  const instance = EditorStates.get(editor.uid)

  expect(instance.oldState).toBe(renderedEditor)
  expect(RenderWidgets.renderWidgets(instance.oldState, result)).toContainEqual(['Viewlet.createFunctionalRoot', 'FindWidget', 9206, true])
})
