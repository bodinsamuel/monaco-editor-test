import path from 'path';
import fs from 'fs/promises';
import { MainOptions, ModuleLight } from '../types';
import { resolveModules } from './resolveModules';

export async function findEntriesFromPackage(
  opts: Pick<MainOptions, 'logger' | 'rootDir'>,
  pkgJson: string,
): Promise<[Record<string, any>, Set<ModuleLight>]> {
  const { logger } = opts;
  const pkgPath = path.dirname(pkgJson);
  const found = new Set<ModuleLight>();
  let json: Record<string, any>;

  try {
    const text = await fs.readFile(pkgJson, { encoding: 'utf-8' });
    json = JSON.parse(text);
  } catch (e) {
    logger?.warn('Error while parsing a package.json', pkgJson, e.message);
    return [{}, found];
  }

  let paths = json.typing || json.typings || json.types || ['index.d.ts'];
  if (!Array.isArray(paths)) {
    paths = [paths];
  }

  const toResolve = new Set<string>();
  for (const pathDTS of paths) {
    let fp = path.join(pkgPath, pathDTS);

    if (!fp.endsWith('d.ts')) {
      if (fp.endsWith('/')) {
        // a dir
        fp = path.join(fp, 'index.d.ts');
      } else if (!path.basename(fp).includes('.')) {
        fp = `${fp}.d.ts`;
      } else {
        logger?.warn('Skipping this file', fp);
      }
    }

    toResolve.add(fp);
  }
  resolveModules(opts, toResolve).forEach((resolve) => {
    found.add(resolve);
  });

  return [json, found];
}
