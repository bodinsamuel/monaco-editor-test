/* eslint-disable no-await-in-loop */
import fs from 'fs/promises';
import path from 'path';
import { MainOptions, MapModule, Module } from '../types';
import { getDependenciesInModule } from './getDependenciesInModule';

/**
 * Fetch all modules.
 */
export async function fetchModules(opts: MainOptions): Promise<Module[]> {
  const toFetch = new Set<string>(opts.entries);
  const fetched: MapModule = new Map();

  const entries = toFetch.entries();
  for (const [, filePath] of entries) {
    const folderPath = path.dirname(filePath);

    // console.log('-- Processing ', filePath);
    const text = await fs.readFile(filePath, { encoding: 'utf-8' });
    const dependencies = await getDependenciesInModule(opts, text, folderPath);

    const module = filePath.replace(opts.pathNodeModules, '').split('/')[1];
    const pathInsideModule = filePath.replace(
      path.join(opts.pathNodeModules, module, '/'),
      '',
    );
    fetched.set(filePath, {
      filePath,
      text,
      dependencies,
      module,
      pathInsideModule,
    });

    for (const dep of dependencies) {
      if (toFetch.has(dep.filePath)) {
        // console.log('already found', fp);
        continue;
      }

      if (fetched.has(dep.filePath)) {
        // console.log('already fetched', fp);
        continue;
      }

      toFetch.add(dep.filePath);
    }
  }

  return Array.from(fetched.values());
}
