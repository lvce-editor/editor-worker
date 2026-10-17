import { expect, test } from '@jest/globals'
import * as GetSignatureHelpContent from '../src/parts/GetSignatureHelpContent/GetSignatureHelpContent.ts'

test('returns the active signature and parameter documentation', () => {
  expect(
    GetSignatureHelpContent.getSignatureHelpContent({
      activeParameter: 1,
      activeSignature: 0,
      signatures: [
        {
          documentation: 'Calls foo.',
          label: 'foo(first: string, second: number): void',
          parameters: [
            {
              documentation: 'First value.',
              label: 'first: string',
            },
            {
              documentation: 'Second value.',
              label: 'second: number',
            },
          ],
        },
      ],
    }),
  ).toEqual({
    displayString: 'foo(first: string, second: number): void',
    documentation: 'Parameter 2 of 2: second: number\nSecond value.\nCalls foo.',
  })
})

test('clamps invalid signature and parameter indexes', () => {
  expect(
    GetSignatureHelpContent.getSignatureHelpContent({
      activeParameter: 10,
      activeSignature: 10,
      signatures: [
        {
          label: 'first(): void',
          parameters: [],
        },
        {
          label: 'second(value: string): void',
          parameters: [{ label: 'value: string' }],
        },
      ],
    }),
  ).toEqual({
    displayString: 'second(value: string): void',
    documentation: 'Parameter 1 of 1: value: string',
  })
})

test('returns undefined when there are no signatures', () => {
  expect(
    GetSignatureHelpContent.getSignatureHelpContent({
      activeParameter: 0,
      activeSignature: 0,
      signatures: [],
    }),
  ).toBeUndefined()
})
