import { beforeEach, expect, jest, test } from '@jest/globals'

const getVisibleTextMock: any = jest.fn()
const getVisibleSelectionsMock: any = jest.fn()
const getSyncIncrementalEnabledMock: any = jest.fn()

jest.unstable_mockModule('../src/parts/EditorText/EditorText.ts', () => ({
  getVisible: getVisibleTextMock,
}))

jest.unstable_mockModule('../src/parts/EditorSelection/EditorSelection.ts', () => ({
  getVisible: getVisibleSelectionsMock,
}))

jest.unstable_mockModule('../src/parts/SyncIncremental/SyncIncremental.ts', () => ({
  getEnabled: getSyncIncrementalEnabledMock,
}))

const UpdateDerivedState = await import('../src/parts/UpdateDerivedState/UpdateDerivedState.ts')

beforeEach(() => {
  getVisibleTextMock.mockReset()
  getVisibleSelectionsMock.mockReset()
  getSyncIncrementalEnabledMock.mockReset()
  getSyncIncrementalEnabledMock.mockReturnValue(false)
})

test('updateDerivedState recomputes visible text data when lines changed but textInfos are stale', async () => {
  const oldTextInfos = [['old']]
  const oldDifferences = [['old-diff']]
  const oldState: any = {
    cursorWidth: 2,
    differences: oldDifferences,
    focused: true,
    fontFamily: 'Fira Code',
    fontSize: 14,
    fontWeight: 400,
    isMonospaceFont: true,
    letterSpacing: 0,
    lines: ['a'],
    maxLineY: 1,
    minLineY: 0,
    rowHeight: 20,
    selections: new Uint32Array([0, 0, 0, 0]),
    tabSize: 2,
    textInfos: oldTextInfos,
    width: 100,
  }
  const newState: any = {
    ...oldState,
    lines: ['aaaaa'],
  }
  getVisibleTextMock.mockResolvedValue({
    differences: [['new-diff']],
    textInfos: [['new']],
  })
  getVisibleSelectionsMock.mockResolvedValue({
    cursorInfos: ['cursor'],
    selectionInfos: ['selection'],
  })

  const result = await UpdateDerivedState.updateDerivedState(oldState, newState)

  expect(getVisibleTextMock).toHaveBeenCalledWith(newState, false)
  expect(result).toMatchObject({
    cursorInfos: ['cursor'],
    differences: [['new-diff']],
    selectionInfos: ['selection'],
    textInfos: [['new']],
  })
})

test('updateDerivedState skips visible text recomputation when textInfos are already fresh', async () => {
  const oldState: any = {
    cursorWidth: 2,
    differences: [['old-diff']],
    focused: true,
    fontFamily: 'Fira Code',
    fontSize: 14,
    fontWeight: 400,
    isMonospaceFont: true,
    letterSpacing: 0,
    lines: ['a'],
    maxLineY: 1,
    minLineY: 0,
    rowHeight: 20,
    selections: new Uint32Array([0, 0, 0, 0]),
    tabSize: 2,
    textInfos: [['old']],
    width: 100,
  }
  const newState: any = {
    ...oldState,
    cursorWidth: 3,
    differences: [['new-diff']],
    textInfos: [['new']],
  }
  getVisibleSelectionsMock.mockResolvedValue({
    cursorInfos: ['cursor'],
    selectionInfos: ['selection'],
  })

  await UpdateDerivedState.updateDerivedState(oldState, newState)

  expect(getVisibleTextMock).not.toHaveBeenCalled()
})
