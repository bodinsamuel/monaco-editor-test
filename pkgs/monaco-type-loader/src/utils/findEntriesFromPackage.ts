import path from 'path';
import fs from 'fs/promises';

export async function findEntriesFromPackage(
  pkgPath: string,
): Promise<Set<string>> {
  const pkgJson = path.join(pkgPath, 'package.json');
  const found = new Set<string>();
  let json: any;

  try {
    const text = await fs.readFile(pkgJson, { encoding: 'utf-8' });
    json = JSON.parse(text);
  } catch (e) {
    console.warn('Error while parsing a package.json', pkgJson);
    return found;
  }
  found.add(pkgJson);

  let paths = json.typing || json.typings || json.types || ['index.d.ts'];
  if (!Array.isArray(paths)) {
    paths = [paths];
  }

  for (const pathDTS of paths) {
    let fp = path.join(pkgPath, pathDTS);

    if (!fp.endsWith('d.ts')) {
      if (fp.endsWith('/')) {
        // a dir
        fp = path.join(fp, 'index.d.ts');
      } else {
        // maybe a folder not sure
        fp = `${fp}.d.ts`;
      }
    }

    try {
      const exists = await fs.stat(fp);
      if (exists) {
        found.add(fp);
        continue;
      }
    } catch (e) {
      if (e.code !== 'ENOENT') {
        console.warn('Error while finding a module', e);
      }
    }
  }

  return found;
}
