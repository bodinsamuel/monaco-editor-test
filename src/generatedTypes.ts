/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
/* eslint-disable import/no-webpack-loader-syntax */
import type MonacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import { store, fs } from './store/index';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const packageRegex = /.*?([-a-zA-Z0-9_]+)\/package\.json/;

// prettier-ignore
const files: { path: string; source: any; pkg: string | false }[] = [
  { path: "/node_modules/@types/node/package.json", source: require("@types/node/package.json"), pkg: '@types/node' },
  { path: "/node_modules/@types/node/buffer.d.ts", source: require("!!raw-loader!@types/node/buffer.d.ts").default, pkg: '@types/node' },
  { path: "/node_modules/@types/node/index.d.ts", source: require("!!raw-loader!@types/node/index.d.ts").default, pkg: '@types/node' },

  { path: "/node_modules/typescript/lib/lib.es2020.d.ts", source: require("!!raw-loader!typescript/lib/lib.es2020.d.ts").default, pkg: 'typescript' },
  { path: "/node_modules/typescript/lib/lib.dom.d.ts", source: require("!!raw-loader!typescript/lib/lib.dom.d.ts").default, pkg: 'typescript' },

  { path: "/node_modules/domelementtype/package.json", source: require("domhandler/node_modules/domelementtype/package.json"), pkg: 'domelementtype' },
  { path: "/node_modules/domelementtype/lib/index.d.ts", source: require("!!raw-loader!domhandler/node_modules/domelementtype/lib/index.d.ts").default, pkg: 'domelementtype' },

  { path: "/node_modules/htmlparser2/package.json", source: require("htmlparser2/package.json"), pkg: 'htmlparser2' },
  { path: "/node_modules/htmlparser2/lib/Parser.d.ts", source: require("!!raw-loader!htmlparser2/lib/Parser.d.ts").default, pkg: 'htmlparser2' },
  { path: "/node_modules/htmlparser2/lib/Tokenizer.d.ts", source: require("!!raw-loader!htmlparser2/lib/Tokenizer.d.ts").default, pkg: 'htmlparser2' },
  { path: "/node_modules/htmlparser2/lib/FeedHandler.d.ts", source: require("!!raw-loader!htmlparser2/lib/FeedHandler.d.ts").default, pkg: 'htmlparser2' },
  { path: "/node_modules/htmlparser2/lib/WritableStream.d.ts", source: require("!!raw-loader!htmlparser2/lib/WritableStream.d.ts").default, pkg: 'htmlparser2' },
  { path: "/node_modules/htmlparser2/lib/index.d.ts", source: require("!!raw-loader!htmlparser2/lib/index.d.ts").default, pkg: 'htmlparser2' },

  { path: "/node_modules/domhandler/package.json", source: require("domhandler/package.json"), pkg: 'domhandler' },
  { path: "/node_modules/domhandler/lib/node.d.ts", source: require("!!raw-loader!domhandler/lib/node.d.ts").default, pkg: 'domhandler' },
  { path: "/node_modules/domhandler/lib/index.d.ts", source: require("!!raw-loader!domhandler/lib/index.d.ts").default, pkg: 'domhandler' },

  { path: "/node_modules/cheerio/package.json", source: require("cheerio/package.json"), pkg: 'cheerio' },
  { path: "/node_modules/cheerio/lib/cheerio.d.ts", source: require("!!raw-loader!cheerio/lib/cheerio.d.ts").default , pkg: 'cheerio'},
  { path: "/node_modules/cheerio/lib/options.d.ts", source: require("!!raw-loader!cheerio/lib/options.d.ts").default, pkg: 'cheerio' },
  { path: "/node_modules/cheerio/lib/static.d.ts", source: require("!!raw-loader!cheerio/lib/static.d.ts").default, pkg: 'cheerio' },
  { path: "/node_modules/cheerio/lib/load.d.ts", source: require("!!raw-loader!cheerio/lib/load.d.ts").default, pkg: 'cheerio' },
  { path: "/node_modules/cheerio/lib/types.d.ts", source: require("!!raw-loader!cheerio/lib/types.d.ts").default, pkg: 'cheerio' },
  { path: "/node_modules/cheerio/lib/utils.d.ts", source: require("!!raw-loader!cheerio/lib/utils.d.ts").default, pkg: 'cheerio' },
  { path: "/node_modules/cheerio/lib/api/attributes.d.ts", source: require("!!raw-loader!cheerio/lib/api/attributes.d.ts").default, pkg: 'cheerio' },
  { path: "/node_modules/cheerio/lib/api/traversing.d.ts", source: require("!!raw-loader!cheerio/lib/api/traversing.d.ts").default, pkg: 'cheerio' },
  { path: "/node_modules/cheerio/lib/api/manipulation.d.ts", source: require("!!raw-loader!cheerio/lib/api/manipulation.d.ts").default, pkg: 'cheerio' },
  { path: "/node_modules/cheerio/lib/api/css.d.ts", source: require("!!raw-loader!cheerio/lib/api/css.d.ts").default, pkg: 'cheerio' },
  { path: "/node_modules/cheerio/lib/api/forms.d.ts", source: require("!!raw-loader!cheerio/lib/api/forms.d.ts").default, pkg: 'cheerio' },
  { path: "/node_modules/cheerio/lib/index.d.ts", source: require("!!raw-loader!cheerio/lib/index.d.ts").default, pkg: 'cheerio' },

  { path: "/node_modules/parse-json/package.json", source: require("parse-json/package.json"), pkg: 'parse-json'},
  { path: "/node_modules/parse-json/index.d.ts", source: require("!!raw-loader!@types/parse-json/index.d.ts").default, pkg: 'parse-json' },

  // TODO move this elsewhere
  { path: "/algoliaSettings.ts", source: require("!!raw-loader!./tmp/algoliaSettings.ts").default, pkg: false },
  { path: "/fileTypes.ts", source: require("!!raw-loader!./tmp/fileTypes.ts").default, pkg: false },
  { path: "/config.ts", source: require("!!raw-loader!./tmp/config.ts").default, pkg: false },
  { path: "/index.ts", source: require("!!raw-loader!./tmp/index.ts").default, pkg: false },
  { path: "/crawler.d.ts", source: require("!!raw-loader!./tmp/crawler.d.ts").default, pkg: false },
];

export function loadTypes(monaco: typeof MonacoEditor): void {
  for (const file of files) {
    const uri = monaco.Uri.parse(file.path);
    const isJson = file.path.endsWith('.json');

    if (isJson) {
      // package.json
      if (typeof file.source !== 'string') {
        // First load is good but HMR makes json -> string
        file.source = JSON.stringify(file.source, null, '  ');
      }
      store.deps.add(file.pkg as string);
    } else {
      // d.ts
      const disposable =
        monaco.languages.typescript.typescriptDefaults.addExtraLib(
          file.source,
          file.path,
        );
      store.types.set(file.path, disposable);
    }

    fs.writeFile(file.path, file.source);

    // 'typescript' type is mandatory to make TS understand package.json as module
    store.getOrCreateModel(monaco, uri, file.source, 'typescript');
  }
}
