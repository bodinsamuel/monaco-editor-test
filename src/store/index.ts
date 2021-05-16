import * as MonacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import { makeAutoObservable } from 'mobx';
import { createContext } from 'react';
import { getOrCreateModel } from '../editor/helpers/getOrCreateModel';
import { openModel } from '../editor/helpers/openModel';
import { FileSystem, FileType } from '../fs';
import type { Languages } from '../types';

// Store editor states such as cursor position, selection and scroll position for each model
export const editorStates = new Map<
  MonacoEditor.Uri,
  MonacoEditor.editor.ICodeEditorViewState | null
>();

class Store {
  deps = new Set<string>();

  types = new Map<string, MonacoEditor.IDisposable>();

  models = new Map<string, MonacoEditor.editor.ITextModel>();

  files = new Map<string, FileType>();

  editor: MonacoEditor.editor.IStandaloneCodeEditor | null = null;

  private _current: MonacoEditor.Uri | undefined = undefined;

  private _currentLoaded: MonacoEditor.Uri | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get current() {
    return this._current;
  }

  set current(uri: MonacoEditor.Uri | undefined) {
    this._current = uri;
    if (uri) {
      openModel(uri, MonacoEditor, this.editor!, editorStates);
    }
  }

  get currentLoaded() {
    return this._currentLoaded;
  }

  set currentLoaded(uri: MonacoEditor.Uri | null) {
    this._currentLoaded = uri;
  }

  getOrCreateModel(
    monaco: typeof MonacoEditor,
    uri: MonacoEditor.Uri,
    file: string,
    language: Languages,
  ): MonacoEditor.editor.ITextModel {
    const model = getOrCreateModel(monaco, uri, file, language);

    this.models.set(uri.path, model);

    return model;
  }
}

export const store: Store = new Store();

export const context = createContext(store);

export const fs = new FileSystem(store.files, new Map());
