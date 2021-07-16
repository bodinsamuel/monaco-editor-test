import type MonacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import type { Languages } from '../../types';

/**
 * Transform a { path, file } to a monaco model.
 * Do not use outside of the store unless you don't want the file to appear in the tree.
 */
export function getOrCreateModel(
  monaco: typeof MonacoEditor,
  uri: MonacoEditor.Uri,
  file: string,
  language: Languages,
): MonacoEditor.editor.ITextModel {
  let model = monaco.editor.getModel(uri);

  if (model) {
    // If a model exists, we need to update it's value
    // This is needed because the content for the file might have been modified externally
    // Use `pushEditOperations` instead of `setValue` or `applyEdits` to preserve undo stack
    model.pushEditOperations(
      [],
      [
        {
          range: model.getFullModelRange(),
          text: file,
        },
      ],
      () => null,
    );
    return model;
  }

  model = monaco.editor.createModel(file, language, uri);
  model.updateOptions({
    tabSize: 2,
    insertSpaces: true,
  });

  return model;
}
