import path from 'path';
import {
  extractFromRegex,
  getTripleSlashes,
  normalizeImports,
} from './findImportInModule';

const nm = path.join(__dirname, '../../../../node_modules/');

describe('getTripleSlashes', () => {
  it('should find path', () => {
    const res = getTripleSlashes(
      {},
      `/// <reference path="helpers.d.ts" />
    foobar`,
      '/node_modules/@types/eslint/',
    );

    expect(res).toStrictEqual(
      new Set(['/node_modules/@types/eslint/helpers.d.ts']),
    );
  });

  it('should find lib', () => {
    const res = getTripleSlashes(
      {},
      `/// <reference lib="es2019.array" />
    foobar`,
      '/node_modules/@types/eslint/',
    );

    expect(res).toStrictEqual(
      new Set(['typescript/lib/lib.es2019.array.d.ts']),
    );
  });

  it('should find types', () => {
    const res = getTripleSlashes(
      {},
      `/// <reference types="@types/cheerio" />
    foobar`,
      '/node_modules/@types/eslint/',
    );

    expect(res).toStrictEqual(new Set(['@types/cheerio']));
  });

  // does not work yet
  it.skip('should handle combined', () => {
    const res = getTripleSlashes(
      {},
      `/// <reference types="node" lib="esnext" />
    foobar`,
      '/node_modules/@types/eslint/',
    );

    expect(res).toStrictEqual(
      new Set(['/node_modules/typescript/lib/lib.esnext.d.ts']),
    );
  });
});

describe('extractFromRegex', () => {
  it('should find import', () => {
    const res = extractFromRegex(`
      import { JSONSchema4 } from 'json-schema';
      import * as ESTree from 'estree';
      import { foo } from './bar';
      export * from './hello';
      import world = require('./world')
      import { serve } from "https://deno.land/std@v0.12/http/server.ts";`);

    expect(res).toStrictEqual(
      new Set([
        './bar',
        './hello',
        './world',
        'json-schema',
        'https://deno.land/std@v0.12/http/server.ts',
        'estree',
      ]),
    );
  });

  it('should find require', () => {
    const res = extractFromRegex(`
    const estree = require("estree")
    const fs = require('fs')
    const fsp = require('fs/promises')
    const { foo } = require('./bar')`);

    expect(res).toStrictEqual(
      new Set(['./bar', 'fs', 'estree', 'fs/promises']),
    );
  });
});

describe('normalizeImports', () => {
  it('should transforms modules correctly', async () => {
    const res = normalizeImports(
      {},
      new Set(['cheerio', './helpers']),
      '/node_modules/@types/eslint/',
    );

    expect(res).toStrictEqual(
      new Set(['cheerio', '/node_modules/@types/eslint/helpers.d.ts']),
    );
  });
});
