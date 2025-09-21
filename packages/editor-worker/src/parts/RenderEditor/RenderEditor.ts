import type { State } from '../State/State.ts'
import * as Editors from '../Editors/Editors.ts'
import * as EditorSelection from '../EditorSelection/EditorSelection.ts'
import { emptyIncrementalEdits } from '../EmptyIncrementalEdits/EmptyIncrementalEdits.ts'
import * as GetCursorsVirtualDom from '../GetCursorsVirtualDom/GetCursorsVirtualDom.ts'
import * as GetDiagnosticsVirtualDom from '../GetDiagnosticsVirtualDom/GetDiagnosticsVirtualDom.ts'
import * as GetEditorGutterVirtualDom from '../GetEditorGutterVirtualDom/GetEditorGutterVirtualDom.ts'
import * as GetEditorRowsVirtualDom from '../GetEditorRowsVirtualDom/GetEditorRowsVirtualDom.ts'
import * as GetSelectionsVirtualDom from '../GetSelectionsVirtualDom/GetSelectionsVirtualDom.ts'
import * as RenderWidget from '../RenderWidget/RenderWidget.ts'
import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.ts'

const renderLines = {
  isEqual(oldState: State, newState: State) {
    return (
      oldState.lines === newState.lines &&
      oldState.tokenizerId === newState.tokenizerId &&
      oldState.minLineY === newState.minLineY &&
      oldState.decorations === newState.decorations &&
      oldState.embeds === newState.embeds &&
      oldState.deltaX === newState.deltaX &&
      oldState.width === newState.width &&
      oldState.highlightedLine === newState.highlightedLine &&
      oldState.debugEnabled === newState.debugEnabled
    )
  },
  apply(oldState: State, newState: State) {
    const { incrementalEdits } = newState
    if (incrementalEdits !== emptyIncrementalEdits) {
      return [/* method */ 'setIncrementalEdits', /* incrementalEdits */ incrementalEdits]
    }
    const { textInfos, differences } = newState
    newState.differences = differences
    const { highlightedLine, minLineY } = newState
    const relativeLine = highlightedLine - minLineY
    const dom = GetEditorRowsVirtualDom.getEditorRowsVirtualDom(textInfos, differences, true, relativeLine)
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
  isEqual(oldState: State, newState: State) {
    return oldState.deltaY === newState.deltaY && oldState.scrollBarHeight === newState.scrollBarHeight
  },
  apply(oldState: State, newState: State) {
    const scrollBarY = ScrollBarFunctions.getScrollBarY(newState.deltaY, newState.finalDeltaY, newState.height, newState.scrollBarHeight)
    const translate = `0 ${scrollBarY}px`
    const heightPx = `${newState.scrollBarHeight}px`
    return [/* method */ 'setScrollBar', translate, heightPx]
  },
}

const renderScrollBarX = {
  isEqual(oldState: State, newState: State) {
    return oldState.longestLineWidth === newState.longestLineWidth && oldState.deltaX === newState.deltaX
  },
  apply(oldState: State, newState: State) {
    const scrollBarWidth = ScrollBarFunctions.getScrollBarSize(newState.width, newState.longestLineWidth, newState.minimumSliderSize)
    const scrollBarX = (newState.deltaX / newState.longestLineWidth) * newState.width
    return [/* method */ 'setScrollBarHorizontal', /* scrollBarX */ scrollBarX, /* scrollBarWidth */ scrollBarWidth, /* deltaX */ newState.deltaX]
  },
}

const renderFocus = {
  isEqual(oldState: State, newState: State) {
    return oldState.focused === newState.focused
  },
  apply(oldState: State, newState: State) {
    return [/* method */ 'setFocused', newState.focused]
  },
}

const renderFocusContext = {
  isEqual(oldState: State, newState: State) {
    return oldState.focus === newState.focus
  },
  apply(oldState: State, newState: State) {
    return ['Viewlet.setFocusContext', newState.uid, newState.focus]
  },
}

const renderAdditionalFocusContext = {
  isEqual(oldState: State, newState: State) {
    return newState.additionalFocus === newState.additionalFocus
  },
  apply(oldState: State, newState: State) {
    if (newState.additionalFocus) {
      return ['Focus.setAdditionalFocus', newState.uid, newState.additionalFocus]
    }
    return ['Focus.unsetAdditionalFocus', newState.uid, newState.additionalFocus]
  },
}

const renderDecorations = {
  isEqual(oldState: State, newState: State) {
    return oldState.decorations === newState.decorations
  },
  apply(oldState: State, newState: State) {
    const dom = GetDiagnosticsVirtualDom.getDiagnosticsVirtualDom(newState.decorations)
    return ['setDecorationsDom', dom]
  },
}

const renderGutterInfo = {
  isEqual(oldState: State, newState: State) {
    return oldState.minLineY === newState.minLineY && oldState.maxLineY === newState.maxLineY
  },
  apply(oldState: State, newState: State) {
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
    for (const removedWidget of removedWidgets) {
      const childCommands = RenderWidget.removeWidget(removedWidget)
      if (childCommands.length > 0) {
        removeCommands.push(...childCommands)
      }
    }
    const allCommands = [...addCommands, ...changeCommands, ...removeCommands]
    const filteredCommands = allCommands.filter((item) => item[0] !== 'Viewlet.setFocusContext')
    return filteredCommands
  },
  multiple: true,
}

const render = [
  renderLines,
  renderSelections,
  renderScrollBarX,
  renderScrollBarY,
  renderFocus,
  renderDecorations,
  renderGutterInfo,
  renderWidgets,
  renderFocusContext,
  renderAdditionalFocusContext,
]

export const renderEditor = (id: number) => {
  const instance = Editors.get(id)
  if (!instance) {
    return []
  }
  const { oldState, newState } = instance
  const commands = []
  Editors.set(id, newState, newState)
  for (const item of render) {
    if (!item.isEqual(oldState, newState)) {
      const result = item.apply(oldState, newState)
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
