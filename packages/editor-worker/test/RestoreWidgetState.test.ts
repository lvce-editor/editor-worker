import { beforeEach, expect, jest, test } from '@jest/globals'
import { WidgetId } from '@lvce-editor/constants'

const invokeMock: any = jest.fn()

jest.unstable_mockModule('../src/parts/FindWidgetWorker/FindWidgetWorker.ts', () => ({
  invoke: invokeMock,
}))

const EditorStates = await import('../src/parts/EditorStates/EditorStates.ts')
const RestoreWidgetState = await import('../src/parts/RestoreWidgetState/RestoreWidgetState.ts')

beforeEach(() => {
  invokeMock.mockReset()
})

test('restoreWidgetState - skips missing editor key', async () => {
  const result = await RestoreWidgetState.restoreWidgetState(['920001'], Object.create(null))

  expect(result).toEqual([])
  expect(invokeMock).not.toHaveBeenCalled()
})

test('restoreWidgetState - preserves unsupported widgets unchanged', async () => {
  const unsupportedWidget = {
    id: WidgetId.Completion,
    newState: {
      uid: 1,
    },
  }
  const editor = {
    newState: {
      uid: 920_002,
      widgets: [unsupportedWidget],
    },
    oldState: {
      uid: 920_002,
      widgets: [unsupportedWidget],
    },
  }
  EditorStates.set(920_002, editor.oldState, editor.newState)
  const registeredEditor = EditorStates.get(920_002)

  const result = await RestoreWidgetState.restoreWidgetState(['920002'], Object.create(null))

  expect(result).toEqual([registeredEditor])
  expect(result[0]).toBe(registeredEditor)
  expect(invokeMock).not.toHaveBeenCalled()
})

test('restoreWidgetState - restores find widget commands', async () => {
  const savedState = {
    searchValue: 'abc',
  }
  const commands = [['setValue', 'abc']]
  const findWidget = {
    id: WidgetId.Find,
    newState: {
      height: 40,
      uid: 2,
      width: 300,
      x: 10,
      y: 20,
    },
    oldState: {
      uid: 2,
    },
  }
  const editor = {
    newState: {
      uid: 920_003,
      widgets: [findWidget],
    },
    oldState: {
      uid: 920_003,
      widgets: [findWidget],
    },
  }
  EditorStates.set(920_003, editor.oldState, editor.newState)
  const registeredEditor = EditorStates.get(920_003)
  invokeMock.mockImplementation(async (method: string) => {
    if (method === 'FindWidget.diff2') {
      return [1]
    }
    if (method === 'FindWidget.render2') {
      return commands
    }
    return undefined
  })

  const result = await RestoreWidgetState.restoreWidgetState(['920003'], {
    '920003:2': savedState,
  })

  expect(invokeMock).toHaveBeenCalledWith('FindWidget.create', 2, 10, 20, 300, 40, 920_003)
  expect(invokeMock).toHaveBeenCalledWith('FindWidget.loadContent', 2, savedState)
  expect(invokeMock).toHaveBeenCalledWith('FindWidget.diff2', 2)
  expect(invokeMock).toHaveBeenCalledWith('FindWidget.render2', 2, [1])
  expect(result).toEqual([
    {
      ...registeredEditor,
      newState: {
        ...editor.newState,
        widgets: [
          {
            ...findWidget,
            newState: {
              ...findWidget.newState,
              commands,
            },
          },
        ],
      },
    },
  ])
})
