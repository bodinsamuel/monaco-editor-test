import * as MonacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import { StaticServices } from 'monaco-editor/esm/vs/editor/standalone/browser/standaloneServices';
import React, { useEffect, useRef } from 'react';
import { useMount, useUnmount } from 'react-use';

import { DEFAULT_OPTIONS, DEFAULT_READONLY_OPTIONS } from '../editor/constants';
import { loadTypes } from '../generatedTypes';
import { setupLanguages } from '../editor/languages';
import { setupAutocompletion } from '../editor/autocompletion';
import { store } from '../store/index';
import { setupDefinitionProvider } from '../editor/definitionProvider';
import { setupTypeDefinitionProvider } from '../editor/typeDefinition';
import { setupGoToDefinition } from '../editor/goToDefinition';

const codeEditorService = StaticServices.codeEditorService.get();

interface Props {
  uri?: MonacoEditor.Uri;
  theme?: 'vs-dark' | 'vs-light';
  override?: MonacoEditor.editor.IEditorOptions;

  onChange?: (
    content: string,
    editor: MonacoEditor.editor.IStandaloneCodeEditor,
    monaco: typeof MonacoEditor,
  ) => any;
  onOpenFile?: (
    uri: MonacoEditor.Uri,
    editor: MonacoEditor.editor.IStandaloneCodeEditor,
    monaco: typeof MonacoEditor,
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

  const openFile = (): void => {
    // Subscribe to change in value so we can notify the parent
    if (refSubscription.current) {
      refSubscription.current.dispose();
    }

    if (onOpenFile) {
      onOpenFile(uri!, refEditor.current!, MonacoEditor);
    }

    refSubscription.current = refEditor
      .current!.getModel()!
      .onDidChangeContent(() => {
        const value = refEditor.current!.getModel()!.getValue();

        if (onChange) {
          onChange(value, refEditor.current!, MonacoEditor);
        }
      });
  };

  useMount(() => {
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
        // codeEditorService: Object.assign(Object.create(codeEditorService), {
        //   openCodeEditor: async ({ options }: any, editor: any) => {
        //     // Open the file with this path
        //     // This should set the model with the path and value
        //     // this.props.onOpenPath(resource.path);
        //     // Move cursor to the desired position
        //     editor.setSelection(options.selection);
        //     // Scroll the editor to bring the desired line into focus
        //     editor.revealLine(options.selection.startLineNumber);
        //     return Promise.resolve({
        //       getControl: () => editor,
        //     });
        //   },
        // }),
      },
    );
    store.editor = refEditor.current;

    setupLanguages(MonacoEditor);

    loadTypes(MonacoEditor);

    disposables.current.push(
      setupAutocompletion(MonacoEditor),
      setupDefinitionProvider(MonacoEditor),
      setupTypeDefinitionProvider(MonacoEditor),
      setupGoToDefinition(MonacoEditor),
    );

    openFile();
  });

  useUnmount(() => {
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
    if (
      uri &&
      (!prevPath.current || prevPath.current.toString() !== uri.toString())
    ) {
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

  return <div ref={refNode} style={{ height: '100%' }} />;
};
