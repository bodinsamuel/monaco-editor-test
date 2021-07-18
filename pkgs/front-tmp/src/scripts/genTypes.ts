import { MonacoAutomaticFileLoader } from '@h1fra/monaco-editor-type-loader/src';

(async () => {
  const loader = new MonacoAutomaticFileLoader({
    rootDir: path.join(__dirname, '..', '..', '..'),
    entries: new Set([
      'cheerio',
      '@types/prettier',
      path.join(__dirname, '/testData/testData.d.ts'),
    ]),
    pathNodeModules: path.join(__dirname, '../../../node_modules/'),
    pathToWrite: 'gen.ts',
    logger: null,
  });
  await loader.load();

  expect(await loader.generateFile()).toMatchSnapshot();
})();
