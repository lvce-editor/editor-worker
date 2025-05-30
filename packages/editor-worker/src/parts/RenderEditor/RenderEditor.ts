import * as Editors from '../Editors/Editors.ts'
import * as EditorSelection from '../EditorSelection/EditorSelection.ts'
import * as EditorText from '../EditorText/EditorText.ts'
import * as GetCursorsVirtualDom from '../GetCursorsVirtualDom/GetCursorsVirtualDom.ts'
import * as GetDiagnosticsVirtualDom from '../GetDiagnosticsVirtualDom/GetDiagnosticsVirtualDom.ts'
import * as GetEditorGutterVirtualDom from '../GetEditorGutterVirtualDom/GetEditorGutterVirtualDom.ts'
import * as GetEditorRowsVirtualDom from '../GetEditorRowsVirtualDom/GetEditorRowsVirtualDom.ts'
import * as GetIncrementalEdits from '../GetIncrementalEdits/GetIncrementalEdits.ts'
import * as GetSelectionsVirtualDom from '../GetSelectionsVirtualDom/GetSelectionsVirtualDom.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'
import * as RenderWidget from '../RenderWidget/RenderWidget.ts'
import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.ts'
import * as SyncIncremental from '../SyncIncremental/SyncIncremental.ts'

const renderLines = {
  isEqual(oldState: any, newState: any) {
    return (
      oldState.lines === newState.lines &&
      oldState.tokenizerId === newState.tokenizerId &&
      oldState.minLineY === newState.minLineY &&
      oldState.decorations === newState.decorations &&
      oldState.embeds === newState.embeds &&
      oldState.deltaX === newState.deltaX &&
      oldState.width === newState.width
    )
  },
  async apply(oldState: any, newState: any) {
    const incrementalEdits = await GetIncrementalEdits.getIncrementalEdits(oldState, newState)
    if (incrementalEdits) {
      return [/* method */ 'setIncrementalEdits', /* incrementalEdits */ incrementalEdits]
    }
    const syncIncremental = SyncIncremental.getEnabled()
    const { textInfos, differences } = await EditorText.getVisible(newState, syncIncremental)
    newState.differences = differences
    const dom = GetEditorRowsVirtualDom.getEditorRowsVirtualDom(textInfos, differences)
    return [/* method */ 'setText', dom]
  },
}

const renderSelections = {
  isEqual(oldState: any, newState: any) {
    return (
      oldState.selections === newState.selections &&
      oldState.focused === newState.focused &&
      oldState.minLineY === newState.minLineY &&
      oldState.deltaX === newState.deltaX
    )
  },
  apply(oldState: any, newState: any) {
    const { cursorInfos, selectionInfos } = EditorSelection.getVisible(newState)
    const cursorsDom = GetCursorsVirtualDom.getCursorsVirtualDom(cursorInfos)
    const selectionsDom = GetSelectionsVirtualDom.getSelectionsVirtualDom(selectionInfos)
    return [/* method */ 'setSelections', cursorsDom, selectionsDom]
  },
}

const renderScrollBarY = {
  isEqual(oldState: any, newState: any) {
    return oldState.deltaY === newState.deltaY && oldState.scrollBarHeight === newState.scrollBarHeight
  },
  apply(oldState: any, newState: any) {
    const scrollBarY = ScrollBarFunctions.getScrollBarY(newState.deltaY, newState.finalDeltaY, newState.height, newState.scrollBarHeight)
    const translate = `0 ${scrollBarY}px`
    const heightPx = `${newState.scrollBarHeight}px`
    return [/* method */ 'setScrollBar', translate, heightPx]
  },
}

const renderScrollBarX = {
  isEqual(oldState: any, newState: any) {
    return oldState.longestLineWidth === newState.longestLineWidth && oldState.deltaX === newState.deltaX
  },
  apply(oldState: any, newState: any) {
    const scrollBarWidth = ScrollBarFunctions.getScrollBarSize(newState.width, newState.longestLineWidth, newState.minimumSliderSize)
    const scrollBarX = (newState.deltaX / newState.longestLineWidth) * newState.width
    return [/* method */ 'setScrollBarHorizontal', /* scrollBarX */ scrollBarX, /* scrollBarWidth */ scrollBarWidth, /* deltaX */ newState.deltaX]
  },
}

const renderFocus = {
  isEqual(oldState: any, newState: any) {
    return oldState.focused === newState.focused
  },
  apply(oldState: any, newState: any) {
    // TODO avoid side effect
    if (newState.focused) {
      const FocusEditorText = 12
      RendererWorker.invoke('Focus.setFocus', FocusEditorText)
    }
    return [/* method */ 'setFocused', newState.focused]
  },
}

const renderDecorations = {
  isEqual(oldState: any, newState: any) {
    return oldState.decorations === newState.decorations
  },
  apply(oldState: any, newState: any) {
    const dom = GetDiagnosticsVirtualDom.getDiagnosticsVirtualDom(newState.decorations)
    return ['setDecorationsDom', dom]
  },
}

const renderGutterInfo = {
  isEqual(oldState: any, newState: any) {
    return oldState.minLineY === newState.minLineY && oldState.maxLineY === newState.maxLineY
  },
  apply(oldState: any, newState: any) {
    const { minLineY, maxLineY, lineNumbers } = newState
    const gutterInfos = []
    if (lineNumbers) {
      for (let i = minLineY; i < maxLineY; i++) {
        gutterInfos.push(i + 1)
      }
    }
    const dom = GetEditorGutterVirtualDom.getEditorGutterVirtualDom(gutterInfos)
    return ['renderGutter', dom]
  },
}

const renderWidgets = {
  isEqual(oldState: any, newState: any) {
    return oldState.widgets === newState.widgets
  },
  apply(oldState: any, newState: any) {
    const addedWidgets = []
    const changedWidgets = []
    const removedWidgets = []
    const oldWidgets = oldState.widgets || []
    const newWidgets = newState.widgets || []
    const oldWidgetMap = Object.create(null)
    const newWidgetMap = Object.create(null)
    for (const oldWidget of oldWidgets) {
      oldWidgetMap[oldWidget.id] = oldWidget
    }
    for (const newWidget of newWidgets) {
      newWidgetMap[newWidget.id] = newWidget
    }
    for (const oldWidget of oldWidgets) {
      if (oldWidget.id in newWidgetMap) {
        changedWidgets.push(newWidgetMap[oldWidget.id])
      } else {
        removedWidgets.push(oldWidget)
      }
    }
    for (const newWidget of newWidgets) {
      if (newWidget.id in oldWidgetMap) {
        // ignore
      } else {
        addedWidgets.push(newWidget)
      }
    }
    const addCommands = []
    for (const addedWidget of addedWidgets) {
      const childCommands = RenderWidget.addWidget(addedWidget)
      if (childCommands.length > 0) {
        addCommands.push(...childCommands)
      }
    }
    const changeCommands: any[] = []
    for (const changedWidget of changedWidgets) {
      const childCommands = RenderWidget.renderWidget(changedWidget)
      if (childCommands.length > 0) {
        changeCommands.push(...childCommands)
      }
    }
    const removeCommands = []
    console.log({ removedWidgets, oldWidgets, newWidgets })
    for (const removedWidget of removedWidgets) {
      const childCommands = RenderWidget.removeWidget(removedWidget)
      if (childCommands.length > 0) {
        removeCommands.push(...childCommands)
      }
    }
    const allCommands = [...addCommands, ...changeCommands, ...removeCommands]
    return allCommands
  },
  multiple: true,
}

const render = [renderLines, renderSelections, renderScrollBarX, renderScrollBarY, renderFocus, renderDecorations, renderGutterInfo, renderWidgets]

export const renderEditor = async (id: number) => {
  const instance = Editors.get(id)
  if (!instance) {
    return []
  }
  const { oldState, newState } = instance
  const commands = []
  console.log({ oldState, newState })
  Editors.set(id, newState, newState)
  for (const item of render) {
    if (!item.isEqual(oldState, newState)) {
      const result = await item.apply(oldState, newState)
      // @ts-ignore
      if (item.multiple) {
        commands.push(...result)
      } else if (result.length > 0) {
        commands.push(result)
      }
    }
  }
  return commands
}
