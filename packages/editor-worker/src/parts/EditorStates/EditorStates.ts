import * as ViewletRegistry from '@lvce-editor/viewlet-registry'
import type { EditorState } from '../State/State.ts'

export const { diff, get, getCommandIds, registerCommands, set, wrapCommand, wrapGetter } = ViewletRegistry.create<EditorState>()
