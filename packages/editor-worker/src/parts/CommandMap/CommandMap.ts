import * as ActivateByEvent from '../ActivateByEvent/ActivateByEvent.ts'
import * as CodeGeneratorAccept from '../CodeGeneratorAccept/CodeGeneratorAccept.ts'
import * as ColorPicker from '../ColorPicker/ColorPicker.ts'
import * as CreateEditor from '../CreateEditor/CreateEditor.ts'
import * as AddCursorAbove from '../EditorCommand/EditorCommandAddCursorAbove.ts'
import * as AddCursorBelow from '../EditorCommand/EditorCommandAddCursorBelow.ts'
import * as EditorCommandApplyDocumentEdits from '../EditorCommand/EditorCommandApplyDocumentEdits.ts'
import * as EditorApplyEdit from '../EditorCommand/EditorCommandApplyEdit.ts'
import * as EditorCommandApplyWorkspaceEdit from '../EditorCommand/EditorCommandApplyWorkspaceEdit.ts'
import * as EditorBlur from '../EditorCommand/EditorCommandBlur.ts'
import * as EditorBraceCompletion from '../EditorCommand/EditorCommandBraceCompletion.ts'
import * as CancelSelection from '../EditorCommand/EditorCommandCancelSelection.ts'
import * as EditorCommandCloseCodeGenerator from '../EditorCommand/EditorCommandCloseCodeGenerator.ts'
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
import * as DeleteAll from '../EditorCommand/EditorCommandDeleteAll.ts'
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
import { handleClickAtPosition } from '../EditorCommand/EditorCommandHandleClickAtPosition.ts'
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
import * as SetText from '../EditorCommand/EditorCommandSetText.ts'
import { showHover3 } from '../EditorCommand/EditorCommandShowHover3.ts'
import * as EditorShowHover from '../EditorCommand/EditorCommandShowHover.ts'
import * as EditorCommandShowSourceActions3 from '../EditorCommand/EditorCommandShowSourceActions3.ts'
import * as SortLinesAscending from '../EditorCommand/EditorCommandSortLinesAscending.ts'
import * as EditorTabCompletion from '../EditorCommand/EditorCommandTabCompletion.ts'
import * as EditorToggleBlockComment from '../EditorCommand/EditorCommandToggleBlockComment.ts'
import * as EditorToggleComment from '../EditorCommand/EditorCommandToggleComment.ts'
import * as EditorToggleLineComment from '../EditorCommand/EditorCommandToggleLineComment.ts'
import * as EditorType from '../EditorCommand/EditorCommandType.ts'
import * as EditorTypeWithAutoClosing from '../EditorCommand/EditorCommandTypeWithAutoClosing.ts'
import * as EditorUndo from '../EditorCommand/EditorCommandUndo.ts'
import * as Unindent from '../EditorCommand/EditorCommandUnindent.ts'
import * as EditorCompletionWidget from '../EditorCompletionWidget/EditorCompletionWidget.ts'
import * as EditorFindWidget from '../EditorFindWidget/EditorFindWidget.ts'
import * as EditorHover from '../EditorHover/EditorHover.ts'
import * as EditorHoverRender from '../EditorHoverRender/EditorHoverRender.ts'
import * as EditorListeners from '../EditorListeners/EditorListeners.ts'
import * as EditorRenameWidget from '../EditorRenameWidget/EditorRenameWidget.ts'
import * as EditorRerender from '../EditorRerender/EditorRerender.ts'
import * as EditorSourceActionFocusNext from '../EditorSourceActionFocusNext/EditorSourceActionFocusNext.ts'
import * as EditorSourceActionWidget from '../EditorSourceActionWidget/EditorSourceActionWidget.ts'
import { getCommandIds } from '../EditorStates/EditorStates.ts'
import * as ExecuteWidgetCommand from '../ExecuteWidgetCommand/ExecuteWidgetCommand.ts'
import * as ExternalGetPositionAtCursor from '../ExternalGetPositionAtCursor/ExternalGetPositionAtCursor.ts'
import * as FindWidget from '../FindWidgetFunctions/FindWidgetFunctions.ts'
import * as Font from '../Font/Font.ts'
import * as GetHoverInfo from '../GetHoverInfo/GetHoverInfo.ts'
import * as GetKeyBindings from '../GetKeyBindings/GetKeyBindings.ts'
import * as GetKeys from '../GetKeys/GetKeys.ts'
import { getMenuEntries } from '../GetMenuEntries/GetMenuEntries.ts'
import { getMenuIds } from '../GetMenuIds/GetMenuIds.ts'
import { getProblems } from '../GetProblems/GetProblems.ts'
import * as GetQuickPickMenuEntries from '../GetQuickPickMenuEntries/GetQuickPickMenuEntries.ts'
import * as GetSelections from '../GetSelections/GetSelections.ts'
import * as GetText from '../GetText/GetText.ts'
import * as HandleBeforeInput from '../HandleBeforeInput/HandleBeforeInput.ts'
import * as HandleMessagePort from '../HandleMessagePort/HandleMessagePort.ts'
import * as HandleTab from '../HandleTab/HandleTab.ts'
import { hotReload } from '../HotReload/HotReload.ts'
import * as Initialize from '../Initialize/Initialize.ts'
import * as MoveLineDown from '../MoveLineDown/MoveLineDown.ts'
import * as MoveLineUp from '../MoveLineUp/MoveLineUp.ts'
import * as RegisterListener from '../RegisterListener/RegisterListener.ts'
import * as RenderEditor from '../RenderEditor/RenderEditor.ts'
import * as RenderEventListeners from '../RenderEventListeners/RenderEventListeners.ts'
import * as SendMessagePortToExtensionHostWorker from '../SendMessagePortToExtensionHostWorker/SendMessagePortToExtensionHostWorker.ts'
import * as SetDebugEnabled from '../SetDebugEnabled/SetDebugEnabled.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'
import * as UnregisterListener from '../UnregisterListener/UnregisterListener.ts'
import * as UpdateDebugInfo from '../UpdateDebugInfo/UpdateDebugInfo.ts'
import * as UpdateDiagnostics from '../UpdateDiagnostics/UpdateDiagnostics.ts'
import { wrapCommand } from '../WrapCommands/WrapCommands.ts'

export const commandMap = {
  'ActivateByEvent.activateByEvent': ActivateByEvent.activateByEvent,
  'CodeGenerator.accept': CodeGeneratorAccept.codeGeneratorAccept,
  'ColorPicker.loadContent': ColorPicker.loadContent,
  'Editor.addCursorAbove': wrapCommand(AddCursorAbove.addCursorAbove),
  'Editor.addCursorBelow': wrapCommand(AddCursorBelow.addCursorBelow),
  'Editor.applyDocumentEdits': wrapCommand(EditorCommandApplyDocumentEdits.applyDocumentEdits),
  'Editor.applyEdit': wrapCommand(EditorApplyEdit.applyEdit),
  'Editor.applyEdit2': ExternalGetPositionAtCursor.applyEdits2,
  'Editor.applyWorkspaceEdit': wrapCommand(EditorCommandApplyWorkspaceEdit.applyWorkspaceEdit),
  'Editor.braceCompletion': wrapCommand(EditorBraceCompletion.braceCompletion),
  'Editor.cancelSelection': wrapCommand(CancelSelection.cancelSelection),
  'Editor.closeCodeGenerator': wrapCommand(EditorCommandCloseCodeGenerator.closeCodeGenerator),
  'Editor.closeFind': wrapCommand(EditorCommandCloseFind.closeFind),
  'Editor.closeFind2': ExternalGetPositionAtCursor.closeFind2,
  'Editor.closeRename': wrapCommand(CloseRename.closeRename),
  'Editor.closeSourceAction': wrapCommand(EditorCommandCloseSourceAction.closeSourceAction),
  'Editor.closeWidget2': ExternalGetPositionAtCursor.closeWidget2,
  'Editor.compositionEnd': wrapCommand(Composition.compositionEnd),
  'Editor.compositionStart': wrapCommand(Composition.compositionStart),
  'Editor.compositionUpdate': wrapCommand(Composition.compositionUpdate),
  'Editor.contextMenu': wrapCommand(ContextMenu.handleContextMenu),
  'Editor.copy': wrapCommand(Copy.copy),
  'Editor.copyLineDown': wrapCommand(CopyLineDown.copyLineDown),
  'Editor.copyLineUp': wrapCommand(CopyLineUp.copyLineUp),
  'Editor.create': CreateEditor.createEditor,
  'Editor.cursorCharacterLeft': wrapCommand(CursorCharacterLeft.cursorCharacterLeft),
  'Editor.cursorCharacterRight': wrapCommand(CursorCharacterRight.cursorCharacterRight),
  'Editor.cursorDown': wrapCommand(CursorDown.cursorDown),
  'Editor.cursorEnd': wrapCommand(CursorEnd.cursorEnd),
  'Editor.cursorHome': wrapCommand(CursorHome.cursorHome),
  'Editor.cursorLeft': wrapCommand(CursorCharacterLeft.cursorCharacterLeft),
  'Editor.cursorRight': wrapCommand(CursorCharacterRight.cursorCharacterRight),
  'Editor.cursorSet': wrapCommand(EditorCursorSet.cursorSet),
  'Editor.cursorUp': wrapCommand(CursorUp.cursorUp),
  'Editor.cursorWordLeft': wrapCommand(CursorWordLeft.cursorWordLeft),
  'Editor.cursorWordPartLeft': wrapCommand(CursorWordPartLeft.cursorWordPartLeft),
  'Editor.cursorWordPartRight': wrapCommand(CursorWordPartRight.cursorWordPartRight),
  'Editor.cursorWordRight': wrapCommand(CursorWordRight.cursorWordRight),
  'Editor.cut': wrapCommand(Cut.cut),
  'Editor.deleteAll': wrapCommand(DeleteAll.deleteAll),
  'Editor.deleteAllLeft': wrapCommand(DeleteAllLeft.deleteAllLeft),
  'Editor.deleteAllRight': wrapCommand(DeleteAllRight.deleteAllRight),
  'Editor.deleteCharacterLeft': wrapCommand(DeleteCharacterLeft.deleteCharacterLeft),
  'Editor.deleteCharacterRight': wrapCommand(DeleteCharacterRight.deleteCharacterRight),
  'Editor.deleteHorizontalRight': wrapCommand(DeleteHorizontalRight.editorDeleteHorizontalRight),
  'Editor.deleteLeft': wrapCommand(DeleteCharacterLeft.deleteCharacterLeft),
  'Editor.deleteRight': wrapCommand(DeleteCharacterRight.deleteCharacterRight),
  'Editor.deleteWordLeft': wrapCommand(DeleteWordLeft.deleteWordLeft),
  'Editor.deleteWordPartLeft': wrapCommand(DeleteWordPartLeft.deleteWordPartLeft),
  'Editor.deleteWordPartRight': wrapCommand(DeleteWordPartRight.deleteWordPartRight),
  'Editor.deleteWordRight': wrapCommand(DeleteWordRight.deleteWordRight),
  'Editor.executeWidgetCommand': wrapCommand(ExecuteWidgetCommand.executeWidgetCommand),
  'Editor.findAllReferences': wrapCommand(FindAllReferences.findAllReferences),
  'Editor.format': wrapCommand(EditorFormat.format),
  'Editor.getCommandIds': getCommandIds,
  'Editor.getDiagnostics': ExternalGetPositionAtCursor.getDiagnostics,
  'Editor.getKeyBindings': GetKeyBindings.getKeyBindings,
  'Editor.getKeys': GetKeys.getKeys,
  'Editor.getLanguageId': ExternalGetPositionAtCursor.getLanguageId,
  'Editor.getLines2': ExternalGetPositionAtCursor.getLines2,
  'Editor.getMenuEntries': getMenuEntries,
  'Editor.getMenuEntries2': getMenuEntries,
  'Editor.getMenuIds': getMenuIds,
  'Editor.getOffsetAtCursor': ExternalGetPositionAtCursor.getOffsetAtCursor,
  'Editor.getPositionAtCursor': ExternalGetPositionAtCursor.getPositionAtCursor,
  'Editor.getProblems': getProblems,
  'Editor.getQuickPickMenuEntries': GetQuickPickMenuEntries.getQuickPickMenuEntries,
  'Editor.getSelections': GetSelections.getSelections,
  'Editor.getSelections2': ExternalGetPositionAtCursor.getSelections2,
  'Editor.getSourceActions': ExternalGetPositionAtCursor.getSourceActions,
  'Editor.getText': GetText.getText,
  'Editor.getUri': ExternalGetPositionAtCursor.getUri,
  'Editor.getWordAt': GetWordAt.getWordAt,
  'Editor.getWordAt2': ExternalGetPositionAtCursor.getWordAt,
  'Editor.getWordAtOffset2': ExternalGetPositionAtCursor.getWordAtOffset2,
  'Editor.getWordBefore': GetWordAt.getWordBefore,
  'Editor.getWordBefore2': ExternalGetPositionAtCursor.getWordBefore2,
  'Editor.goToDefinition': wrapCommand(EditorGoToDefinition.goToDefinition),
  'Editor.goToTypeDefinition': wrapCommand(EditorGoToTypeDefinition.goToTypeDefinition),
  'Editor.handleBeforeInput': wrapCommand(HandleBeforeInput.handleBeforeInput),
  'Editor.handleBeforeInputFromContentEditable': wrapCommand(
    EditorCommandHandleNativeBeforeInputFromContentEditable.handleBeforeInputFromContentEditable,
  ),
  'Editor.handleBlur': wrapCommand(EditorBlur.handleBlur),
  'Editor.handleClickAtPosition': handleClickAtPosition,
  'Editor.handleContextMenu': wrapCommand(EditorCommandHandleContextMenu.handleContextMenu),
  'Editor.handleDoubleClick': wrapCommand(HandleDoubleClick.handleDoubleClick),
  'Editor.handleFocus': wrapCommand(HandleFocus.handleFocus),
  'Editor.handleMouseDown': wrapCommand(HandleMouseDown.handleMouseDown),
  'Editor.handleMouseMove': wrapCommand(HandleMouseMove.handleMouseMove),
  'Editor.handleMouseMoveWithAltKey': wrapCommand(EditorCommandHandleMouseMoveWithAltKey.handleMouseMoveWithAltKey),
  'Editor.handleNativeSelectionChange': HandleNativeSelectionChange.editorHandleNativeSelectionChange,
  'Editor.handlePointerCaptureLost': wrapCommand(HandlePointerCaptureLost.handlePointerCaptureLost),
  'Editor.handleScrollBarClick': HandleScrollBarPointerDown.handleScrollBarPointerDown,
  'Editor.handleScrollBarHorizontalMove': wrapCommand(HandleScrollBarHorizontalMove.handleScrollBarHorizontalMove),
  'Editor.handleScrollBarHorizontalPointerDown': wrapCommand(HandleScrollBarHorizontalPointerDown.handleScrollBarHorizontalPointerDown),
  'Editor.handleScrollBarMove': wrapCommand(HandleScrollBarMove.handleScrollBarMove),
  'Editor.handleScrollBarPointerDown': wrapCommand(HandleScrollBarPointerDown.handleScrollBarPointerDown),
  'Editor.handleScrollBarVerticalMove': wrapCommand(EditorCommandHandleScrollBarMove.handleScrollBarVerticalPointerMove),
  'Editor.handleScrollBarVerticalPointerDown': wrapCommand(HandleScrollBarPointerDown.handleScrollBarPointerDown),
  'Editor.handleScrollBarVerticalPointerMove': wrapCommand(EditorCommandHandleScrollBarMove.handleScrollBarVerticalPointerMove),
  'Editor.handleSingleClick': wrapCommand(HandleSingleClick.handleSingleClick),
  'Editor.handleTab': wrapCommand(HandleTab.handleTab),
  'Editor.handleTouchEnd': wrapCommand(HandleTouchEnd.handleTouchEnd),
  'Editor.handleTouchMove': wrapCommand(HandleTouchMove.handleTouchMove),
  'Editor.handleTouchStart': wrapCommand(HandleTouchStart.handleTouchStart),
  'Editor.handleTripleClick': wrapCommand(HandleTripleClick.handleTripleClick),
  'Editor.hotReload': hotReload,
  'Editor.indendLess': wrapCommand(IndentLess.indentLess),
  'Editor.indentMore': wrapCommand(IndentMore.indentMore),
  'Editor.insertLineBreak': wrapCommand(InsertLineBreak.insertLineBreak),
  'Editor.moveLineDown': wrapCommand(MoveLineDown.moveLineDown),
  'Editor.moveLineUp': wrapCommand(MoveLineUp.moveLineUp),
  'Editor.moveRectangleSelection': wrapCommand(MoveRectangleSelection.moveRectangleSelection),
  'Editor.moveRectangleSelectionPx': wrapCommand(MoveRectangleSelectionPx.moveRectangleSelectionPx),
  'Editor.moveSelection': wrapCommand(EditorMoveSelection.editorMoveSelection),
  'Editor.moveSelectionPx': wrapCommand(EditorMoveSelectionPx.moveSelectionPx),
  'Editor.offsetAt': TextDocument.offsetAt,
  'Editor.openCodeGenerator': wrapCommand(EditorCommandOpenCodeGenerator.openCodeGenerator),
  'Editor.openColorPicker': wrapCommand(EditorOpenColorPicker.openColorPicker),
  'Editor.openCompletion': wrapCommand(EditorOpenCompletion.openCompletion),
  'Editor.openFind': wrapCommand(OpenFind.openFind),
  'Editor.openFind2': wrapCommand(OpenFind2.openFind2),
  'Editor.openRename': wrapCommand(EditorCommandOpenRename.openRename),
  'Editor.organizeImports': wrapCommand(OrganizeImports.organizeImports),
  'Editor.paste': wrapCommand(EditorPaste.paste),
  'Editor.pasteText': wrapCommand(PasteText.pasteText),
  'Editor.render': RenderEditor.renderEditor,
  'Editor.renderEventListeners': RenderEventListeners.renderEventListeners,
  'Editor.replaceRange': wrapCommand(ReplaceRange.replaceRange),
  'Editor.rerender': wrapCommand(EditorRerender.rerender),
  'Editor.save': wrapCommand(Save.save),
  'Editor.selectAll': wrapCommand(SelectAll.selectAll),
  'Editor.selectAllLeft': wrapCommand(SelectAllLeft.editorSelectAllLeft),
  'Editor.selectAllOccurrences': wrapCommand(SelectAllOccurrences.selectAllOccurrences),
  'Editor.selectAllRight': wrapCommand(SelectAllRight.editorSelectAllRight),
  'Editor.selectCharacterLeft': wrapCommand(SelectCharacterLeft.selectCharacterLeft),
  'Editor.selectCharacterRight': wrapCommand(SelectCharacterRight.selectCharacterRight),
  'Editor.selectDown': wrapCommand(SelectDown.selectDown),
  'Editor.selectInsideString': wrapCommand(EditorSelectInsideString.selectInsideString),
  'Editor.selectionGrow': wrapCommand(SelectionGrow.selectionGrow),
  'Editor.selectLine': wrapCommand(SelectLine.selectLine),
  'Editor.selectNextOccurrence': wrapCommand(SelectNextOccurrence.selectNextOccurrence),
  'Editor.selectPreviousOccurrence': wrapCommand(SelectPreviousOccurrence.selectPreviousOccurrence),
  'Editor.selectUp': wrapCommand(SelectUp.selectUp),
  'Editor.selectWord': wrapCommand(SelectWord.selectWord),
  'Editor.selectWordLeft': wrapCommand(SelectWordLeft.selectWordLeft),
  'Editor.selectWordRight': wrapCommand(SelectWordRight.selectWordRight),
  'Editor.setDebugEnabled': wrapCommand(SetDebugEnabled.setDebugEnabled),
  'Editor.setDecorations': wrapCommand(SetDecorations.setDecorations),
  'Editor.setDelta': wrapCommand(SetDelta.setDelta),
  'Editor.setDeltaY': wrapCommand(SetDelta.setDeltaY),
  'Editor.setLanguageId': wrapCommand(SetLanguageId.setLanguageId),
  'Editor.setSelections': wrapCommand(SetSelections.setSelections),
  'Editor.setSelections2': ExternalGetPositionAtCursor.setSelections2,
  'Editor.setText': wrapCommand(SetText.setText),
  'Editor.showHover': EditorShowHover.showHover,
  'Editor.showHover2': showHover3,
  'Editor.showSourceActions': EditorCommandShowSourceActions3.showSourceActions,
  'Editor.showSourceActions2': EditorCommandShowSourceActions3.showSourceActions,
  'Editor.showSourceActions3': EditorCommandShowSourceActions3.showSourceActions,
  'Editor.sortLinesAscending': wrapCommand(SortLinesAscending.sortLinesAscending),
  'Editor.tabCompletion': wrapCommand(EditorTabCompletion.tabCompletion),
  'Editor.toggleBlockComment': wrapCommand(EditorToggleBlockComment.toggleBlockComment),
  'Editor.toggleComment': wrapCommand(EditorToggleComment.toggleComment),
  'Editor.toggleLineComment': wrapCommand(EditorToggleLineComment.editorToggleLineComment),
  'Editor.type': wrapCommand(EditorType.type),
  'Editor.typeWithAutoClosing': wrapCommand(EditorTypeWithAutoClosing.typeWithAutoClosing),
  'Editor.undo': wrapCommand(EditorUndo.undo),
  'Editor.unIndent': wrapCommand(Unindent.editorUnindent),
  'Editor.updateDebugInfo': UpdateDebugInfo.updateDebugInfo,
  'Editor.updateDiagnostics': wrapCommand(UpdateDiagnostics.updateDiagnostics),
  'EditorCompletion.close': EditorCompletionWidget.close,
  'EditorCompletion.closeDetails': EditorCompletionWidget.closeDetails,
  'EditorCompletion.focusFirst': EditorCompletionWidget.focusFirst,
  'EditorCompletion.focusIndex': EditorCompletionWidget.focusIndex,
  'EditorCompletion.focusNext': EditorCompletionWidget.focusNext,
  'EditorCompletion.focusPrevious': EditorCompletionWidget.focusPrevious,
  'EditorCompletion.handleEditorBlur': EditorCompletionWidget.handleEditorBlur,
  'EditorCompletion.handleEditorClick': EditorCompletionWidget.handleEditorClick,
  'EditorCompletion.handleEditorDeleteLeft': EditorCompletionWidget.handleEditorDeleteLeft,
  'EditorCompletion.handleEditorType': EditorCompletionWidget.handleEditorType,
  'EditorCompletion.handlePointerDown': EditorCompletionWidget.handlePointerDown,
  'EditorCompletion.handleWheel': EditorCompletionWidget.handleWheel,
  'EditorCompletion.openDetails': EditorCompletionWidget.openDetails,
  'EditorCompletion.selectCurrent': EditorCompletionWidget.selectCurrent,
  'EditorCompletion.selectIndex': EditorCompletionWidget.selectIndex,
  'EditorCompletion.toggleDetails': EditorCompletionWidget.toggleDetails,
  'EditorRename.accept': EditorRenameWidget.accept,
  'EditorRename.close': EditorRenameWidget.close,
  'EditorRename.handleInput': EditorRenameWidget.handleInput,
  'EditorSourceAction.close': EditorSourceActionWidget.close,
  'EditorSourceAction.closeDetails': EditorSourceActionWidget.closeDetails,
  'EditorSourceAction.focusFirst': EditorSourceActionWidget.focusFirst,
  'EditorSourceAction.focusIndex': EditorSourceActionWidget.focusIndex,
  'EditorSourceAction.focusNext': EditorSourceActionWidget.focusNext,
  'EditorSourceAction.focusPrevious': EditorSourceActionWidget.focusPrevious,
  'EditorSourceAction.handleWheel': EditorSourceActionWidget.handleWheel,
  'EditorSourceAction.selectCurrent': EditorSourceActionWidget.selectCurrent,
  'EditorSourceAction.selectIndex': EditorSourceActionWidget.selectIndex,

  'EditorSourceAction.selectItem': EditorSourceActionWidget.selectItem,
  'EditorSourceAction.toggleDetails': EditorSourceActionWidget.toggleDetails,
  'EditorSourceActions.focusNext': EditorSourceActionFocusNext.focusNext,
  'ExtensionHostManagement.activateByEvent': ActivateByEvent.activateByEvent,
  'FindWidget.close': EditorFindWidget.close,
  'FindWidget.focusCloseButton': EditorFindWidget.focusCloseButton,
  'FindWidget.focusFind': EditorFindWidget.focusFind,
  'FindWidget.focusNext': EditorFindWidget.focusNext,
  'FindWidget.focusNextElement': EditorFindWidget.focusNextElement,
  'FindWidget.focusNextMatchButton': EditorFindWidget.focusNextMatchButton,
  'FindWidget.focusPrevious': EditorFindWidget.focusPrevious,
  'FindWidget.focusPreviousElement': EditorFindWidget.focusPreviousElement,
  'FindWidget.focusPreviousMatchButton': EditorFindWidget.focusPreviousMatchButton,
  'FindWidget.focusReplace': EditorFindWidget.focusReplace,
  'FindWidget.focusReplaceAllButton': EditorFindWidget.focusReplaceAllButton,
  'FindWidget.focusReplaceButton': EditorFindWidget.focusReplaceButton,
  'FindWidget.focusToggleReplace': EditorFindWidget.focusToggleReplace,
  'FindWidget.handleBlur': EditorFindWidget.handleBlur,
  'FindWidget.handleClickButton': EditorFindWidget.handleClickButton,
  'FindWidget.handleFocus': EditorFindWidget.handleFocus,
  'FindWidget.handleInput': EditorFindWidget.handleInput,
  'FindWidget.handleReplaceFocus': EditorFindWidget.handleReplaceFocus,
  'FindWidget.handleReplaceInput': EditorFindWidget.handleReplaceInput,
  'FindWidget.handleToggleReplaceFocus': EditorFindWidget.handleToggleReplaceFocus,
  'FindWidget.loadContent': FindWidget.loadContent,
  'FindWidget.replace': EditorFindWidget.replace,
  'FindWidget.replaceAll': EditorFindWidget.replaceAll,
  'FindWidget.toggleMatchCase': EditorFindWidget.toggleMatchCase,
  'FindWidget.toggleMatchWholeWord': EditorFindWidget.toggleMatchWholeWord,
  'FindWidget.togglePreserveCase': EditorFindWidget.togglePreserveCase,
  'FindWidget.toggleReplace': EditorFindWidget.toggleReplace,
  'FindWidget.toggleUseRegularExpression': EditorFindWidget.toggleUseRegularExpression,
  'Font.ensure': Font.ensure,
  'HandleMessagePort.handleMessagePort': HandleMessagePort.handleMessagePort,
  'Hover.getHoverInfo': GetHoverInfo.getEditorHoverInfo,
  'Hover.handleSashPointerDown': EditorHover.handleSashPointerDown,
  'Hover.handleSashPointerMove': EditorHover.handleSashPointerMove,
  'Hover.handleSashPointerUp': EditorHover.handleSashPointerUp,
  'Hover.loadContent': EditorHover.loadContent,
  'Hover.render': EditorHoverRender.renderHover,
  'Initialize.initialize': Initialize.intialize,
  'Listener.register': RegisterListener.registerListener,
  'Listener.registerListener': EditorListeners.registerListener,
  'Listener.unregister': UnregisterListener.unregisterListener,
  'SendMessagePortToExtensionHostWorker.sendMessagePortToExtensionHostWorker':
    SendMessagePortToExtensionHostWorker.sendMessagePortToExtensionHostWorker2,
}
