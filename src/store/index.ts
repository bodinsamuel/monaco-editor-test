import * as MonacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import { observable, makeAutoObservable } from 'mobx';
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

export class Store {
  /**
   * Dependencies loaded: name of folder.
   */
  deps = new Set<string>();

  /**
   * d.ts loaded: one entry per file.
   */
  types = new Map<string, MonacoEditor.IDisposable>();

  /**
   * Every model loaded: one entry per model (file).
   */
  models = new Map<string, MonacoEditor.editor.ITextModel>();

  /**
   * Every model opened: one entry per model (file).
   */
  opened = observable(new Set<string>([]), { deep: false });

  /**
   * Virtual File System: one row per path (file + dir) loaded.
   */
  files = new Map<string, FileType>();

  /**
   * Main editor ref.
   */
  editor: MonacoEditor.editor.IStandaloneCodeEditor | null = null;

  private _current: MonacoEditor.Uri | undefined = undefined;

  constructor() {
    makeAutoObservable(this);
  }

  get current(): MonacoEditor.Uri | undefined {
    return this._current;
  }

  set current(uri: MonacoEditor.Uri | undefined) {
    this._current = uri;
    if (uri) {
      openModel(uri, MonacoEditor, this.editor!, editorStates);
      this.opened.add(uri.path);
    }
  }

  static toUri(uri: string): MonacoEditor.Uri {
    return MonacoEditor.Uri.parse(uri);
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

  closeTab(uri: string) {
    const isFocused = this.current?.path === uri;

    if (!isFocused) {
      // We close other tab without anything else todo
      this.opened.delete(uri);
      return;
    }

    if (this.opened.size === 1) {
      // close self
      this.opened.delete(uri);
      this.current = undefined;
      return;
    }

    // Pick next tab on the right (basic heuristic, could be better)
    let nextTab: string | undefined;
    const entries = Array.from(this.opened.values());

    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < entries.length; index++) {
      const entry = entries[index];
      if (entry !== uri) {
        continue;
      }

      if (index + 1 === entries.length) {
        // last item, take the left one
        nextTab = entries[index - 1];
      } else {
        nextTab = entries[index + 1];
      }
      break;
    }

    this.opened.delete(uri);
    if (nextTab) {
      this.current = MonacoEditor.Uri.parse(nextTab);
    } else {
      this.current = undefined;
    }
  }
}

export const store: Store = new Store();

export const context = createContext(store);

export const fs = new FileSystem(store.files, new Map());
