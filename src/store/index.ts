import { observable } from 'mobx';
import type MonacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import { createContext } from 'react';
import { FileSystem, FileType } from '../fs';

export const store = observable({
  deps: new Set<string>(),
  types: new Map<string, MonacoEditor.IDisposable>(),
  models: new Map<string, MonacoEditor.editor.ITextModel>(),
  files: new Map<string, FileType>(),
});
export const context = createContext(store);

export const fs = new FileSystem(store.files, new Map());
