import path from 'path';
import { findEntriesFromPackage } from './findEntriesFromPackage';

it("should find source-map.d.ts because it's specified as-is", async () => {
  const res = await findEntriesFromPackage(
    {
      rootDir: '',
    },
    path.join(__dirname, '../../../../node_modules/source-map/'),
  );
  expect(res).toStrictEqual(
    new Set([
      path.join(
        __dirname,
        '../../../../node_modules/source-map/source-map.d.ts',
      ),
    ]),
  );
});

it("should find index.d.ts because it's not specified but fallback", async () => {
  const res = await findEntriesFromPackage(
    {
      rootDir: '',
    },
    path.join(__dirname, '../../../../node_modules/tempy/'),
  );

  expect(res).toStrictEqual(
    new Set([
      path.join(__dirname, '../../../../node_modules/tempy/index.d.ts'),
    ]),
  );
});

it("should find nothing because it's not specified and fallback is not possible", async () => {
  // NB: yargs do expose typings in build/lib/*.d.ts
  const res = await findEntriesFromPackage(
    {
      rootDir: '',
    },

    path.join(__dirname, '../../../../node_modules/yargs/'),
  );

  expect(res).toStrictEqual(new Set([]));
});

it('should not break if package.json does not exists', async () => {
  const res = await findEntriesFromPackage(
    {
      rootDir: '',
    },
    'foobar',
  );

  expect(res).toStrictEqual(new Set([]));
});
