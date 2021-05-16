import * as MonacoEditor from 'monaco-editor/esm/vs/editor/editor.api';

/**
 * Load a model into MonacoEditor.
 */
export function openModel(
  uri: MonacoEditor.Uri,
  monaco: typeof MonacoEditor,
  editor: MonacoEditor.editor.IStandaloneCodeEditor,
  states: Map<
    MonacoEditor.Uri,
    MonacoEditor.editor.ICodeEditorViewState | null
  >,
): void {
  const model = monaco.editor.getModel(uri);

  editor.setModel(model);

  // Restore the editor state for the file
  const state = states.get(uri);

  if (state) {
    editor.restoreViewState(state);
  }

  editor.focus();
}
