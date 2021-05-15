import { observable } from 'mobx';
import type MonacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import { createContext } from 'react';
import { FileSystem, FileType } from '../fs';

export const store: {
  current: MonacoEditor.Uri | null;
  deps: Set<string>;
  types: Map<string, MonacoEditor.IDisposable>;
  models: Map<string, MonacoEditor.editor.ITextModel>;
  files: Map<string, FileType>;
} = observable({
  deps: new Set<string>(),
  types: new Map<string, MonacoEditor.IDisposable>(),
  models: new Map<string, MonacoEditor.editor.ITextModel>(),
  files: new Map<string, FileType>(),
  current: null,
});

export const context = createContext(store);

export const fs = new FileSystem(store.files, new Map());
