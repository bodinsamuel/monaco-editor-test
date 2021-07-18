import fs from 'fs/promises';
import prettier from 'prettier';

import { MainOptions, Module } from './types';
import { fetchModules } from './utils/fetchModules';
import { generateImportFile } from './utils/generateImportFile';
import { shouldBeDir } from './utils/shouldBeDir';
import { shouldBeFile } from './utils/shouldBeFile';

export class MonacoAutomaticFileLoader {
  #opts: MainOptions;

  #modules: Module[] = [];

  constructor(opts: MainOptions) {
    this.#opts = {
      ...opts,
      logger: opts.logger === undefined ? console : opts.logger,
    };
  }

  get modules() {
    return Object.freeze(this.#modules);
  }

  async load(): Promise<void> {
    const { logger, pathNodeModules, rootDir } = this.#opts;
    logger?.debug('Monaco Automatic File Loader starting...');

    await shouldBeDir(pathNodeModules, 'pathNodeModules');
    await shouldBeDir(rootDir, 'rootDir');

    logger?.debug('Fetching...');

    const modules = await fetchModules(this.#opts);
    this.#modules.push(...modules);

    logger?.debug('');
    logger?.debug('Found', modules.length, 'modules');
    logger?.debug(
      modules
        .map(({ filePath, dependencies, pkg }) => {
          return `- [${pkg}] ${filePath}
    => deps: [${dependencies.map(({ filePath: _fp }) => _fp).join(', ')}]`;
        })
        .join('\r\n'),
    );
    logger?.debug('');
  }

  async generateFile(): Promise<string> {
    const toWrite = generateImportFile(this.#opts, {
      modules: this.#modules,
      tsVersion: '0.0.0',
    });

    // format
    const prettierOptions = await prettier.resolveConfig(__dirname);
    const formatted = prettier.format(toWrite, {
      ...prettierOptions,
      filepath: 'esLibs.ts',
    });

    return formatted;
  }

  async loadAndWrite(): Promise<void> {
    await shouldBeFile(this.#opts.pathToWrite!, 'pathToWrite');
    await this.load();

    await fs.writeFile(this.#opts.pathToWrite!, await this.generateFile());
  }
}
