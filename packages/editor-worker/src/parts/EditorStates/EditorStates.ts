import * as ViewletRegistry from '@lvce-editor/viewlet-registry'

const editorStates = ViewletRegistry.create<any>()

export const { diff, getCommandIds, registerCommands, wrapCommand, wrapGetter } = editorStates

export const get = (id: number): any => {
	return editorStates.get(id)
}

export const getKeys = (): readonly string[] => {
	const keys = editorStates.getKeys()
	return keys.map(String)
}

export const set = (id: number, oldEditor: any, newEditor: any): void => {
	editorStates.set(id, oldEditor, newEditor)
}
