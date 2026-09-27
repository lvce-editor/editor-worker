import { expect, test } from '@jest/globals'
import { getSelectionCornerClasses } from '../src/parts/GetSelectionCornerClasses/GetSelectionCornerClasses.ts'
import { getSelectionsVirtualDom } from '../src/parts/GetSelectionsVirtualDom/GetSelectionsVirtualDom.ts'

const all = ' SelectionTopLeft SelectionTopRight SelectionBottomRight SelectionBottomLeft'

test('single row rounds all outer corners only when enabled', () => {
  expect(getSelectionCornerClasses([0, 0, 50, 20])).toEqual([all])
  expect(getSelectionsVirtualDom(['0px', '0px', '50px', '20px'], true, true)[0].className).toBe(`EditorSelection${all}`)
  expect(getSelectionsVirtualDom([0, 0, 50, 20])[0].className).toBe('EditorSelection')
  expect(getSelectionsVirtualDom([0, 0, 50, 20], false, true)[0].className).toBe(`EditorSelection SelectionUnfocused${all}`)
})

test('aligned three-line selection keeps interior edges square', () => {
  expect(getSelectionCornerClasses([0, 0, 50, 20, 0, 20, 50, 20, 0, 40, 50, 20])).toEqual([
    ' SelectionTopLeft SelectionTopRight',
    '',
    ' SelectionBottomRight SelectionBottomLeft',
  ])
})

test('longer middle line rounds both exposed right corners', () => {
  expect(getSelectionCornerClasses([0, 0, 50, 20, 0, 20, 100, 20, 0, 40, 50, 20])).toEqual([
    ' SelectionTopLeft SelectionTopRight',
    ' SelectionTopRight SelectionBottomRight',
    ' SelectionBottomRight SelectionBottomLeft',
  ])
})

test('partial first and last lines and reversed rectangle ordering', () => {
  expect(getSelectionCornerClasses([0, 40, 30, 20, 30, 0, 70, 20, 0, 20, 100, 20])).toEqual([
    ' SelectionBottomRight SelectionBottomLeft',
    ' SelectionTopLeft SelectionTopRight',
    ' SelectionTopLeft SelectionBottomRight',
  ])
})

test('disconnected selections, corner-only contact and empty rectangles do not join', () => {
  expect(getSelectionCornerClasses([0, 0, 50, 20, 50, 20, 50, 20, 0, 60, 50, 20, 0, 80, 0, 20])).toEqual([all, all, all, ''])
  expect(getSelectionCornerClasses([])).toEqual([])
})

test('overlapping adjacent intervals are merged before checking corners', () => {
  expect(getSelectionCornerClasses([0, 0, 100, 20, 20, 0, 20, 20, 0, 20, 100, 20])[2]).toBe(' SelectionBottomRight SelectionBottomLeft')
})
