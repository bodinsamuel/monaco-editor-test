/* eslint-disable no-cond-assign */
import path from 'path';
import fs from 'fs/promises';
import {
  ES6_PATTERN,
  REQUIRE_PATTERN,
  TRIPLE_SLASHES_REGEXP,
} from '../constants';
import { MainOptions, ModuleLight } from '../types';
import { findEntriesFromPackage } from './findEntriesFromPackage';
import { isPackage } from './isPackage';

/**
 * Find new module to load in file.
 * Https://github.com/microsoft/TypeScript-Website/blob/d71fb1a497c77e71279075b9aca05e80f143aeee/packages/sandbox/src/typeAcquisition.ts#L354.
 * */
export function extractFromRegex(sourceCode: string): Set<string> {
  const foundModules = new Set<string>();
  let match: RegExpExecArray | null;

  while ((match = ES6_PATTERN.exec(sourceCode)) !== null) {
    if (match[6]) {
      foundModules.add(match[6]);
    }
  }

  while ((match = REQUIRE_PATTERN.exec(sourceCode)) !== null) {
    if (match[4]) {
      foundModules.add(match[4]);
    }
  }

  return foundModules;
}

/**
 * Find triple slashes in a file.
 */
export function getTripleSlashes(
  opts: Pick<MainOptions, 'pathNodeModules'>,
  sourceCode: string,
  folderPath: string,
): ModuleLight[] {
  const matches = sourceCode.matchAll(TRIPLE_SLASHES_REGEXP);
  if (!matches) {
    return [];
  }

  const modules = new Map<string, ModuleLight>();
  for (const match of matches) {
    if (match[1] === 'path') {
      const filePath = path.join(folderPath, match[2]);
      modules.set(filePath, {
        type: 'typescript',
        filePath,
      });
    } else if (match[1] === 'lib') {
      const filePath = path.join(
        opts.pathNodeModules,
        'typescript',
        'lib',
        `lib.${match[2]}.d.ts`,
      );

      modules.set(filePath, {
        type: 'typescript',
        filePath,
      });
    } else if (match[1] === 'types') {
      const filePath = path.join(opts.pathNodeModules, match[2]);

      modules.set(filePath, {
        type: 'package',
        filePath,
      });
    }
  }

  return Array.from(modules.values());
}

/**
 * Process module.
 */
export async function processModules(
  opts: Pick<MainOptions, 'pathNodeModules' | 'logger'>,
  modules: Set<string>,
  folderPath: string,
): Promise<ModuleLight[]> {
  const found = new Set<ModuleLight>();
  const entries = modules.entries();

  for (const [name] of entries) {
    // console.log(`Looking at ${name}`);
    const isNodePackage = isPackage(name);
    const isDenoModule = name.startsWith('https://');

    if (isDenoModule) {
      opts.logger?.warn('Deno module found, but not supported', name);
      continue;
    }

    if (isNodePackage) {
      const maybe = await findEntriesFromPackage(
        path.join(opts.pathNodeModules, name),
      );
      maybe.forEach((fp) => found.add({ type: 'package', filePath: fp }));
      continue;
    }

    const absolutePathForModule = path.resolve(
      path.join(folderPath, `${name}.d.ts`),
    );

    try {
      const stat = await fs.lstat(absolutePathForModule);
      if (!stat.isFile()) {
        // console.log(' Not a file', absolutePathForModule);
        continue;
      }
    } catch (e) {
      opts.logger?.warn('Error while finding a module', e);
      continue;
    }

    found.add({
      type: 'typescript',
      // folderPath: path.dirname(absolutePathForModule),
      // name: path.basename(absolutePathForModule),
      filePath: absolutePathForModule,
    });
  }

  return Array.from(found);
}

export async function getDependenciesInModule(
  opts: Pick<MainOptions, 'pathNodeModules'>,
  sourceCode: string,
  folderPath: string,
): Promise<ModuleLight[]> {
  const deps = getTripleSlashes(opts, sourceCode, folderPath);

  deps.push(
    ...(await processModules(opts, extractFromRegex(sourceCode), folderPath)),
  );

  return deps;
}
