export function generatedTPL({
  tsVersion,
  entries,
  loadEntriesFunction,
}: {
  tsVersion: string;
  entries: string[];
  loadEntriesFunction: string;
}): string {
  return `
/* eslint-disable @typescript-eslint/no-var-requires, import/order, global-require */
// This is a generated file, do not edit.
// Built with @h1fra/monaco-type-loader; ts version v${tsVersion}

import * as MonacoEditor from 'monaco-editor/esm/vs/editor/editor.api';

interface Entry { path: string; source: any; pkg: string | false };

// prettier-ignore
export const entries: Entry[] = [
  ${entries.join('')}
];

${loadEntriesFunction.toString()}
`;
}
