import * as CodeGeneratorAccept from '../CodeGeneratorAccept/CodeGeneratorAccept.ts'
import * as ColorPicker from '../ColorPicker/ColorPicker.ts'
import * as CreateEditor from '../CreateEditor/CreateEditor.ts'
import * as AddCursorAbove from '../EditorCommand/EditorCommandAddCursorAbove.ts'
import * as AddCursorBelow from '../EditorCommand/EditorCommandAddCursorBelow.ts'
import * as EditorApplyEdit from '../EditorCommand/EditorCommandApplyEdit.ts'
import * as EditorBlur from '../EditorCommand/EditorCommandBlur.ts'
import * as EditorBraceCompletion from '../EditorCommand/EditorCommandBraceCompletion.ts'
import * as CancelSelection from '../EditorCommand/EditorCommandCancelSelection.ts'
import * as EditorCommandCloseCodeGenerator from '../EditorCommand/EditorCommandCloseCodeGenerator.ts'
import * as EditorCloseCompletion from '../EditorCommand/EditorCommandCloseCompletion.ts'
import * as EditorCommandCloseFind from '../EditorCommand/EditorCommandCloseFind.ts'
import * as CloseRename from '../EditorCommand/EditorCommandCloseRename.ts'
import * as EditorCommandCloseSourceAction from '../EditorCommand/EditorCommandCloseSourceAction.ts'
import * as EditorOpenColorPicker from '../EditorCommand/EditorCommandColorPicker.ts'
import * as Composition from '../EditorCommand/EditorCommandComposition.ts'
import * as Copy from '../EditorCommand/EditorCommandCopy.ts'
import * as CopyLineDown from '../EditorCommand/EditorCommandCopyLineDown.ts'
import * as CopyLineUp from '../EditorCommand/EditorCommandCopyLineUp.ts'
import * as CursorCharacterLeft from '../EditorCommand/EditorCommandCursorCharacterLeft.ts'
import * as CursorCharacterRight from '../EditorCommand/EditorCommandCursorCharacterRight.ts'
import * as CursorDown from '../EditorCommand/EditorCommandCursorDown.ts'
import * as CursorEnd from '../EditorCommand/EditorCommandCursorEnd.ts'
import * as CursorHome from '../EditorCommand/EditorCommandCursorHome.ts'
import * as EditorCursorSet from '../EditorCommand/EditorCommandCursorSet.ts'
import * as CursorUp from '../EditorCommand/EditorCommandCursorUp.ts'
import * as CursorWordLeft from '../EditorCommand/EditorCommandCursorWordLeft.ts'
import * as CursorWordPartLeft from '../EditorCommand/EditorCommandCursorWordPartLeft.ts'
import * as CursorWordPartRight from '../EditorCommand/EditorCommandCursorWordPartRight.ts'
import * as CursorWordRight from '../EditorCommand/EditorCommandCursorWordRight.ts'
import * as Cut from '../EditorCommand/EditorCommandCut.ts'
import * as DeleteAllLeft from '../EditorCommand/EditorCommandDeleteAllLeft.ts'
import * as DeleteAllRight from '../EditorCommand/EditorCommandDeleteAllRight.ts'
import * as DeleteCharacterLeft from '../EditorCommand/EditorCommandDeleteCharacterLeft.ts'
import * as DeleteCharacterRight from '../EditorCommand/EditorCommandDeleteCharacterRight.ts'
import * as DeleteHorizontalRight from '../EditorCommand/EditorCommandDeleteHorizontalRight.ts'
import * as DeleteWordLeft from '../EditorCommand/EditorCommandDeleteWordLeft.ts'
import * as DeleteWordPartLeft from '../EditorCommand/EditorCommandDeleteWordPartLeft.ts'
import * as DeleteWordPartRight from '../EditorCommand/EditorCommandDeleteWordPartRight.ts'
import * as DeleteWordRight from '../EditorCommand/EditorCommandDeleteWordRight.ts'
import * as FindAllReferences from '../EditorCommand/EditorCommandFindAllReferences.ts'
import * as EditorFormat from '../EditorCommand/EditorCommandFormat.ts'
import * as GetWordAt from '../EditorCommand/EditorCommandGetWordAt.ts'
import * as EditorGoToDefinition from '../EditorCommand/EditorCommandGoToDefinition.ts'
import * as EditorGoToTypeDefinition from '../EditorCommand/EditorCommandGoToTypeDefinition.ts'
import * as ContextMenu from '../EditorCommand/EditorCommandHandleContextMenu.ts'
import * as EditorCommandHandleContextMenu from '../EditorCommand/EditorCommandHandleContextMenu.ts'
import * as HandleDoubleClick from '../EditorCommand/EditorCommandHandleDoubleClick.ts'
import * as HandleFocus from '../EditorCommand/EditorCommandHandleFocus.ts'
import * as HandleMouseDown from '../EditorCommand/EditorCommandHandleMouseDown.ts'
import * as HandleMouseMove from '../EditorCommand/EditorCommandHandleMouseMove.ts'
import * as EditorCommandHandleMouseMoveWithAltKey from '../EditorCommand/EditorCommandHandleMouseMoveWithAltKey.ts'
import * as EditorCommandHandleNativeBeforeInputFromContentEditable from '../EditorCommand/EditorCommandHandleNativeBeforeInputFromContentEditable.ts'
import * as HandleNativeSelectionChange from '../EditorCommand/EditorCommandHandleNativeSelectionChange.ts'
import * as HandlePointerCaptureLost from '../EditorCommand/EditorCommandHandlePointerCaptureLost.ts'
import * as HandleScrollBarHorizontalMove from '../EditorCommand/EditorCommandHandleScrollBarHorizontalMove.ts'
import * as HandleScrollBarHorizontalPointerDown from '../EditorCommand/EditorCommandHandleScrollBarHorizontalPointerDown.ts'
import * as EditorCommandHandleScrollBarMove from '../EditorCommand/EditorCommandHandleScrollBarMove.ts'
import * as HandleScrollBarMove from '../EditorCommand/EditorCommandHandleScrollBarMove.ts'
import * as HandleScrollBarPointerDown from '../EditorCommand/EditorCommandHandleScrollBarPointerDown.ts'
import * as HandleSingleClick from '../EditorCommand/EditorCommandHandleSingleClick.ts'
import * as HandleTouchEnd from '../EditorCommand/EditorCommandHandleTouchEnd.ts'
import * as HandleTouchMove from '../EditorCommand/EditorCommandHandleTouchMove.ts'
import * as HandleTouchStart from '../EditorCommand/EditorCommandHandleTouchStart.ts'
import * as HandleTripleClick from '../EditorCommand/EditorCommandHandleTripleClick.ts'
import * as IndentLess from '../EditorCommand/EditorCommandIndentLess.ts'
import * as IndentMore from '../EditorCommand/EditorCommandIndentMore.ts'
import * as InsertLineBreak from '../EditorCommand/EditorCommandInsertLineBreak.ts'
import * as MoveRectangleSelection from '../EditorCommand/EditorCommandMoveRectangleSelection.ts'
import * as MoveRectangleSelectionPx from '../EditorCommand/EditorCommandMoveRectangleSelectionPx.ts'
import * as EditorMoveSelection from '../EditorCommand/EditorCommandMoveSelection.ts'
import * as EditorMoveSelectionPx from '../EditorCommand/EditorCommandMoveSelectionPx.ts'
import * as EditorCommandOpenCodeGenerator from '../EditorCommand/EditorCommandOpenCodeGenerator.ts'
import * as EditorOpenCompletion from '../EditorCommand/EditorCommandOpenCompletion.ts'
import * as OpenFind2 from '../EditorCommand/EditorCommandOpenFind2.ts'
import * as OpenFind from '../EditorCommand/EditorCommandOpenFind.ts'
import * as EditorCommandOpenRename from '../EditorCommand/EditorCommandOpenRename.ts'
import * as OrganizeImports from '../EditorCommand/EditorCommandOrganizeImports.ts'
import * as EditorPaste from '../EditorCommand/EditorCommandPaste.ts'
import * as PasteText from '../EditorCommand/EditorCommandPasteText.ts'
import * as ReplaceRange from '../EditorCommand/EditorCommandReplaceRange.ts'
import * as Save from '../EditorCommand/EditorCommandSave.ts'
import * as SelectAll from '../EditorCommand/EditorCommandSelectAll.ts'
import * as SelectAllLeft from '../EditorCommand/EditorCommandSelectAllLeft.ts'
import * as SelectAllOccurrences from '../EditorCommand/EditorCommandSelectAllOccurrences.ts'
import * as SelectAllRight from '../EditorCommand/EditorCommandSelectAllRight.ts'
import * as SelectCharacterLeft from '../EditorCommand/EditorCommandSelectCharacterLeft.ts'
import * as SelectCharacterRight from '../EditorCommand/EditorCommandSelectCharacterRight.ts'
import * as SelectDown from '../EditorCommand/EditorCommandSelectDown.ts'
import * as EditorSelectInsideString from '../EditorCommand/EditorCommandSelectInsideString.ts'
import * as SelectionGrow from '../EditorCommand/EditorCommandSelectionGrow.ts'
import * as SelectLine from '../EditorCommand/EditorCommandSelectLine.ts'
import * as SelectNextOccurrence from '../EditorCommand/EditorCommandSelectNextOccurrence.ts'
import * as SelectPreviousOccurrence from '../EditorCommand/EditorCommandSelectPreviousOccurrence.ts'
import * as SelectUp from '../EditorCommand/EditorCommandSelectUp.ts'
import * as SelectWord from '../EditorCommand/EditorCommandSelectWord.ts'
import * as SelectWordLeft from '../EditorCommand/EditorCommandSelectWordLeft.ts'
import * as SelectWordRight from '../EditorCommand/EditorCommandSelectWordRight.ts'
import * as SetDecorations from '../EditorCommand/EditorCommandSetDecorations.ts'
import * as SetDelta from '../EditorCommand/EditorCommandSetDelta.ts'
import * as SetLanguageId from '../EditorCommand/EditorCommandSetLanguageId.ts'
import * as SetSelections from '../EditorCommand/EditorCommandSetSelections.ts'
import * as EditorCommandShowHover2 from '../EditorCommand/EditorCommandShowHover2.ts'
import * as EditorShowHover from '../EditorCommand/EditorCommandShowHover.ts'
import * as EditorShowSourceActions2 from '../EditorCommand/EditorCommandShowSourceActions2.ts'
import * as SortLinesAscending from '../EditorCommand/EditorCommandSortLinesAscending.ts'
import * as EditorTabCompletion from '../EditorCommand/EditorCommandTabCompletion.ts'
import * as EditorToggleBlockComment from '../EditorCommand/EditorCommandToggleBlockComment.ts'
import * as EditorToggleComment from '../EditorCommand/EditorCommandToggleComment.ts'
import * as EditorToggleLineComment from '../EditorCommand/EditorCommandToggleLineComment.ts'
import * as EditorType from '../EditorCommand/EditorCommandType.ts'
import * as EditorTypeWithAutoClosing from '../EditorCommand/EditorCommandTypeWithAutoClosing.ts'
import * as EditorUndo from '../EditorCommand/EditorCommandUndo.ts'
import * as Unindent from '../EditorCommand/EditorCommandUnindent.ts'
import * as EditorCompletion from '../EditorCompletion/EditorCompletion.ts'
import * as EditorCompletionCloseDetails from '../EditorCompletionCloseDetails/EditorCompletionCloseDetails.ts'
import * as EditorCompletionFocusFirst from '../EditorCompletionFocusFirst/EditorCompletionFocusFirst.ts'
import * as EditorCompletionFocusIndex from '../EditorCompletionFocusIndex/EditorCompletionFocusIndex.ts'
import * as EditorCompletionFocusNext from '../EditorCompletionFocusNext/EditorCompletionFocusNext.ts'
import * as EditorCompletionFocusPrevious from '../EditorCompletionFocusPrevious/EditorCompletionFocusPrevious.ts'
import * as EditorCompletionHandleWheel from '../EditorCompletionHandleWheel/EditorCompletionHandleWheel.ts'
import * as EditorCompletionOpenDetails from '../EditorCompletionOpenDetails/EditorCompletionOpenDetails.ts'
import * as EditorCompletionSelectCurrent from '../EditorCompletionSelectCurrent/EditorCompletionSelectCurrent.ts'
import * as EditorCompletionSelectIndex from '../EditorCompletionSelectIndex/EditorCompletionSelectIndex.ts'
import * as EditorCompletionToggleDetails from '../EditorCompletionToggleDetails/EditorCompletionToggleDetails.ts'
import * as EditorHover from '../EditorHover/EditorHover.ts'
import * as EditorHoverRender from '../EditorHoverRender/EditorHoverRender.ts'
import * as EditorRenameAccept from '../EditorRenameAccept/EditorRenameAccept.ts'
import * as EditorRenameHandleBlur from '../EditorRenameHandleBlur/EditorRenameHandleBlur.ts'
import * as EditorRerender from '../EditorRerender/EditorRerender.ts'
import * as EditorSourceActionFocusNext from '../EditorSourceActionFocusNext/EditorSourceActionFocusNext.ts'
import * as FindWidget from '../FindWidgetFunctions/FindWidgetFunctions.ts'
import * as FindWidgetReplaceAll from '../FindWidgetReplaceAll/FindWidgetReplaceAll.ts'
import * as Font from '../Font/Font.ts'
import * as GetHoverInfo from '../GetHoverInfo/GetHoverInfo.ts'
import * as GetKeyBindings from '../GetKeyBindings/GetKeyBindings.ts'
import * as GetQuickPickMenuEntries from '../GetQuickPickMenuEntries/GetQuickPickMenuEntries.ts'
import * as GetSelections from '../GetSelections/GetSelections.ts'
import * as GetText from '../GetText/GetText.ts'
import * as HandleBeforeInput from '../HandleBeforeInput/HandleBeforeInput.ts'
import * as HandleTab from '../HandleTab/HandleTab.ts'
import * as Initialize from '../Initialize/Initialize.ts'
import * as MoveLineDown from '../MoveLineDown/MoveLineDown.ts'
import * as MoveLineUp from '../MoveLineUp/MoveLineUp.ts'
import * as RenderEditor from '../RenderEditor/RenderEditor.ts'
import * as RenderEventListeners from '../RenderEventListeners/RenderEventListeners.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'
import * as UpdateDiagnostics from '../UpdateDiagnostics/UpdateDiagnostics.ts'
import * as WrapCommands from '../WrapCommands/WrapCommands.ts'

export const commandMap = {
  'CodeGenerator.accept': CodeGeneratorAccept.codeGeneratorAccept,
  'ColorPicker.handleSliderPointerDown': ColorPicker.handleSliderPointerDown,
  'ColorPicker.handleSliderPointerMove': ColorPicker.handleSliderPointerMove,
  'ColorPicker.loadContent': ColorPicker.loadContent,
  'Editor.addCursorAbove': AddCursorAbove.addCursorAbove,
  'Editor.addCursorBelow': AddCursorBelow.addCursorBelow,
  'Editor.applyEdit': EditorApplyEdit.applyEdit,
  'Editor.braceCompletion': EditorBraceCompletion.braceCompletion,
  'Editor.cancelSelection': CancelSelection.cancelSelection,
  'Editor.closeCodeGenerator': EditorCommandCloseCodeGenerator.closeCodeGenerator,
  'Editor.closeCompletion': EditorCloseCompletion.closeCompletion,
  'Editor.closeFind': EditorCommandCloseFind.closeFind,
  'Editor.closeRename': CloseRename.closeRename,
  'Editor.closeSourceAction': EditorCommandCloseSourceAction.closeSourceAction,
  'Editor.compositionEnd': Composition.compositionEnd,
  'Editor.compositionStart': Composition.compositionStart,
  'Editor.compositionUpdate': Composition.compositionUpdate,
  'Editor.contextMenu': ContextMenu.handleContextMenu,
  'Editor.copy': Copy.copy,
  'Editor.copyLineDown': CopyLineDown.copyLineDown,
  'Editor.copyLineUp': CopyLineUp.copyLineUp,
  'Editor.create': CreateEditor.createEditor,
  'Editor.cursorCharacterLeft': CursorCharacterLeft.cursorCharacterLeft,
  'Editor.cursorCharacterRight': CursorCharacterRight.cursorCharacterRight,
  'Editor.cursorDown': CursorDown.cursorDown,
  'Editor.cursorEnd': CursorEnd.cursorEnd,
  'Editor.cursorHome': CursorHome.cursorHome,
  'Editor.cursorLeft': CursorCharacterLeft.cursorCharacterLeft,
  'Editor.cursorRight': CursorCharacterRight.cursorCharacterRight,
  'Editor.cursorSet': EditorCursorSet.cursorSet,
  'Editor.cursorUp': CursorUp.cursorUp,
  'Editor.cursorWordLeft': CursorWordLeft.cursorWordLeft,
  'Editor.cursorWordPartLeft': CursorWordPartLeft.cursorWordPartLeft,
  'Editor.cursorWordPartRight': CursorWordPartRight.cursorWordPartRight,
  'Editor.cursorWordRight': CursorWordRight.cursorWordRight,
  'Editor.cut': Cut.cut,
  'Editor.deleteAllLeft': DeleteAllLeft.deleteAllLeft,
  'Editor.deleteAllRight': DeleteAllRight.deleteAllRight,
  'Editor.deleteCharacterLeft': DeleteCharacterLeft.deleteCharacterLeft,
  'Editor.deleteCharacterRight': DeleteCharacterRight.deleteCharacterRight,
  'Editor.deleteHorizontalRight': DeleteHorizontalRight.editorDeleteHorizontalRight,
  'Editor.deleteLeft': DeleteCharacterLeft.deleteCharacterLeft,
  'Editor.deleteRight': DeleteCharacterRight.deleteCharacterRight,
  'Editor.deleteWordLeft': DeleteWordLeft.deleteWordLeft,
  'Editor.deleteWordPartLeft': DeleteWordPartLeft.deleteWordPartLeft,
  'Editor.deleteWordPartRight': DeleteWordPartRight.deleteWordPartRight,
  'Editor.deleteWordRight': DeleteWordRight.deleteWordRight,
  'Editor.findAllReferences': FindAllReferences.findAllReferences,
  'Editor.format': EditorFormat.format,
  'Editor.getKeyBindings': GetKeyBindings.getKeyBindings,
  'Editor.getQuickPickMenuEntries': GetQuickPickMenuEntries.getQuickPickMenuEntries,
  'Editor.getSelections': GetSelections.getSelections,
  'Editor.getText': GetText.getText,
  'Editor.getWordAt': GetWordAt.getWordAt,
  'Editor.getWordBefore': GetWordAt.getWordBefore,
  'Editor.goToDefinition': EditorGoToDefinition.goToDefinition,
  'Editor.goToTypeDefinition': EditorGoToTypeDefinition.goToTypeDefinition,
  'Editor.handleBeforeInput': HandleBeforeInput.handleBeforeInput,
  'Editor.handleBeforeInputFromContentEditable': EditorCommandHandleNativeBeforeInputFromContentEditable.handleBeforeInputFromContentEditable,
  'Editor.handleBlur': EditorBlur.handleBlur,
  'Editor.handleContextMenu': EditorCommandHandleContextMenu.handleContextMenu,
  'Editor.handleDoubleClick': HandleDoubleClick.handleDoubleClick,
  'Editor.handleFocus': HandleFocus.handleFocus,
  'Editor.handleMouseDown': HandleMouseDown.handleMouseDown,
  'Editor.handleMouseMove': HandleMouseMove.handleMouseMove,
  'Editor.handleMouseMoveWithAltKey': EditorCommandHandleMouseMoveWithAltKey.handleMouseMoveWithAltKey,
  'Editor.handleNativeSelectionChange': HandleNativeSelectionChange.editorHandleNativeSelectionChange,
  'Editor.handlePointerCaptureLost': HandlePointerCaptureLost.handlePointerCaptureLost,
  'Editor.handleScrollBarClick': HandleScrollBarPointerDown.handleScrollBarPointerDown,
  'Editor.handleScrollBarHorizontalMove': HandleScrollBarHorizontalMove.handleScrollBarHorizontalMove,
  'Editor.handleScrollBarHorizontalPointerDown': HandleScrollBarHorizontalPointerDown.handleScrollBarHorizontalPointerDown,
  'Editor.handleScrollBarMove': HandleScrollBarMove.handleScrollBarMove,
  'Editor.handleScrollBarPointerDown': HandleScrollBarPointerDown.handleScrollBarPointerDown,
  'Editor.handleScrollBarVerticalMove': EditorCommandHandleScrollBarMove.handleScrollBarVerticalPointerMove,
  'Editor.handleScrollBarVerticalPointerDown': HandleScrollBarPointerDown.handleScrollBarPointerDown,
  'Editor.handleScrollBarVerticalPointerMove': EditorCommandHandleScrollBarMove.handleScrollBarVerticalPointerMove,
  'Editor.handleSingleClick': HandleSingleClick.handleSingleClick,
  'Editor.handleTab': HandleTab.handleTab,
  'Editor.handleTouchEnd': HandleTouchEnd.handleTouchEnd,
  'Editor.handleTouchMove': HandleTouchMove.handleTouchMove,
  'Editor.handleTouchStart': HandleTouchStart.handleTouchStart,
  'Editor.handleTripleClick': HandleTripleClick.handleTripleClick,
  'Editor.indendLess': IndentLess.indentLess,
  'Editor.indentMore': IndentMore.indentMore,
  'Editor.insertLineBreak': InsertLineBreak.insertLineBreak,
  'Editor.moveLineDown': MoveLineDown.moveLineDown,
  'Editor.moveLineUp': MoveLineUp.moveLineUp,
  'Editor.moveRectangleSelection': MoveRectangleSelection.moveRectangleSelection,
  'Editor.moveRectangleSelectionPx': MoveRectangleSelectionPx.moveRectangleSelectionPx,
  'Editor.moveSelection': EditorMoveSelection.editorMoveSelection,
  'Editor.moveSelectionPx': EditorMoveSelectionPx.moveSelectionPx,
  'Editor.offsetAt': TextDocument.offsetAt,
  'Editor.openCodeGenerator': EditorCommandOpenCodeGenerator.openCodeGenerator,
  'Editor.openColorPicker': EditorOpenColorPicker.openColorPicker,
  'Editor.openCompletion': EditorOpenCompletion.openCompletion,
  'Editor.openFind': OpenFind.openFind,
  'Editor.openFind2': OpenFind2.openFind2,
  'Editor.openRename': EditorCommandOpenRename.openRename,
  'Editor.organizeImports': OrganizeImports.organizeImports,
  'Editor.paste': EditorPaste.paste,
  'Editor.pasteText': PasteText.pasteText,
  'Editor.render': RenderEditor.renderEditor,
  'Editor.renderEventListeners': RenderEventListeners.renderEventListeners,
  'Editor.replaceRange': ReplaceRange.replaceRange,
  'Editor.rerender': EditorRerender.rerender,
  'Editor.save': Save.save,
  'Editor.selectAll': SelectAll.selectAll,
  'Editor.selectAllLeft': SelectAllLeft.editorSelectAllLeft,
  'Editor.selectAllOccurrences': SelectAllOccurrences.selectAllOccurrences,
  'Editor.selectAllRight': SelectAllRight.editorSelectAllRight,
  'Editor.selectCharacterLeft': SelectCharacterLeft.selectCharacterLeft,
  'Editor.selectCharacterRight': SelectCharacterRight.selectCharacterRight,
  'Editor.selectDown': SelectDown.selectDown,
  'Editor.selectInsideString': EditorSelectInsideString.selectInsideString,
  'Editor.selectionGrow': SelectionGrow.selectionGrow,
  'Editor.selectLine': SelectLine.selectLine,
  'Editor.selectNextOccurrence': SelectNextOccurrence.selectNextOccurrence,
  'Editor.selectPreviousOccurrence': SelectPreviousOccurrence.selectPreviousOccurrence,
  'Editor.selectUp': SelectUp.selectUp,
  'Editor.selectWord': SelectWord.selectWord,
  'Editor.selectWordLeft': SelectWordLeft.selectWordLeft,
  'Editor.selectWordRight': SelectWordRight.selectWordRight,
  'Editor.setDecorations': SetDecorations.setDecorations,
  'Editor.setDelta': SetDelta.setDelta,
  'Editor.setDeltaY': SetDelta.setDeltaY,
  'Editor.setLanguageId': SetLanguageId.setLanguageId,
  'Editor.setSelections': SetSelections.setSelections,
  'Editor.showHover': EditorShowHover.showHover,
  'Editor.showHover2': EditorCommandShowHover2.showHover2,
  'Editor.showSourceActions': EditorShowSourceActions2.showSourceActions,
  'Editor.showSourceActions2': EditorShowSourceActions2.showSourceActions,
  'Editor.sortLinesAscending': SortLinesAscending.sortLinesAscending,
  'Editor.tabCompletion': EditorTabCompletion.tabCompletion,
  'Editor.toggleBlockComment': EditorToggleBlockComment.toggleBlockComment,
  'Editor.toggleComment': EditorToggleComment.toggleComment,
  'Editor.toggleLineComment': EditorToggleLineComment.editorToggleLineComment,
  'Editor.type': EditorType.type,
  'Editor.typeWithAutoClosing': EditorTypeWithAutoClosing.typeWithAutoClosing,
  'Editor.undo': EditorUndo.undo,
  'Editor.unIndent': Unindent.editorUnindent,
  'Editor.updateDiagnostics': UpdateDiagnostics.updateDiagnostics,
  'EditorCompletion.advance': EditorCompletion.advance,
  'EditorCompletion.closeDetails': EditorCompletionCloseDetails.closeDetails,
  'EditorCompletion.focusFirst': EditorCompletionFocusFirst.focusFirst,
  'EditorCompletion.focusIndex': EditorCompletionFocusIndex.focusIndex,
  'EditorCompletion.focusNext': EditorCompletionFocusNext.focusNext,
  'EditorCompletion.focusPrevious': EditorCompletionFocusPrevious.focusPrevious,
  'EditorCompletion.handleEditorBlur': EditorCompletion.handleEditorBlur,
  'EditorCompletion.handleEditorClick': EditorCompletion.handleEditorClick,
  'EditorCompletion.handleEditorDeleteLeft': EditorCompletion.handleEditorDeleteLeft,
  'EditorCompletion.handleEditorType': EditorCompletion.handleEditorType,
  'EditorCompletion.handleWheel': EditorCompletionHandleWheel.handleWheel,
  'EditorCompletion.loadContent': EditorCompletion.loadContent,
  'EditorCompletion.openDetails': EditorCompletionOpenDetails.openDetails,
  'EditorCompletion.selectCurrent': EditorCompletionSelectCurrent.selectCurrent,
  'EditorCompletion.selectIndex': EditorCompletionSelectIndex.selectIndex,
  'EditorCompletion.toggleDetails': EditorCompletionToggleDetails.toggleDetails,
  'EditorRename.accept': EditorRenameAccept.accept,
  'EditorRename.handleBlur': EditorRenameHandleBlur.handleBlur,
  'EditorSourceActions.focusNext': EditorSourceActionFocusNext.focusNext,
  'FindWidget.close': FindWidget.close,
  'FindWidget.focusCloseButton': FindWidget.focusCloseButton,
  'FindWidget.focusFind': FindWidget.focusFind,
  'FindWidget.focusFirst': FindWidget.focusFirst,
  'FindWidget.focusIndex': FindWidget.focusIndex,
  'FindWidget.focusLast': FindWidget.focusLast,
  'FindWidget.focusNext': FindWidget.focusNext,
  'FindWidget.focusNextMatchButton': FindWidget.focusNextMatchButton,
  'FindWidget.focusPrevious': FindWidget.focusPrevious,
  'FindWidget.focusPreviousMatchButton': FindWidget.focusPreviousMatchButton,
  'FindWidget.focusReplace': FindWidget.focusReplace,
  'FindWidget.focusReplaceAllButton': FindWidget.focusReplaceAllButton,
  'FindWidget.focusReplaceButton': FindWidget.focusReplaceButton,
  'FindWidget.focusToggleReplace': FindWidget.focusToggleReplaceButton,
  'FindWidget.handleBlur': FindWidget.handleBlur,
  'FindWidget.handleFocus': FindWidget.handleFindWidgetFocus,
  'FindWidget.handleInput': FindWidget.handleInput,
  'FindWidget.handleReplaceAllFocus': FindWidget.handleReplaceAllFocus,
  'FindWidget.handleReplaceFocus': FindWidget.handleReplaceFocus,
  'FindWidget.handleReplaceInput': FindWidget.handleReplaceInput,
  'FindWidget.handleToggleReplaceFocus': FindWidget.handleToggleReplaceFocus,
  'FindWidget.loadContent': FindWidget.loadContent,
  'FindWidget.replaceAll': FindWidgetReplaceAll.replaceAll,
  'FindWidget.toggleReplace': FindWidget.toggleReplace,
  'Font.ensure': Font.ensure,
  'Hover.getHoverInfo': GetHoverInfo.getEditorHoverInfo,
  'Hover.handleSashPointerDown': EditorHover.handleSashPointerDown,
  'Hover.handleSashPointerMove': EditorHover.handleSashPointerMove,
  'Hover.handleSashPointerUp': EditorHover.handleSashPointerUp,
  'Hover.loadContent': EditorHover.loadContent,
  'Hover.render': EditorHoverRender.renderHover,
  'Initialize.initialize': Initialize.intialize,
}

WrapCommands.wrapCommands(commandMap)
