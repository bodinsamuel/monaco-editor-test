import type MonacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import { store } from '../store/index';

const regex = /(([\s|\n]from\s)|(\brequire\b\())["|']\.*/;
const triggerCharacters = ["'", '"', '.', '/'];

/**
 * This setup autocompletion for import and require syntax
 */
export function setupAutocompletion(monaco: typeof MonacoEditor) {
  function provideCompletionItems(
    model: MonacoEditor.editor.ITextModel,
    position: MonacoEditor.Position
  ): MonacoEditor.languages.CompletionList {
    // Get editor content before the pointer
    const textUntilPosition = model.getValueInRange(
      {
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      },
      1
    );

    if (!regex.test(textUntilPosition)) {
      // we are not in an import or a require
      return { suggestions: [] };
    }

    if (!textUntilPosition.endsWith('.')) {
      // User is trying to import a dependency
      if (store.deps.size <= 0) {
        return { suggestions: [] };
      }

      return {
        suggestions: Array.from(store.deps.values()).map((name) => ({
          label: name,
          kind: monaco.languages.CompletionItemKind.Module,
          detail: name,
          insertText: name,
          range: undefined as any, // required but seems not important
        })),
      };
    }

    return { suggestions: [] };
    // User is trying to import a file
    // const prefix = textUntilPosition.match(/[./]+$/)![0];

    // const modulesByPath = new WeakMap();
    // this.sandbox.modules.forEach(module => {
    //   const path = getModulePath(
    //     this.sandbox.modules,
    //     this.sandbox.directories,
    //     module.id
    //   );

    //   modulesByPath.set(
    //     module,
    //     path.indexOf('/') === -1 ? '/' + path : path
    //   );
    // });

    // const currentModulePath = modulesByPath.get(this.currentModule);
    // if (!currentModulePath) {
    //   return null;
    // }

    // const relativePath = join(dirname(currentModulePath), prefix);
    // return store.modules
    //   .filter(m => {
    //     const path = modulesByPath.get(m);

    //     return (
    //       path &&
    //       m.id !== this.currentModule.id &&
    //       path.startsWith(relativePath)
    //     );
    //   })
    //   .map(module => {
    //     let path = modulesByPath.get(module);

    //     if (!path) return null;

    //     // Don't keep extension for JS files
    //     if (path.endsWith('.js')) {
    //       path = path.replace(/\.js$/, '');
    //     }

    //     // Don't keep extension for TS files
    //     if (path.endsWith('.ts')) {
    //       path = path.replace(/\.ts$/, '');
    //     }

    //     return {
    //       label:
    //         prefix +
    //         path.replace(relativePath, relativePath === '/' ? '/' : ''),
    //       insertText: path.slice(
    //         relativePath === '/' ? 0 : relativePath.length
    //       ),
    //       kind: monaco.languages.CompletionItemKind.File,
    //     };
    //   })
    //   .filter(Boolean);
  }
  const disposableJS = monaco.languages.registerCompletionItemProvider(
    'javascript',
    {
      triggerCharacters,
      provideCompletionItems,
    }
  );

  const disposableTS = monaco.languages.registerCompletionItemProvider(
    'typescript',
    {
      triggerCharacters,
      provideCompletionItems,
    }
  );

  return () => {
    disposableJS.dispose();
    disposableTS.dispose();
  };
}
