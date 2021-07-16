import fs from 'fs/promises';
import prettier from 'prettier';

import { MainOptions } from './types';
import { fetchModules } from './utils/fetchModules';
import { generateTypeFile } from './utils/generateTypeFile';

export async function load(opts: MainOptions): Promise<string> {
  // eslint-disable-next-line no-param-reassign
  opts.logger = opts.logger === undefined ? console : opts.logger;
  const { logger } = opts;
  logger?.log('Type Loader');

  try {
    const stat = await fs.stat(opts.pathNodeModules);
    if (!stat.isDirectory()) {
      logger?.error(
        '"pathNodeModules" is not a directory',
        opts.pathNodeModules,
      );
      return '';
    }
  } catch (e) {
    logger?.error('Can not read "pathNodeModules"', opts.pathNodeModules);
    return '';
  }

  logger?.log('fetching...');

  const modules = await fetchModules(opts);

  logger?.log('');
  logger?.log('Found', modules.length, 'types');
  logger?.log(
    modules
      .map(({ filePath, dependencies, pkg }) => {
        return `- [${pkg}] ${filePath}
    => deps: [${dependencies.map(({ filePath: _fp }) => _fp).join(', ')}]`;
      })
      .join('\r\n'),
  );
  logger?.log('');

  const toWrite = generateTypeFile(opts, { modules, tsVersion: '0.0.0' });

  // format
  const prettierOptions = await prettier.resolveConfig(__dirname);
  const formatted = prettier.format(toWrite, {
    ...prettierOptions,
    filepath: 'esLibs.ts',
  });

  return formatted;
}

export async function loadAndWrite(opts: MainOptions): Promise<void> {
  const formatted = await load(opts);
  await fs.writeFile(opts.pathToWrite, formatted);
}
