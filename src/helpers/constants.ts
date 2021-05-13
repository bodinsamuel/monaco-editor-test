import type MonacoEditor from 'monaco-editor/esm/vs/editor/editor.api';

export const DEFAULT_OPTIONS: MonacoEditor.editor.IEditorOptions = {
  automaticLayout: true,
  folding: true,
  fontFamily: "'Fira Code', monospace",
  fontLigatures: true,
  fontSize: 13,
  links: true,
  minimap: { enabled: false },
  quickSuggestions: true,
  readOnly: false,
  scrollBeyondLastLine: false,
  selectOnLineNumbers: true,
  showUnused: true,
  suggest: {},
  wordWrapColumn: 120,
};

export const DEFAULT_READONLY_OPTIONS: MonacoEditor.editor.IEditorOptions = {
  ...DEFAULT_OPTIONS,
  automaticLayout: true,
  contextmenu: false,
  folding: false,
  hideCursorInOverviewRuler: true,
  highlightActiveIndentGuide: false,
  lineNumbers: 'off',
  minimap: { enabled: false },
  readOnly: true,
  renderLineHighlight: 'none',
  scrollBeyondLastLine: false,
  renderIndentGuides: false,
  overviewRulerLanes: 0,
  cursorStyle: 'underline-thin',
};
