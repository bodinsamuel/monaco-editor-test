/* eslint-disable global-require */
/* eslint-disable import/no-webpack-loader-syntax */
import type MonacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import { fileToModel } from './helpers/fileToModel';


// prettier-ignore
const files: { path: string; source: any }[] = [
  { path: "typescript/lib/lib.es2020.d.ts", source: require("!!raw-loader!typescript/lib/lib.es2020.d.ts").default },
  { path: "typescript/lib/lib.dom.d.ts", source: require("!!raw-loader!typescript/lib/lib.dom.d.ts").default },
  { path: "cheerio/package.json", source: require("cheerio/package.json") },
  { path: "cheerio/lib/index.d.ts", source: require("!!raw-loader!cheerio/lib/index.d.ts").default },
  // eslint-disable-next-line import/no-extraneous-dependencies
  { path: "parse-json/package.json", source: require("parse-json/package.json") },
  { path: "@types/parse-json/index.ts", source: require("!!raw-loader!@types/parse-json/index.d.ts").default },
];

export function loadTypes(monaco: typeof MonacoEditor): void {
  const loaded: string[] = [];

  for (const file of files) {
    loaded.push(file.path);

    const path = `node_modules/${file.path}`;
    const isJson = file.path.endsWith('.json');
    if (isJson) {
      file.source = JSON.stringify(file.source, null, '  ');
    } else {
      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        file.source,
        path
      );
    }

    const uri = monaco.Uri.parse(path);
    fileToModel(monaco, uri, file.source, 'typescript');
  }
}
