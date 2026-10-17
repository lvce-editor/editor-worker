import { afterEach, expect, jest, test } from '@jest/globals'
import { registerMockRpc, remove, RpcId } from '@lvce-editor/rpc-registry'
import * as ErrorHandling from '../src/parts/ErrorHandling/ErrorHandling.ts'

afterEach(() => {
  jest.restoreAllMocks()
  remove(RpcId.ErrorWorker)
})

test('handleError prepares and prints the full error using the error worker', async () => {
  const error = new Error('diagnostics failed')
  const prettyError = {
    codeFrame: '> 1 | const value: string = 1',
    message: "Type 'number' is not assignable to type 'string'.",
    stack: 'Error: diagnostics failed\n    at test.ts:1:23',
  }
  const mockRpc = registerMockRpc(RpcId.ErrorWorker, {
    'Errors.prepare': async () => prettyError,
    'Errors.print': async () => undefined,
  })

  await ErrorHandling.handleError(error, 'Failed to update diagnostics: ')

  expect(mockRpc.invocations).toEqual([
    ['Errors.prepare', error],
    ['Errors.print', prettyError, 'Failed to update diagnostics: '],
  ])
})

test('handleError logs the original error when the error worker fails', async () => {
  const error = new Error('diagnostics failed')
  const workerError = new Error('error worker failed')
  const consoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {})
  const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
  const mockRpc = registerMockRpc(RpcId.ErrorWorker, {
    'Errors.prepare': async () => {
      throw workerError
    },
  })

  await ErrorHandling.handleError(error, 'Failed to update diagnostics: ')

  expect(consoleWarn).toHaveBeenCalledWith('ErrorHandling error', workerError)
  expect(consoleError).toHaveBeenCalledWith('Failed to update diagnostics: ', error)
  expect(mockRpc.invocations).toEqual([['Errors.prepare', error]])
})
