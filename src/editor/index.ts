import * as MonacoEditor from 'monaco-editor/esm/vs/editor/editor.api';

import { loadTypes } from '../generatedTypes';

import { setupLanguages } from './languages';
import { setupAutocompletion } from './autocompletion';
import { setupDefinitionProvider } from './definitionProvider';
import { setupTypeDefinitionProvider } from './typeDefinition';
import { setupGoToDefinition } from './goToDefinition';
import { store } from '../store';

const disposables: (() => void)[] = [];

export function setup() {
  setupLanguages(MonacoEditor);

  loadTypes(MonacoEditor);

  disposables.push(
    setupAutocompletion(MonacoEditor),
    setupDefinitionProvider(MonacoEditor),
    setupTypeDefinitionProvider(MonacoEditor),
    setupGoToDefinition(MonacoEditor),
  );
}

export function dispose() {
  disposables.forEach((dispo) => {
    dispo();
  });

  store.types.forEach((item) => item.dispose());
  store.models.forEach((item) => item.dispose());
  store.types.clear();
  store.models.clear();
  store.deps.clear();
}
