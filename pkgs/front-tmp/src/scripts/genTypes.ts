import path from 'path';
import { MonacoAutomaticFileLoader } from '../../../monaco-editor-type-loader/src';

(async () => {
  const loader = new MonacoAutomaticFileLoader({
    rootDir: path.join(__dirname, '..'),
    entries: new Set(['cheerio', 'parse-json', './tmp/index.d.ts']),
    pathToWrite: './generatedTypes2.ts',
    // logger: null,
  });
  await loader.loadAndWrite();
})();
