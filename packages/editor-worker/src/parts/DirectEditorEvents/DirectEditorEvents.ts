import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as EditorStates from '../EditorStates/EditorStates.ts'

// These commands have renderer-owned effects in addition to editor state updates.
const rendererCommands = new Set([
  'ColorPicker.handleSliderKeyDown',
  'handleFocus',
  'handleMouseDown',
  'handleUriChange',
  'handleWorkspaceRefresh',
  'hotReload',
  'loadContent',
  'loadContentLater',
  'refreshGutterDecorationsAll',
  'renderPending',
  'setLanguageId',
  'showOverlayMessage',
  'updateDiagnostics',
])

export const createCommandMap = (commands: Readonly<Record<string, unknown>>) => ({
  async 'Viewlet.executeViewletCommand'(uid: number, command: string, ...args: readonly unknown[]): Promise<void> {
    if (rendererCommands.has(command)) {
      await RendererWorker.invoke('Viewlet.executeViewletCommand', uid, command, ...args)
      return
    }
    const fn = commands[command.includes('.') ? command : `Editor.${command}`]
    if (typeof fn !== 'function') {
      throw new TypeError(`Editor event command not found: ${command}`)
    }
    const editor = EditorStates.get(uid)?.newState
    if (!editor) return
    await fn(uid, ...args)
    const current = EditorStates.get(uid)?.newState
    if (!current || editor.lifecycle?.disposed || current.lifecycle !== editor.lifecycle) return
    // The wrapped command has released the document queue before requesting a
    // render; a diff can now run without waiting on its own command.
    // Blur can finish after another editor has gained focus. Apply its state
    // without letting the delayed render replace the current focus context.
    await RendererWorker.invoke('Viewlet.requestRender', uid, command === 'handleBlur')
  },
})
