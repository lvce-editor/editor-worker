import { beforeEach, expect, jest, test } from '@jest/globals'
import { PlatformType } from '@lvce-editor/constants'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { EditorState } from '../src/parts/State/State.ts'

const getPreferenceMock = jest.fn<(key: string) => Promise<string>>()

jest.unstable_mockModule('../src/parts/Preferences/Preferences.ts', () => ({
  get: getPreferenceMock,
}))

const EditorCommandBlur = await import('../src/parts/EditorCommand/EditorCommandBlur.ts')
const WidgetRevision = await import('../src/parts/WidgetRevision/WidgetRevision.ts')

beforeEach(() => {
  getPreferenceMock.mockReset()
  WidgetRevision.reset()
})

test('handleBlur does not try to save a readonly file', async () => {
  getPreferenceMock.mockResolvedValue('onFocusChange')
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.isReadonly': async () => true,
    'FileSystem.writeFile': async () => {},
    'Main.handleModifiedStatusChange': async () => {},
  })
  const editor = {
    additionalFocus: 0,
    focused: true,
    lines: ['# Startup Performance'],
    modified: true,
    platform: PlatformType.Electron,
    uid: 1,
    uri: 'app://startup-performance',
    widgets: [],
  } as unknown as EditorState

  const result = await EditorCommandBlur.handleBlur(editor)

  expect(result).toEqual({
    ...editor,
    focused: false,
    widgetRevision: 1,
  })
  expect(mockRpc.invocations).toEqual([['FileSystem.isReadonly', 'app://startup-performance']])
})
