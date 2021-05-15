import type MonacoEditor from 'monaco-editor/esm/vs/editor/editor.api';

export const store = {
  deps: new Set<string>(),
  types: new Map<string, MonacoEditor.IDisposable>(),
  models: new Map<string, MonacoEditor.editor.ITextModel>(),
};
