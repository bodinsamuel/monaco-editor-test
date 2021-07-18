import path from 'path';

import { MonacoAutomaticFileLoader } from '.';

(async () => {
  const loader = new MonacoAutomaticFileLoader({
    rootDir: path.join(__dirname, '..', '..', '..'),
    entries: new Set([
      'cheerio',
      // 'prettier',
      // '@types/prettier',
      path.join(__dirname, '/testData/testData.d.ts'),
    ]),
    pathNodeModules: path.join(__dirname, '../../../node_modules/'),
    pathToWrite: 'gen.ts',
    // logger: null,
  });
  await loader.load();
})();
