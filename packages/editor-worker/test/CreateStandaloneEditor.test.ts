import { expect, test } from '@jest/globals'
import { createStandaloneEditor } from '../src/parts/CreateStandaloneEditor/CreateStandaloneEditor.ts'
import { diff2 } from '../src/parts/Diff2/Diff2.ts'
import * as EditorStates from '../src/parts/EditorStates/EditorStates.ts'
import { render2 } from '../src/parts/Render2/Render2.ts'

test('creates a functional standalone editor without workbench services', async () => {
  const id = 901
  await createStandaloneEditor({
    assetDir: '/assets',
    charWidth: 9,
    content: '<h1>Hello</h1>',
    fontFamily: 'monospace',
    fontSize: 15,
    fontWeight: 400,
    height: 600,
    id,
    languageId: 'html',
    letterSpacing: 0,
    lineNumbers: false,
    platform: 2,
    rowHeight: 20,
    tabSize: 2,
    tokenizePath: '',
    uri: 'file:///benchmark.html',
    width: 800,
    x: 0,
    y: 0,
  })

  const editor = EditorStates.get(id).newState
  expect(editor.lines).toEqual(['<h1>Hello</h1>'])
  expect(editor.selections).toEqual(new Uint32Array([0, 0, 0, 0]))
  expect(editor.focused).toBe(true)
  expect(editor.initial).toBe(false)
  expect(editor.languageId).toBe('html')

  const commands = render2(id, diff2(id))
  expect(commands.some((command) => command[0] === 'Viewlet.setPatches')).toBe(true)
})
