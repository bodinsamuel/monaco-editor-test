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
  for (const [, entry] of entries) {
    const { folderPath, name } = JSON.parse(entry);
    const filePath = path.join(folderPath, name);

    // console.log('-- Processing ', filePath);
    const text = await fs.readFile(filePath, { encoding: 'utf-8' });
    const dependencies = await getDependenciesInModule(text, folderPath);
    const module = filePath.replace(opts.pathNodeModules, '').split('/')[1];
    const pathInsideModule = filePath.replace(
      path.join(opts.pathNodeModules, module, '/'),
      ''
    );
    fetched.set(filePath, {
      name,
      filePath,
      text,
      dependencies,
      module,
      pathInsideModule,
    });

    for (const dep of dependencies) {
      if (toFetch.has(JSON.stringify(dep))) {
        // console.log('already found', fp);
        continue;
      }

      if (fetched.has(dep.filePath)) {
        // console.log('already fetched', fp);
        continue;
      }

      toFetch.add(JSON.stringify(dep));
    }
  }

  return Array.from(fetched.values());
}
