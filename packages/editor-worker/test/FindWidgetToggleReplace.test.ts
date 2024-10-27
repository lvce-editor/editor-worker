import { expect, test } from '@jest/globals'
import * as FindWidgetToggleReplace from '../src/parts/FindWidgetToggleReplace/FindWidgetToggleReplace.ts'
import * as FindWidgetFactory from '../src/parts/FindWidgetFactory/FindWidgetFactory.ts'
import { FindWidgetState } from '../src/parts/FindWidgetState/FindWidgetState.ts'

test('expand', () => {
  const { oldState } = FindWidgetFactory.create()
  const state: FindWidgetState = {
    ...oldState,
    replaceExpanded: false,
  }
  const newState = FindWidgetToggleReplace.toggleReplace(state)
  expect(newState.replaceExpanded).toBe(true)
  expect(newState.height).toBe(60)
})

test('collapse', () => {
  const { oldState } = FindWidgetFactory.create()
  const state: FindWidgetState = {
    ...oldState,
    replaceExpanded: true,
  }
  const newState = FindWidgetToggleReplace.toggleReplace(state)
  expect(newState.replaceExpanded).toBe(false)
  expect(newState.height).toBe(30)
})
