import type MonacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import { StandaloneCodeEditorServiceImpl } from 'monaco-editor/esm/vs/editor/standalone/browser/standaloneCodeServiceImpl';
import { store } from '../store';

/**
 * Inspired by: https://www.programmersought.com/article/9092859547/
 * TODO: better to inherit browser/service/codeServiceImpl.js
 */
export function setupGoToDefinition(monaco: typeof MonacoEditor) {
  const cFindModel = StandaloneCodeEditorServiceImpl.prototype.findModel;
  const cDoOpen = StandaloneCodeEditorServiceImpl.prototype.doOpenEditor;

  // monaco-editor (as of v24) is just comparing string instead of getting by uri
  StandaloneCodeEditorServiceImpl.prototype.findModel = function findModel(
    editor: MonacoEditor.editor.IStandaloneDiffEditor,
    resource: MonacoEditor.Uri,
  ): MonacoEditor.editor.ITextModel | null {
    let model = null;
    if (resource !== null) {
      model = monaco.editor.getModel(resource);
    }
    return model;
  };

  // monaco-editor (as of v24) is not trying to actively change file
  StandaloneCodeEditorServiceImpl.prototype.doOpenEditor =
    function doOpenEditor(
      editor: MonacoEditor.editor.IStandaloneDiffEditor,
      input: {
        options: { selection: MonacoEditor.IRange; selectionRevealType: any };
        resource: MonacoEditor.Uri;
      },
    ): MonacoEditor.editor.IStandaloneDiffEditor | null {
      const model = this.findModel(editor, input.resource);

      if (!model) {
        return null;
      }

      store.current = model.uri;

      const { selection } = input.options;
      if (!selection) {
        return editor;
      }

      if (
        typeof selection.endLineNumber === 'number' &&
        typeof selection.endColumn === 'number'
      ) {
        editor.setSelection(selection);
        editor.revealRangeInCenter(selection, 1 /* Immediate */);
      } else {
        const pos = {
          lineNumber: selection.startLineNumber,
          column: selection.startColumn,
        };
        editor.setPosition(pos);
        editor.revealPositionInCenter(pos, 1 /* Immediate */);
      }
      editor.focus();
      return editor;
    };

  return () => {
    StandaloneCodeEditorServiceImpl.prototype.findModel = cFindModel;
    StandaloneCodeEditorServiceImpl.prototype.doOpenEditor = cDoOpen;
  };
}
