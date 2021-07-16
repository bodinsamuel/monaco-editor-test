import path from 'path';
import fs from 'fs/promises';

/**
 * Process module.
 */
export async function processModuleRef(
  modules: Set<string>,
  folderPath: string
): Promise<RawDep[]> {
  const foundModules = new Set<RawDep>();
  const entries = modules.entries();

  for (const [name] of entries) {
    // console.log(`Looking at ${name}`);

    const modIsScopedPackageOnly =
      name.startsWith('@') && name.split('/').length === 2;
    const modIsPackageOnly =
      !name.startsWith('@') && name.split('/').length === 1;
    const isPackageRootImport = modIsPackageOnly || modIsScopedPackageOnly;
    const isDenoModule = name.startsWith('https://');

    if (isDenoModule || isPackageRootImport) {
      // console.log(' Skipping');
      continue;
    }
    const absolutePathForModule = path.resolve(
      path.join(folderPath, `${name}.d.ts`)
    );
    const stat = await fs.lstat(absolutePathForModule);
    if (!stat.isFile()) {
      // console.log(' Not a file', absolutePathForModule);
      continue;
    }

    foundModules.add({
      folderPath: path.dirname(absolutePathForModule),
      name: path.basename(absolutePathForModule),
    });
  }

  return Array.from(foundModules);
}
