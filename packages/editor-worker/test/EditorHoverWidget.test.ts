import { expect, test } from '@jest/globals'
import * as EditorHoverWidget from '../src/parts/EditorHoverWidget/EditorHoverWidget.ts'

test('render creates hover DOM for locally loaded hover content', () => {
  const oldState = {
    commands: [],
    content: '',
    diagnostics: [],
    documentation: '',
    editorUid: 1,
    height: 0,
    lineInfos: [],
    uid: 2,
    width: 0,
    x: 0,
    y: 0,
  }
  const newState = {
    ...oldState,
    documentation: 'documentation',
    height: 100,
    lineInfos: [['const', 'TokenKeyword']],
    width: 300,
    x: 20,
    y: 40,
  }

  const commands = EditorHoverWidget.render({
    id: 1,
    newState,
    oldState,
  })

  expect(commands[0]).toEqual(['Viewlet.setDom2', 2, expect.any(Array)])
  expect(commands[1]).toEqual(['Viewlet.setBounds', 2, 20, 40, 300, 100])
})
