import * as Assert from '../Assert/Assert.ts'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { VError } from '../VError/VError.ts'

export const readText = async () => {
  try {
    // @ts-ignore
    return await RendererWorker.invoke('ClipBoard.readText')
  } catch (error) {
    // @ts-ignore
    if (error.message === 'Read permission denied.') {
      // @ts-ignore
      throw new VError('Failed to read text from clipboard: The Browser disallowed reading from clipboard')
    }
    if (
      // @ts-ignore
      error.message === 'navigator.clipboard.readText is not a function'
    ) {
      // @ts-ignore
      throw new VError('Failed to read text from clipboard: The Clipboard Api is not available in Firefox')
    }
    throw new VError(error, 'Failed to read text from clipboard')
  }
}

export const writeText = async (text: string) => {
  try {
    Assert.string(text)
    await RendererWorker.invoke('ClipBoard.writeText', /* text */ text)
  } catch (error) {
    throw new VError(error, 'Failed to write text to clipboard')
  }
}
