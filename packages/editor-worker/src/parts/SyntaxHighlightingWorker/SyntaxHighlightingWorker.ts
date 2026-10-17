import { SyntaxHighlightingWorker } from '@lvce-editor/rpc-registry'

export const invoke: typeof SyntaxHighlightingWorker.invoke = (...args) => SyntaxHighlightingWorker.invoke(...args)
export const invokeAndTransfer: typeof SyntaxHighlightingWorker.invokeAndTransfer = (...args) => SyntaxHighlightingWorker.invokeAndTransfer(...args)
export const set: typeof SyntaxHighlightingWorker.set = (...args) => SyntaxHighlightingWorker.set(...args)
