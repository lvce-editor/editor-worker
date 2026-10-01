import { expect, test } from '@jest/globals'
import { readFileSync } from 'node:fs'

interface Setting {
  readonly description: string
  readonly heading: string
  readonly id: string
  readonly options?: readonly { readonly id: string }[]
  readonly type: string
  readonly value: string
}

const settings = JSON.parse(readFileSync(new URL('../settings.json', import.meta.url), 'utf8')) as readonly Setting[]

test('tab completion is an enum with the supported values and enabled by default', () => {
  const setting = settings.find((item) => item.id === 'editor.tabCompletion')

  expect(setting).toMatchObject({
    description: 'Enables tab completions',
    heading: 'Tab Completion',
    type: 'enum',
    value: 'on',
  })
  expect(setting?.options?.map((option) => option.id)).toEqual(['on', 'off'])
})
