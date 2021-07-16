/* eslint-disable no-await-in-loop */
import fs from 'fs/promises';
import path from 'path';
import { MainOptions, MapModule, Module } from '../types';
import { findEntriesFromPackage } from './findEntriesFromPackage';
import { getDependenciesInModule } from './getDependenciesInModule';
import { isPackage } from './isPackage';

/**
 * Fetch all modules.
 */
export async function fetchModules(opts: MainOptions): Promise<Module[]> {
  const toFetch = new Set<string>(opts.entries);
  const fetched: MapModule = new Map();

  const entries = toFetch.entries();
  for (let [, filePath] of entries) {
    if (isPackage(filePath)) {
      const maybe = await findEntriesFromPackage(
        path.join(opts.pathNodeModules, filePath),
      );
      if (maybe.size <= 0) {
        throw new Error(`Can not find any entries for package "${filePath}"`);
      }
      [filePath] = Array.from(maybe.values());
    } else if (!path.isAbsolute(filePath)) {
      throw new Error(`Please pass an absolute filePath "${filePath}"`);
    }

    const isInsideNodeModules = filePath.includes(opts.pathNodeModules);
    const folderPath = path.dirname(filePath);

    opts.logger?.debug('-- Processing ', filePath);
    const text = await fs.readFile(filePath, { encoding: 'utf-8' });
    const dependencies = await getDependenciesInModule(opts, text, folderPath);

    let pkg = '';
    if (isInsideNodeModules) {
      const split = filePath.replace(opts.pathNodeModules, '').split('/');
      pkg = split[0].startsWith('@') ? `${split[0]}/${split[1]}` : split[0];
    }
    const pathInsidePkg = pkg
      ? filePath.replace(path.join(opts.pathNodeModules, pkg, '/'), '')
      : '';
    fetched.set(filePath, {
      filePath,
      text,
      dependencies,
      pkg,
      pathInsidePkg,
      pathMonaco: filePath.replace(opts.rootDir, ''),
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
