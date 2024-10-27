import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/TabCompletion/TabCompletion.ts', () => {
  return {
    getTabCompletion: jest.fn(),
  }
})

const HandleTab = await import('../src/parts/HandleTab/HandleTab.ts')
const TabCompletion = await import('../src/parts/TabCompletion/TabCompletion.ts')

test('handleTab - no result', async () => {
  jest.spyOn(TabCompletion, 'getTabCompletion').mockResolvedValue(undefined)
  const editor = {
    lines: ['a'],
    primarySelectionIndex: 0,
    selections: new Uint32Array([0, 0, 0, 0]),
    undoStack: [],
  }
  const newEditor = await HandleTab.handleTab(editor)
  // TODO two spaces should be inserted
  expect(newEditor).toBe(editor)
})

test('handleTab - apply result', async () => {
  jest.spyOn(TabCompletion, 'getTabCompletion').mockResolvedValue({
    deleted: 6,
    inserted: '<button>$0</button>',
    type: 2,
  })
  const editor = {
    lines: ['button'],
    primarySelectionIndex: 0,
    selections: new Uint32Array([0, 0, 0, 0]),
    undoStack: [],
  }
  const newEditor = await HandleTab.handleTab(editor)
  // TODO
  expect(newEditor.lines).toEqual(['<button></button>button'])
})
