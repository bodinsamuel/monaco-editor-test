import type MonacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import { store } from '../store';

import { textSpanToRange } from '../helpers/textSpanToRange';

/**
 * Inspired by: https://github.com/microsoft/monaco-typescript/blob/e7d5b97033b3a498bd58612f957bc03ce06006cf/src/languageFeatures.ts#L755
 */
class DefinitionProvider implements MonacoEditor.languages.DefinitionProvider {
  #monaco: typeof MonacoEditor;

  constructor(monaco: typeof MonacoEditor) {
    this.#monaco = monaco;
  }

  public async provideDefinition(
    model: MonacoEditor.editor.ITextModel,
    position: MonacoEditor.Position,
  ): Promise<MonacoEditor.languages.Definition | undefined> {
    const resource = model.uri;
    const offset = model.getOffsetAt(position);

    if (model.isDisposed()) {
      // Can be disposed apparently
      return undefined;
    }

    const worker =
      await this.#monaco.languages.typescript.getTypeScriptWorker();
    const entries = await (
      await worker(model.uri)
    ).getDefinitionAtPosition(resource.toString(), offset);

    if (!entries || model.isDisposed()) {
      // Can be disposed apparently (maybe because of the await)
      return undefined;
    }

    const result: MonacoEditor.languages.Location[] = [];
    for (const entry of entries) {
      const uri = this.#monaco.Uri.parse(entry.fileName);
      const refModel = store.models.get(uri.path);
      if (refModel) {
        result.push({
          uri,
          range: textSpanToRange(refModel, entry.textSpan),
        });
      }
    }

    return result;
  }
}

export function setupDefinitionProvider(monaco: typeof MonacoEditor) {
  const disposableTS = monaco.languages.registerDefinitionProvider(
    'typescript',
    new DefinitionProvider(monaco),
  );
  const disposableJS = monaco.languages.registerDefinitionProvider(
    'javascript',
    new DefinitionProvider(monaco),
  );

  return () => {
    disposableTS.dispose();
    disposableJS.dispose();
  };
}
