import { terminate } from '@lvce-editor/viewlet-registry'
import * as ActivateByEvent from '../ActivateByEvent/ActivateByEvent.ts'
import * as CodeGeneratorAccept from '../CodeGeneratorAccept/CodeGeneratorAccept.ts'
import * as ColorPicker from '../ColorPicker/ColorPicker.ts'
import { createEditor2 } from '../CreateEditor2/CreateEditor2.ts'
import * as CreateEditor from '../CreateEditor/CreateEditor.ts'
import { diff2 } from '../Diff2/Diff2.ts'
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
import { getCommandIds, wrapCommand, wrapGetter } from '../EditorStates/EditorStates.ts'
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
import { loadContent } from '../LoadContent/LoadContent.ts'
import * as MoveLineDown from '../MoveLineDown/MoveLineDown.ts'
import * as MoveLineUp from '../MoveLineUp/MoveLineUp.ts'
import * as RegisterListener from '../RegisterListener/RegisterListener.ts'
import * as RenderEditor from '../RenderEditor/RenderEditor.ts'
import * as RenderEventListeners from '../RenderEventListeners/RenderEventListeners.ts'
import { saveState } from '../SaveState/SaveState.ts'
import * as SendMessagePortToExtensionHostWorker from '../SendMessagePortToExtensionHostWorker/SendMessagePortToExtensionHostWorker.ts'
import * as SetDebugEnabled from '../SetDebugEnabled/SetDebugEnabled.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'
import * as UnregisterListener from '../UnregisterListener/UnregisterListener.ts'
import * as UpdateDebugInfo from '../UpdateDebugInfo/UpdateDebugInfo.ts'
import * as UpdateDiagnostics from '../UpdateDiagnostics/UpdateDiagnostics.ts'
import { wrapCommand as wrapCommandOld } from '../WrapCommands/WrapCommands.ts'

export const commandMap = {
  'ActivateByEvent.activateByEvent': ActivateByEvent.activateByEvent,
  'CodeGenerator.accept': CodeGeneratorAccept.codeGeneratorAccept,
  'ColorPicker.loadContent': ColorPicker.loadContent,
  'Editor.addCursorAbove': wrapCommandOld(AddCursorAbove.addCursorAbove),
  'Editor.addCursorBelow': wrapCommandOld(AddCursorBelow.addCursorBelow),
  'Editor.applyDocumentEdits': wrapCommandOld(EditorCommandApplyDocumentEdits.applyDocumentEdits),
  'Editor.applyEdit': wrapCommandOld(EditorApplyEdit.applyEdit),
  'Editor.applyEdit2': ExternalGetPositionAtCursor.applyEdits2,
  'Editor.applyWorkspaceEdit': wrapCommandOld(EditorCommandApplyWorkspaceEdit.applyWorkspaceEdit),
  'Editor.braceCompletion': wrapCommandOld(EditorBraceCompletion.braceCompletion),
  'Editor.cancelSelection': wrapCommandOld(CancelSelection.cancelSelection),
  'Editor.closeCodeGenerator': wrapCommandOld(EditorCommandCloseCodeGenerator.closeCodeGenerator),
  'Editor.closeFind': wrapCommandOld(EditorCommandCloseFind.closeFind),
  'Editor.closeFind2': ExternalGetPositionAtCursor.closeFind2,
  'Editor.closeRename': wrapCommandOld(CloseRename.closeRename),
  'Editor.closeSourceAction': wrapCommandOld(EditorCommandCloseSourceAction.closeSourceAction),
  'Editor.closeWidget2': ExternalGetPositionAtCursor.closeWidget2,
  'Editor.compositionEnd': wrapCommandOld(Composition.compositionEnd),
  'Editor.compositionStart': wrapCommandOld(Composition.compositionStart),
  'Editor.compositionUpdate': wrapCommandOld(Composition.compositionUpdate),
  'Editor.contextMenu': wrapCommandOld(ContextMenu.handleContextMenu),
  'Editor.copy': wrapCommandOld(Copy.copy),
  'Editor.copyLineDown': wrapCommandOld(CopyLineDown.copyLineDown),
  'Editor.copyLineUp': wrapCommandOld(CopyLineUp.copyLineUp),
  'Editor.create': CreateEditor.createEditor,
  'Editor.create2': createEditor2,
  'Editor.cursorCharacterLeft': wrapCommandOld(CursorCharacterLeft.cursorCharacterLeft),
  'Editor.cursorCharacterRight': wrapCommandOld(CursorCharacterRight.cursorCharacterRight),
  'Editor.cursorDown': wrapCommandOld(CursorDown.cursorDown),
  'Editor.cursorEnd': wrapCommandOld(CursorEnd.cursorEnd),
  'Editor.cursorHome': wrapCommandOld(CursorHome.cursorHome),
  'Editor.cursorLeft': wrapCommandOld(CursorCharacterLeft.cursorCharacterLeft),
  'Editor.cursorRight': wrapCommandOld(CursorCharacterRight.cursorCharacterRight),
  'Editor.cursorSet': wrapCommandOld(EditorCursorSet.cursorSet),
  'Editor.cursorUp': wrapCommandOld(CursorUp.cursorUp),
  'Editor.cursorWordLeft': wrapCommandOld(CursorWordLeft.cursorWordLeft),
  'Editor.cursorWordPartLeft': wrapCommandOld(CursorWordPartLeft.cursorWordPartLeft),
  'Editor.cursorWordPartRight': wrapCommandOld(CursorWordPartRight.cursorWordPartRight),
  'Editor.cursorWordRight': wrapCommandOld(CursorWordRight.cursorWordRight),
  'Editor.cut': wrapCommandOld(Cut.cut),
  'Editor.deleteAll': wrapCommandOld(DeleteAll.deleteAll),
  'Editor.deleteAllLeft': wrapCommandOld(DeleteAllLeft.deleteAllLeft),
  'Editor.deleteAllRight': wrapCommandOld(DeleteAllRight.deleteAllRight),
  'Editor.deleteCharacterLeft': wrapCommandOld(DeleteCharacterLeft.deleteCharacterLeft),
  'Editor.deleteCharacterRight': wrapCommandOld(DeleteCharacterRight.deleteCharacterRight),
  'Editor.deleteHorizontalRight': wrapCommandOld(DeleteHorizontalRight.editorDeleteHorizontalRight),
  'Editor.deleteLeft': wrapCommandOld(DeleteCharacterLeft.deleteCharacterLeft),
  'Editor.deleteRight': wrapCommandOld(DeleteCharacterRight.deleteCharacterRight),
  'Editor.deleteWordLeft': wrapCommandOld(DeleteWordLeft.deleteWordLeft),
  'Editor.deleteWordPartLeft': wrapCommandOld(DeleteWordPartLeft.deleteWordPartLeft),
  'Editor.deleteWordPartRight': wrapCommandOld(DeleteWordPartRight.deleteWordPartRight),
  'Editor.deleteWordRight': wrapCommandOld(DeleteWordRight.deleteWordRight),
  'Editor.diff2': diff2,
  'Editor.executeWidgetCommand': wrapCommandOld(ExecuteWidgetCommand.executeWidgetCommand),
  'Editor.findAllReferences': wrapCommandOld(FindAllReferences.findAllReferences),
  'Editor.format': wrapCommandOld(EditorFormat.format),
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
  'Editor.goToDefinition': wrapCommandOld(EditorGoToDefinition.goToDefinition),
  'Editor.goToTypeDefinition': wrapCommandOld(EditorGoToTypeDefinition.goToTypeDefinition),
  'Editor.handleBeforeInput': wrapCommandOld(HandleBeforeInput.handleBeforeInput),
  'Editor.handleBeforeInputFromContentEditable': wrapCommandOld(
    EditorCommandHandleNativeBeforeInputFromContentEditable.handleBeforeInputFromContentEditable,
  ),
  'Editor.handleBlur': wrapCommandOld(EditorBlur.handleBlur),
  'Editor.handleClickAtPosition': handleClickAtPosition,
  'Editor.handleContextMenu': wrapCommandOld(EditorCommandHandleContextMenu.handleContextMenu),
  'Editor.handleDoubleClick': wrapCommandOld(HandleDoubleClick.handleDoubleClick),
  'Editor.handleFocus': wrapCommandOld(HandleFocus.handleFocus),
  'Editor.handleMouseDown': wrapCommandOld(HandleMouseDown.handleMouseDown),
  'Editor.handleMouseMove': wrapCommandOld(HandleMouseMove.handleMouseMove),
  'Editor.handleMouseMoveWithAltKey': wrapCommandOld(EditorCommandHandleMouseMoveWithAltKey.handleMouseMoveWithAltKey),
  'Editor.handleNativeSelectionChange': HandleNativeSelectionChange.editorHandleNativeSelectionChange,
  'Editor.handlePointerCaptureLost': wrapCommandOld(HandlePointerCaptureLost.handlePointerCaptureLost),
  'Editor.handleScrollBarClick': HandleScrollBarPointerDown.handleScrollBarPointerDown,
  'Editor.handleScrollBarHorizontalMove': wrapCommandOld(HandleScrollBarHorizontalMove.handleScrollBarHorizontalMove),
  'Editor.handleScrollBarHorizontalPointerDown': wrapCommandOld(HandleScrollBarHorizontalPointerDown.handleScrollBarHorizontalPointerDown),
  'Editor.handleScrollBarMove': wrapCommandOld(HandleScrollBarMove.handleScrollBarMove),
  'Editor.handleScrollBarPointerDown': wrapCommandOld(HandleScrollBarPointerDown.handleScrollBarPointerDown),
  'Editor.handleScrollBarVerticalMove': wrapCommandOld(EditorCommandHandleScrollBarMove.handleScrollBarVerticalPointerMove),
  'Editor.handleScrollBarVerticalPointerDown': wrapCommandOld(HandleScrollBarPointerDown.handleScrollBarPointerDown),
  'Editor.handleScrollBarVerticalPointerMove': wrapCommandOld(EditorCommandHandleScrollBarMove.handleScrollBarVerticalPointerMove),
  'Editor.handleSingleClick': wrapCommandOld(HandleSingleClick.handleSingleClick),
  'Editor.handleTab': wrapCommandOld(HandleTab.handleTab),
  'Editor.handleTouchEnd': wrapCommandOld(HandleTouchEnd.handleTouchEnd),
  'Editor.handleTouchMove': wrapCommandOld(HandleTouchMove.handleTouchMove),
  'Editor.handleTouchStart': wrapCommandOld(HandleTouchStart.handleTouchStart),
  'Editor.handleTripleClick': wrapCommandOld(HandleTripleClick.handleTripleClick),
  'Editor.hotReload': hotReload,
  'Editor.indendLess': wrapCommandOld(IndentLess.indentLess),
  'Editor.indentMore': wrapCommandOld(IndentMore.indentMore),
  'Editor.insertLineBreak': wrapCommandOld(InsertLineBreak.insertLineBreak),
  'Editor.loadContent': wrapCommand(loadContent),
  'Editor.moveLineDown': wrapCommandOld(MoveLineDown.moveLineDown),
  'Editor.moveLineUp': wrapCommandOld(MoveLineUp.moveLineUp),
  'Editor.moveRectangleSelection': wrapCommandOld(MoveRectangleSelection.moveRectangleSelection),
  'Editor.moveRectangleSelectionPx': wrapCommandOld(MoveRectangleSelectionPx.moveRectangleSelectionPx),
  'Editor.moveSelection': wrapCommandOld(EditorMoveSelection.editorMoveSelection),
  'Editor.moveSelectionPx': wrapCommandOld(EditorMoveSelectionPx.moveSelectionPx),
  'Editor.offsetAt': TextDocument.offsetAt,
  'Editor.openCodeGenerator': wrapCommandOld(EditorCommandOpenCodeGenerator.openCodeGenerator),
  'Editor.openColorPicker': wrapCommandOld(EditorOpenColorPicker.openColorPicker),
  'Editor.openCompletion': wrapCommandOld(EditorOpenCompletion.openCompletion),
  'Editor.openFind': wrapCommandOld(OpenFind.openFind),
  'Editor.openFind2': wrapCommandOld(OpenFind2.openFind2),
  'Editor.openRename': wrapCommandOld(EditorCommandOpenRename.openRename),
  'Editor.organizeImports': wrapCommandOld(OrganizeImports.organizeImports),
  'Editor.paste': wrapCommandOld(EditorPaste.paste),
  'Editor.pasteText': wrapCommandOld(PasteText.pasteText),
  'Editor.render': RenderEditor.renderEditor,
  'Editor.renderEventListeners': RenderEventListeners.renderEventListeners,
  'Editor.replaceRange': wrapCommandOld(ReplaceRange.replaceRange),
  'Editor.rerender': wrapCommandOld(EditorRerender.rerender),
  'Editor.save': wrapCommandOld(Save.save),
  'Editor.saveState': wrapGetter(saveState),
  'Editor.selectAll': wrapCommandOld(SelectAll.selectAll),
  'Editor.selectAllLeft': wrapCommandOld(SelectAllLeft.editorSelectAllLeft),
  'Editor.selectAllOccurrences': wrapCommandOld(SelectAllOccurrences.selectAllOccurrences),
  'Editor.selectAllRight': wrapCommandOld(SelectAllRight.editorSelectAllRight),
  'Editor.selectCharacterLeft': wrapCommandOld(SelectCharacterLeft.selectCharacterLeft),
  'Editor.selectCharacterRight': wrapCommandOld(SelectCharacterRight.selectCharacterRight),
  'Editor.selectDown': wrapCommandOld(SelectDown.selectDown),
  'Editor.selectInsideString': wrapCommandOld(EditorSelectInsideString.selectInsideString),
  'Editor.selectionGrow': wrapCommandOld(SelectionGrow.selectionGrow),
  'Editor.selectLine': wrapCommandOld(SelectLine.selectLine),
  'Editor.selectNextOccurrence': wrapCommandOld(SelectNextOccurrence.selectNextOccurrence),
  'Editor.selectPreviousOccurrence': wrapCommandOld(SelectPreviousOccurrence.selectPreviousOccurrence),
  'Editor.selectUp': wrapCommandOld(SelectUp.selectUp),
  'Editor.selectWord': wrapCommandOld(SelectWord.selectWord),
  'Editor.selectWordLeft': wrapCommandOld(SelectWordLeft.selectWordLeft),
  'Editor.selectWordRight': wrapCommandOld(SelectWordRight.selectWordRight),
  'Editor.setDebugEnabled': wrapCommandOld(SetDebugEnabled.setDebugEnabled),
  'Editor.setDecorations': wrapCommandOld(SetDecorations.setDecorations),
  'Editor.setDelta': wrapCommandOld(SetDelta.setDelta),
  'Editor.setDeltaY': wrapCommandOld(SetDelta.setDeltaY),
  'Editor.setLanguageId': wrapCommandOld(SetLanguageId.setLanguageId),
  'Editor.setSelections': wrapCommandOld(SetSelections.setSelections),
  'Editor.setSelections2': ExternalGetPositionAtCursor.setSelections2,
  'Editor.setText': wrapCommandOld(SetText.setText),
  'Editor.showHover': EditorShowHover.showHover,
  'Editor.showHover2': showHover3,
  'Editor.showSourceActions': EditorCommandShowSourceActions3.showSourceActions,
  'Editor.showSourceActions2': EditorCommandShowSourceActions3.showSourceActions,
  'Editor.showSourceActions3': EditorCommandShowSourceActions3.showSourceActions,
  'Editor.sortLinesAscending': wrapCommandOld(SortLinesAscending.sortLinesAscending),
  'Editor.tabCompletion': wrapCommandOld(EditorTabCompletion.tabCompletion),
  'Editor.terminate': terminate,
  'Editor.toggleBlockComment': wrapCommandOld(EditorToggleBlockComment.toggleBlockComment),
  'Editor.toggleComment': wrapCommandOld(EditorToggleComment.toggleComment),
  'Editor.toggleLineComment': wrapCommandOld(EditorToggleLineComment.editorToggleLineComment),
  'Editor.type': wrapCommandOld(EditorType.type),
  'Editor.typeWithAutoClosing': wrapCommandOld(EditorTypeWithAutoClosing.typeWithAutoClosing),
  'Editor.undo': wrapCommandOld(EditorUndo.undo),
  'Editor.unIndent': wrapCommandOld(Unindent.editorUnindent),
  'Editor.updateDebugInfo': UpdateDebugInfo.updateDebugInfo,
  'Editor.updateDiagnostics': wrapCommandOld(UpdateDiagnostics.updateDiagnostics),
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
