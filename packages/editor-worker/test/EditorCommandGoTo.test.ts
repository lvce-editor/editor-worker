import { expect, test } from '@jest/globals'
import * as EditorCommandGoTo from '../src/parts/EditorCommand/EditorCommandGoTo.ts'

const createEditor = () => ({
  columnWidth: 8,
  lines: ['missingDefinition'],
  rowHeight: 20,
  selections: new Uint32Array([0, 8, 0, 8]),
  uid: 1,
  uri: 'file:///test.ts',
  widgets: [],
  x: 10,
  y: 30,
})

const getNoLocationFoundMessage = ({ word }: { readonly word: string }): string => `No definition found for '${word}'`

test('goTo shows a message when the provider returns no definition', async () => {
  const editor = createEditor()

  const result = await EditorCommandGoTo.goTo({
    editor,
    getErrorMessage: String,
    getLocation: async () => null,
    getNoLocationFoundMessage,
    isNoProviderFoundError: () => false,
  })

  expect(result.widgets).toEqual([
    {
      id: 9,
      newState: {
        message: "No definition found for 'missingDefinition'",
        uid: expect.any(Number),
        x: 74,
        y: 50,
      },
    },
  ])
})

test('goTo preserves the provider error message in the editor state', async () => {
  const editor = createEditor()

  const result = await EditorCommandGoTo.goTo({
    editor,
    getErrorMessage: String,
    getLocation: async () => {
      throw new Error('definition provider failed')
    },
    getNoLocationFoundMessage,
    isNoProviderFoundError: () => false,
  })

  expect(result.widgets[0].newState.message).toBe('Error: definition provider failed')
})

test('goTo treats an empty provider rejection as no definition', async () => {
  const editor = createEditor()

  const result = await EditorCommandGoTo.goTo({
    editor,
    getErrorMessage: String,
    getLocation: async () => {
      throw null
    },
    getNoLocationFoundMessage,
    isNoProviderFoundError: () => false,
  })

  expect(result.widgets[0].newState.message).toBe("No definition found for 'missingDefinition'")
})
