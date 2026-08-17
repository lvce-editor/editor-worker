import { expect, test } from '@jest/globals'
import { editorDiagnosticEffect } from '../src/parts/EditorDiagnosticEffect/EditorDiagnosticEffect.ts'

test('is inactive when diagnostics are disabled', () => {
  const oldEditor = { lines: ['old'] }
  const newEditor = { diagnosticsEnabled: false, lines: ['new'] }

  expect(editorDiagnosticEffect.isActive(oldEditor as any, newEditor as any)).toBe(false)
})

test('is inactive when the lines reference is unchanged', () => {
  const lines = ['text']
  const oldEditor = { lines }
  const newEditor = { diagnosticsEnabled: true, lines }

  expect(editorDiagnosticEffect.isActive(oldEditor as any, newEditor as any)).toBe(false)
})

test('is inactive while the initial editor content is loading', () => {
  const oldEditor = { initial: true, lines: [] }
  const newEditor = { diagnosticsEnabled: true, initial: false, lines: ['text'] }

  expect(editorDiagnosticEffect.isActive(oldEditor as any, newEditor as any)).toBe(false)
})

test('is active when the lines reference changes', () => {
  const oldEditor = { lines: ['text'] }
  const newEditor = { diagnosticsEnabled: true, lines: ['text'] }

  expect(editorDiagnosticEffect.isActive(oldEditor as any, newEditor as any)).toBe(true)
})
