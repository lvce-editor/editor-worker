import * as EditorPreferences from '../EditorPreferences/EditorPreferences.ts'
import * as Preferences from '../Preferences/Preferences.ts'

export const toggleMinimap = async (): Promise<void> => {
  const minimapEnabled = await EditorPreferences.getMinimapEnabled()
  await Preferences.update({
    'editor.minimap.enabled': !minimapEnabled,
  })
}
