import path from 'path';
import { load } from '.';

it('should load', async () => {
  const res = await load({
    rootDir: path.join(__dirname, '..', '..', '..'),
    entries: [
      'cheerio',
      '@types/prettier',
      path.join(__dirname, '/testData/testData.d.ts'),
    ],
    pathNodeModules: path.join(__dirname, '../../../node_modules/'),
    pathToWrite: 'gen.ts',
    logger: null,
  });
  expect(res).toMatchSnapshot();
});
