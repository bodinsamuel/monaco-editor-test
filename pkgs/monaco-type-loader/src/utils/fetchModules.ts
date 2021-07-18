/* eslint-disable no-await-in-loop */
import fs from 'fs/promises';
import path from 'path';
import { MainOptions, MapModule, Module } from '../types';
import { findEntriesFromPackage } from './findEntriesFromPackage';
import { getDependenciesInModule } from './getDependenciesInModule';
import { resolveModules } from './resolveModules';

/**
 * Fetch all modules.
 */
export async function fetchModules(opts: MainOptions): Promise<Module[]> {
  const fetched: MapModule = new Map();
  const queued = resolveModules(opts, opts.entries);

  for (const [, mod] of queued) {
    // Handle special package.json
    if (mod.type === 'package') {
      const [json, entries] = await findEntriesFromPackage(opts, mod.filePath);

      entries.forEach((entry) => {
        queued.set(entry.filePath, entry);
      });

      fetched.set(mod.filePath, {
        ...mod,
        dependencies: [],
        pathInsidePkg: mod.filePath,
        pathMonaco: mod.filePath.replace(opts.rootDir, ''),
        pkg: json.name, // TODO
        text: JSON.stringify(json),
      });
      continue;
    }

    const isInsideNodeModules = mod.filePath.includes(opts.pathNodeModules);
    const folderPath = path.dirname(mod.filePath);

    const text = await fs.readFile(mod.filePath, { encoding: 'utf-8' });
    const dependencies = await getDependenciesInModule(opts, text, folderPath);

    let pkg = '';
    if (isInsideNodeModules) {
      const split = mod.filePath.replace(opts.pathNodeModules, '').split('/');
      pkg = split[0].startsWith('@') ? `${split[0]}/${split[1]}` : split[0];
    }

    const pathInsidePkg = pkg
      ? mod.filePath.replace(path.join(opts.pathNodeModules, pkg, '/'), '')
      : '';
    fetched.set(mod.filePath, {
      filePath: mod.filePath,
      text,
      dependencies: Array.from(dependencies.values()),
      pkg,
      pathInsidePkg,
      pathMonaco: mod.filePath.replace(opts.rootDir, ''),
      type: 'typescript',
    });

    // Finally add new files in the current loop to continue fetching
    for (const [fp, dep] of dependencies) {
      if (queued.has(fp)) {
        continue;
      }

      queued.set(fp, dep);
    }
  }

  return Array.from(fetched.values());
}
