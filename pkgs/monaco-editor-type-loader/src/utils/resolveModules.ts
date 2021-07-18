import path from 'path';
import { MainOptions, ModuleLight } from '../types';
import { isPackage } from './isPackage';

export function resolveModules(
  opts: Pick<MainOptions, 'logger' | 'rootDir'>,
  entries: Set<string>,
): Map<string, ModuleLight> {
  const { logger } = opts;
  const rawEntries = Array.from(entries.values());
  const parsedEntries = new Map<string, ModuleLight>();
  const nodeModulesPaths = [...require.main!.paths].filter((p) =>
    p.startsWith(opts.rootDir),
  );

  for (const entry of rawEntries) {
    try {
      if (isPackage(entry)) {
        const pkgJson = path.join(entry, 'package.json');
        const resolvePkg = require.resolve(pkgJson, {
          paths: nodeModulesPaths,
        });
        parsedEntries.set(resolvePkg, {
          filePath: resolvePkg,
          type: 'package',
        });

        if (entry.startsWith('@types/')) {
          // Special case for @types, they do not resolve
          continue;
        }
        // For now skip index.js
        continue;
      }

      const resolve = require.resolve(entry, {
        paths: nodeModulesPaths,
      });
      parsedEntries.set(resolve, {
        filePath: resolve,
        type: 'typescript',
      });
    } catch (e) {
      if (e.code === 'MODULE_NOT_FOUND') {
        logger?.log(`Can not resolve ${entry}`);
        continue;
      }
      throw e;
    }
  }

  return parsedEntries;
}
