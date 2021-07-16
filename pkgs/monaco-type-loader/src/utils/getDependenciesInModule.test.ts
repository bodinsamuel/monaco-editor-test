import { extractFromRegex, getTripleSlashes } from './getDependenciesInModule';

describe('getTripleSlashes', () => {
  it('should find path', () => {
    const res = getTripleSlashes(
      {
        pathNodeModules: '/node_modules/',
      },
      `/// <reference path="helpers.d.ts" />
    foobar`,
      '/node_modules/@types/eslint/',
    );
    expect(res).toStrictEqual([
      { filePath: '/node_modules/@types/eslint/helpers.d.ts' },
    ]);
  });

  it('should find lib', () => {
    const res = getTripleSlashes(
      {
        pathNodeModules: '/node_modules/',
      },
      `/// <reference lib="es2019.array" />
    foobar`,
      '/node_modules/@types/eslint/',
    );
    expect(res).toStrictEqual([
      { filePath: '/node_modules/typescript/lib/lib.es2019.array.d.ts' },
    ]);
  });
});

describe('extractFromRegex', () => {
  it('should find import', () => {
    const res = extractFromRegex(`
      import { JSONSchema4 } from 'json-schema';
      import * as ESTree from 'estree';
      import { foo } from './bar';
      export * from './hello;
      import world = require('./world')`);
    expect(res).toStrictEqual(
      new Set(['./bar', './hello', './world', 'json-schema', 'estree']),
    );
  });

  it('should find require', () => {
    const res = extractFromRegex(`
    const fs = require('fs')
    const fsp = require('fs/promises')
    const { foo } = require('./bar')`);
    expect(res).toStrictEqual(new Set(['./bar', 'fs', 'fs/promises']));
  });

  it.only('should find er', () => {
    const res = extractFromRegex(`
      export * from './hello;`);
    expect(res).toStrictEqual(
      new Set(['./bar', './hello', './world', 'json-schema', 'estree']),
    );
  });
});
