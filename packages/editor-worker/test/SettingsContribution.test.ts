import { readFileSync } from 'node:fs'
import { expect, test } from '@jest/globals'

interface EnumSetting {
  readonly id: string
  readonly options?: readonly { readonly id: string }[]
  readonly value: string
}

const settings = JSON.parse(readFileSync(new URL('../settings.json', import.meta.url), 'utf8')) as readonly EnumSetting[]

test('word wrap and line number defaults match their select options', () => {
  const wordWrap = settings.find((setting) => setting.id === 'editor.wordWrap')
  const lineNumbers = settings.find((setting) => setting.id === 'editor.lineNumbers')

  expect(wordWrap?.value).toBe('off')
  expect(wordWrap?.options?.map((option) => option.id)).toEqual(['on', 'off'])
  expect(lineNumbers?.value).toBe('on')
  expect(lineNumbers?.options?.map((option) => option.id)).toEqual(['on', 'off'])
})
