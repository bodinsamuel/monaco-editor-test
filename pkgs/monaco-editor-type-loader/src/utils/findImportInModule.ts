/* eslint-disable no-cond-assign */
import path from 'path';
import {
  ES6_PATTERN,
  REQUIRE_PATTERN,
  TRIPLE_SLASHES_REGEXP,
} from '../constants';
import { MainOptions, ModuleLight } from '../types';
import { isBuiltinModule } from './isBuiltInModule';
import { isPackage } from './isPackage';
import { resolveModules } from './resolveModules';

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
): Set<string> {
  const modules = new Set<string>();
  const matches = sourceCode.matchAll(TRIPLE_SLASHES_REGEXP);
  if (!matches) {
    return modules;
  }

  for (const match of matches) {
    if (match[1] === 'path') {
      const filePath = path.join(folderPath, match[2]);
      modules.add(filePath);
    } else if (match[1] === 'lib') {
      const filePath = path.join(
        opts.pathNodeModules,
        'typescript',
        'lib',
        `lib.${match[2]}.d.ts`,
      );
      modules.add(filePath);
    } else if (match[1] === 'types') {
      const filePath = path.join(opts.pathNodeModules, match[2]);
      modules.add(filePath);
    }
  }

  return modules;
}

/**
 * Process module.
 */
export async function normalizeImports(
  opts: Pick<MainOptions, 'pathNodeModules' | 'logger'>,
  modules: Set<string>,
  folderPath: string,
): Promise<Set<string>> {
  const found = new Set<string>();
  const entries = modules.entries();

  for (const [name] of entries) {
    // Deno
    const isDenoModule = name.startsWith('https://');
    if (isDenoModule) {
      opts.logger?.warn('Deno module found, but not supported', name);
      continue;
    }

    // Package
    const isNodePackage = isPackage(name);
    if (isNodePackage) {
      if (isBuiltinModule(name)) {
        opts.logger?.info('Skipping native package', name);
        continue;
      }

      found.add(name);
      continue;
    }

    const absolutePathForModule = path.join(folderPath, `${name}.d.ts`);

    found.add(absolutePathForModule);
  }

  return found;
}

export async function findImportInModule(
  opts: Pick<MainOptions, 'pathNodeModules' | 'rootDir'>,
  sourceCode: string,
  folderPath: string,
): Promise<Map<string, ModuleLight>> {
  const res = new Set(getTripleSlashes(opts, sourceCode, folderPath));

  const imports = extractFromRegex(sourceCode);
  const normalized = await normalizeImports(opts, imports, folderPath);
  normalized.forEach((mod) => res.add(mod));

  const resolved = resolveModules(opts, normalized);

  return resolved;
}
