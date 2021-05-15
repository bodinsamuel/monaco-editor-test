import * as MonacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import { StaticServices } from 'monaco-editor/esm/vs/editor/standalone/browser/standaloneServices';
import React, { useEffect, useRef, useCallback } from 'react';
import { useMount, useUnmount } from 'react-use';

import {
  DEFAULT_OPTIONS,
  DEFAULT_READONLY_OPTIONS,
} from '../helpers/constants';
import { loadTypes } from '../generatedTypes';
import { setupLanguages } from '../editor/languages';
import { setupAutocompletion } from '../editor/autocompletion';
import { store } from '../store/index';

const codeEditorService = StaticServices.codeEditorService.get();

// Store editor states such as cursor position, selection and scroll position for each model
const editorStates = new Map<
  MonacoEditor.Uri,
  MonacoEditor.editor.ICodeEditorViewState | null
>();

interface Props {
  uri: MonacoEditor.Uri;
  theme?: 'vs-dark' | 'vs-light';
  override?: MonacoEditor.editor.IEditorOptions;

  onChange?: (
    content: string,
    editor: MonacoEditor.editor.IStandaloneCodeEditor,
    monaco: typeof MonacoEditor
  ) => any;
  onOpenFile?: (
    editor: MonacoEditor.editor.IStandaloneCodeEditor,
    monaco: typeof MonacoEditor
  ) => void;
}

export const CodeEditor: React.FC<Props> = ({
  uri,
  theme = 'vs-dark',
  override,
  onChange,
  onOpenFile,
}) => {
  const refNode = useRef<HTMLDivElement>(null);
  const refEditor = useRef<MonacoEditor.editor.IStandaloneCodeEditor>();
  const prevPath = useRef<MonacoEditor.Uri>();
  const refSubscription = useRef<MonacoEditor.IDisposable>();
  const disposables = useRef<(() => void)[]>([]);

  /**
   * Load a model into MonacoEditor.
   */
  const openFile = useCallback((): void => {
    const model = MonacoEditor.editor.getModel(uri);

    refEditor.current!.setModel(model);

    // Restore the editor state for the file
    const editorState = editorStates.get(uri);

    if (editorState) {
      refEditor.current!.restoreViewState(editorState);
    }

    refEditor.current!.focus();

    // Subscribe to change in value so we can notify the parent
    if (refSubscription.current) {
      refSubscription.current.dispose();
    }

    if (onOpenFile) {
      onOpenFile(refEditor.current!, MonacoEditor);
    }

    refSubscription.current = refEditor
      .current!.getModel()!
      .onDidChangeContent(() => {
        const value = refEditor.current!.getModel()!.getValue();

        if (onChange) {
          onChange(value, refEditor.current!, MonacoEditor);
        }
      });
  }, [uri, onChange, onOpenFile]);

  useMount(() => {
    console.log('on mount a');

    if (!refNode.current) {
      return;
    }

    prevPath.current = uri;

    const base = override?.readOnly
      ? DEFAULT_READONLY_OPTIONS
      : DEFAULT_OPTIONS;

    refEditor.current = MonacoEditor.editor.create(
      refNode.current,
      { ...base, ...override, theme },
      {
        codeEditorService: Object.assign(Object.create(codeEditorService), {
          openCodeEditor: async ({ options }: any, editor: any) => {
            // Open the file with this path
            // This should set the model with the path and value
            // this.props.onOpenPath(resource.path);

            // Move cursor to the desired position
            editor.setSelection(options.selection);

            // Scroll the editor to bring the desired line into focus
            editor.revealLine(options.selection.startLineNumber);

            return Promise.resolve({
              getControl: () => editor,
            });
          },
        }),
      }
    );

    setupLanguages(MonacoEditor);

    loadTypes(MonacoEditor);

    disposables.current.push(setupAutocompletion(MonacoEditor));

    openFile();
  });

  useUnmount(() => {
    console.log('on unmount');
    if (refSubscription.current) {
      refSubscription.current.dispose();
    }
    if (refEditor.current) {
      refEditor.current.dispose();
    }

    disposables.current.forEach((item) => {
      item();
    });

    store.types.forEach((item) => item.dispose());
    store.models.forEach((item) => item.dispose());
    store.types.clear();
    store.models.clear();
    store.deps.clear();
  });

  // componentDidUpdate for file change
  useEffect(() => {
    if (!prevPath.current || prevPath.current.toString() !== uri.toString()) {
      // Only change state if the previous path is different, this is useful to only retrigger monaco model creation
      editorStates.set(prevPath.current!, refEditor.current!.saveViewState());
      openFile();
      prevPath.current = uri;
    }

    // if (refEditor.current!.getModel()!.getValue() !== file.sourceCode) {
    //   // Happen when file is modified from outside the editor (from api, prettier, stores, etc...)
    //   const model = refEditor.current!.getModel()!;
    //   model.pushEditOperations(
    //     [],
    //     [
    //       {
    //         range: model.getFullModelRange(),
    //         text: file.sourceCode,
    //       },
    //     ],
    //     () => null
    //   );
    // }
  }, [uri, openFile]);

  // Theme change
  useEffect(() => {
    MonacoEditor.editor.setTheme(theme);
  }, [theme]);

  // Others options change
  useEffect(() => {
    if (override) {
      refEditor.current!.updateOptions(override);
    }
  }, [override]);

  return <div ref={refNode} style={{ height: '100vh' }} />;
};
