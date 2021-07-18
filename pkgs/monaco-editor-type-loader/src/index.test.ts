import path from 'path';
import { MonacoAutomaticFileLoader } from '.';

it('should load and generate file', async () => {
  const loader = new MonacoAutomaticFileLoader({
    rootDir: path.join(__dirname, '..', '..', '..'),
    entries: new Set([
      'cheerio',
      '@types/prettier',
      path.join(__dirname, '/testData/testData.d.ts'),
    ]),
    pathToWrite: 'gen.ts',
    logger: null,
  });
  await loader.load();

  expect(await loader.generateFile()).toMatchSnapshot();
});

it('should load nothing', async () => {
  const loader = new MonacoAutomaticFileLoader({
    rootDir: path.join(__dirname, '..', '..', '..'),
    entries: new Set(),
    pathToWrite: 'gen.ts',
    logger: null,
  });
  await loader.load();

  expect(loader.modules).toStrictEqual([]);
});

it('should auto load @types/prettier even if not specified', async () => {
  const loader = new MonacoAutomaticFileLoader({
    rootDir: path.join(__dirname, '..', '..', '..'),
    entries: new Set(['prettier']),
    pathToWrite: 'gen.ts',
    logger: null,
  });
  await loader.load();

  expect(await loader.generateFile()).toMatchSnapshot();
});

it('should not auto load @types/arg because the package is already typed', async () => {
  const loader = new MonacoAutomaticFileLoader({
    rootDir: path.join(__dirname, '..', '..', '..'),
    entries: new Set(['arg']),
    pathToWrite: 'gen.ts',
    logger: null,
  });
  await loader.load();

  expect(await loader.generateFile()).toMatchSnapshot();
});

it('should handle scoped package', async () => {
  const loader = new MonacoAutomaticFileLoader({
    rootDir: path.join(__dirname, '..', '..', '..'),
    entries: new Set(['@jest/console']),
    pathToWrite: 'gen.ts',
    logger: null,
  });
  await loader.load();

  expect(await loader.generateFile()).toMatchSnapshot();
});

it('should do something', async () => {
  const loader = new MonacoAutomaticFileLoader({
    rootDir: path.join(__dirname, '..', '..', '..'),
    entries: new Set(['readdirp']),
    pathToWrite: 'gen.ts',
    logger: null,
  });
  await loader.load();

  expect(await loader.generateFile()).toMatchSnapshot();
});
