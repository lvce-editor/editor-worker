import type { StandaloneEditorOptions } from '../CreateStandaloneEditor/CreateStandaloneEditor.ts'
import type { EditorState } from '../State/State.ts'
import { commandMap } from '../CommandMap/CommandMap.ts'
import { createStandaloneEditor } from '../CreateStandaloneEditor/CreateStandaloneEditor.ts'
import { disposeEditor } from '../DisposeEditor/DisposeEditor.ts'
import * as EditorStates from '../EditorStates/EditorStates.ts'
import { registerWidgets } from '../RegisterWidgets/RegisterWidgets.ts'
import { isStateCommand } from '../WrapCommands/WrapCommands.ts'

export interface EmbeddedEditor {
  readonly dispose: () => Promise<void>
  readonly execute: (command: string, ...args: readonly any[]) => Promise<EditorState>
  readonly getState: () => EditorState
}

const reservedIds = new Set<number>()

/**
 * Creates an editor owned by the caller, without starting a worker or installing
 * message listeners. The host initializes the shared rpc-registry connections.
 * Commands use document coordinates; the host owns display coordinate mapping.
 */
export const createEmbeddedEditor = async (options: StandaloneEditorOptions): Promise<EmbeddedEditor> => {
  const { id } = options
  if (reservedIds.has(id) || EditorStates.get(id)) {
    throw new Error(`Editor already exists: ${id}`)
  }
  reservedIds.add(id)
  try {
    registerWidgets()
    await createStandaloneEditor(options)
  } catch (error) {
    EditorStates.dispose(id)
    reservedIds.delete(id)
    throw error
  }

  let closed = false
  let pending: Promise<unknown> = Promise.resolve()
  let disposal: Promise<void> | undefined
  const getState = (): EditorState => {
    if (closed) {
      throw new Error(`Editor is disposed: ${id}`)
    }
    return EditorStates.get(id).newState
  }
  const ignoreFailure = async (command: Promise<unknown>): Promise<void> => {
    try {
      await command
    } catch {
      // The execute caller receives this error.
    }
  }
  const run = async (previous: Promise<unknown>, fn: (...args: any[]) => any, args: readonly any[]): Promise<EditorState> => {
    await previous
    await fn(id, ...args)
    return EditorStates.get(id).newState
  }
  const execute = (command: string, ...args: readonly any[]): Promise<EditorState> => {
    if (closed) {
      return Promise.reject(new Error(`Editor is disposed: ${id}`))
    }
    const key = command.startsWith('Editor.') || command.startsWith('EditorText.') ? command : `Editor.${command}`
    const fn = (commandMap as Record<string, (...args: any[]) => any>)[key]
    // Only document commands are accepted. Worker lifecycle, global commands,
    // and getters must not be invoked as commands on this owned editor.
    if (!fn || !isStateCommand(fn)) {
      return Promise.reject(new Error(`Unsupported editor command: ${command}`))
    }
    const result = run(pending, fn, args)
    // Report a command failure to its caller, while allowing subsequent commands.
    pending = ignoreFailure(result)
    return result
  }
  const finishDisposal = async (): Promise<void> => {
    await pending
    try {
      await disposeEditor(id)
    } finally {
      EditorStates.dispose(id)
      reservedIds.delete(id)
    }
  }
  const dispose = (): Promise<void> => {
    if (!disposal) {
      closed = true
      disposal = finishDisposal()
    }
    return disposal
  }
  return { dispose, execute, getState }
}
