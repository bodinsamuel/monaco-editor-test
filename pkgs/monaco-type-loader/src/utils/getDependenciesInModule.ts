/* eslint-disable no-cond-assign */
import path from 'path';
import {
  ES6_PATTERN,
  REQUIRE_PATTERN,
  ES6_IMPORT,
  TRIPLE_SLASHES_REGEXP,
} from '../constants';
import { MainOptions, ModuleLight } from '../types';
import { processModuleRef } from './processModule';

/**
 * Find new module to load in file.
 * Https://github.com/microsoft/TypeScript-Website/blob/d71fb1a497c77e71279075b9aca05e80f143aeee/packages/sandbox/src/typeAcquisition.ts#L354.
 * */
export function extractFromRegex(sourceCode: string): Set<string> {
  const foundModules = new Set<string>();
  let match: RegExpExecArray | null;

  while ((match = ES6_PATTERN.exec(sourceCode)) !== null) {
    console.log(match);
    if (match[6]) {
      foundModules.add(match[6]);
    }
  }

  while ((match = REQUIRE_PATTERN.exec(sourceCode)) !== null) {
    if (match[4]) {
      foundModules.add(match[4]);
    }
  }

  // while ((match = ES6_IMPORT.exec(sourceCode)) !== null) {
  //   if (match[2]) {
  //     foundModules.add(match[2]);
  //   }
  // }

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
        filePath,
      });
    }
  }

  return Array.from(modules.values());
}

export async function getDependenciesInModule(
  opts: MainOptions,
  sourceCode: string,
  folderPath: string,
): Promise<ModuleLight[]> {
  const deps = getTripleSlashes(opts, sourceCode, folderPath);

  deps.push(
    ...(await processModuleRef(extractFromRegex(sourceCode), folderPath)),
  );

  return deps;
}
