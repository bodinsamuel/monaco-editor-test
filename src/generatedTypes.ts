/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
/* eslint-disable import/no-webpack-loader-syntax */
import type MonacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import { fileToModel } from './helpers/fileToModel';


// prettier-ignore
const files: { path: string; source: any }[] = [
  { path: "/node_modules/@types/node/package.json", source: require("@types/node/package.json") },
  { path: "/node_modules/@types/node/buffer.d.ts", source: require("!!raw-loader!@types/node/buffer.d.ts").default },
  { path: "/node_modules/@types/node/index.d.ts", source: require("!!raw-loader!@types/node/index.d.ts").default },

  { path: "/node_modules/typescript/lib/lib.es2020.d.ts", source: require("!!raw-loader!typescript/lib/lib.es2020.d.ts").default },
  { path: "/node_modules/typescript/lib/lib.dom.d.ts", source: require("!!raw-loader!typescript/lib/lib.dom.d.ts").default },

  { path: "/node_modules/domelementtype/package.json", source: require("domhandler/node_modules/domelementtype/package.json") },
  { path: "/node_modules/domelementtype/lib/index.d.ts", source: require("!!raw-loader!domhandler/node_modules/domelementtype/lib/index.d.ts").default },

  { path: "/node_modules/htmlparser2/package.json", source: require("htmlparser2/package.json") },
  { path: "/node_modules/htmlparser2/lib/Parser.d.ts", source: require("!!raw-loader!htmlparser2/lib/Parser.d.ts").default },
  { path: "/node_modules/htmlparser2/lib/Tokenizer.d.ts", source: require("!!raw-loader!htmlparser2/lib/Tokenizer.d.ts").default },
  { path: "/node_modules/htmlparser2/lib/FeedHandler.d.ts", source: require("!!raw-loader!htmlparser2/lib/FeedHandler.d.ts").default },
  { path: "/node_modules/htmlparser2/lib/WritableStream.d.ts", source: require("!!raw-loader!htmlparser2/lib/WritableStream.d.ts").default },
  { path: "/node_modules/htmlparser2/lib/index.d.ts", source: require("!!raw-loader!htmlparser2/lib/index.d.ts").default },

  { path: "/node_modules/domhandler/package.json", source: require("domhandler/package.json") },
  { path: "/node_modules/domhandler/lib/node.d.ts", source: require("!!raw-loader!domhandler/lib/node.d.ts").default },
  { path: "/node_modules/domhandler/lib/index.d.ts", source: require("!!raw-loader!domhandler/lib/index.d.ts").default },

  { path: "/node_modules/cheerio/package.json", source: require("cheerio/package.json") },
  { path: "/node_modules/cheerio/lib/cheerio.d.ts", source: require("!!raw-loader!cheerio/lib/cheerio.d.ts").default },
  { path: "/node_modules/cheerio/lib/options.d.ts", source: require("!!raw-loader!cheerio/lib/options.d.ts").default },
  { path: "/node_modules/cheerio/lib/static.d.ts", source: require("!!raw-loader!cheerio/lib/static.d.ts").default },
  { path: "/node_modules/cheerio/lib/load.d.ts", source: require("!!raw-loader!cheerio/lib/load.d.ts").default },
  { path: "/node_modules/cheerio/lib/types.d.ts", source: require("!!raw-loader!cheerio/lib/types.d.ts").default },
  { path: "/node_modules/cheerio/lib/utils.d.ts", source: require("!!raw-loader!cheerio/lib/utils.d.ts").default },
  { path: "/node_modules/cheerio/lib/api/attributes.d.ts", source: require("!!raw-loader!cheerio/lib/api/attributes.d.ts").default },
  { path: "/node_modules/cheerio/lib/api/traversing.d.ts", source: require("!!raw-loader!cheerio/lib/api/traversing.d.ts").default },
  { path: "/node_modules/cheerio/lib/api/manipulation.d.ts", source: require("!!raw-loader!cheerio/lib/api/manipulation.d.ts").default },
  { path: "/node_modules/cheerio/lib/api/css.d.ts", source: require("!!raw-loader!cheerio/lib/api/css.d.ts").default },
  { path: "/node_modules/cheerio/lib/api/forms.d.ts", source: require("!!raw-loader!cheerio/lib/api/forms.d.ts").default },
  { path: "/node_modules/cheerio/lib/index.d.ts", source: require("!!raw-loader!cheerio/lib/index.d.ts").default },

  { path: "/node_modules/parse-json/package.json", source: require("parse-json/package.json") },
  { path: "/node_modules/parse-json/index.d.ts", source: require("!!raw-loader!@types/parse-json/index.d.ts").default },

  { path: "/tmp/algoliaSettings.ts", source: require("!!raw-loader!./tmp/algoliaSettings.ts").default },
  { path: "/tmp/fileTypes.ts", source: require("!!raw-loader!./tmp/fileTypes.ts").default },
  { path: "/tmp/config.ts", source: require("!!raw-loader!./tmp/config.ts").default },
];

export function loadTypes(monaco: typeof MonacoEditor): void {
  const loaded: string[] = [];

  for (const file of files) {
    loaded.push(file.path);

    const isJson = file.path.endsWith('.json');
    if (isJson) {
      file.source = JSON.stringify(file.source, null, '  ');
    } else {
      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        file.source,
        file.path
      );
    }

    const uri = monaco.Uri.parse(file.path);
    fileToModel(monaco, uri, file.source, 'typescript');
  }

  monaco.languages.typescript.typescriptDefaults.addExtraLib(
    `import type { Config } from '/tmp/config';
    declare global {
      class Crawler  { constructor(config: Config) };
      function crawler(params: Config): boolean;
    }`,
    '/test.d.ts'
  );

  monaco.languages.typescript.typescriptDefaults.addExtraLib(
    `declare module 'dom-serializer' {};
    declare module 'domutils' {};`,
    '/global.d.ts'
  );
}
