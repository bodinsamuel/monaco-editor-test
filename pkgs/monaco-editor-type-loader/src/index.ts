import fs from 'fs/promises';
import path from 'path';
import prettier from 'prettier';

import { MainOptions, Module } from './types';
import { fetchModules } from './utils/fetchModules';
import { generateImportFile } from './utils/generateImportFile';
import { shouldBeDir } from './utils/shouldBeDir';

function debug({ logger, rootDir }: MainOptions, modules: Module[]) {
  logger?.debug('');
  logger?.debug('Found', modules.length, 'modules');
  logger?.debug(
    modules
      .map(({ filePath, dependencies, pkg }) => {
        return `- [${pkg}] ${filePath.replace(rootDir, '')}
  => deps: [${dependencies
    .map(({ filePath: _fp }) => _fp.replace(rootDir, ''))
    .join(', ')}]`;
      })
      .join('\r\n'),
  );
  logger?.debug('');
}

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
    const { logger, rootDir } = this.#opts;
    logger?.debug('Monaco Automatic File Loader starting...');

    await shouldBeDir(rootDir, 'rootDir');

    logger?.debug('Fetching...');

    const modules = await fetchModules(this.#opts);
    this.#modules.push(...modules);

    debug(this.#opts, modules);
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
    const pathToWrite = path.isAbsolute(this.#opts.pathToWrite!)
      ? this.#opts.pathToWrite!
      : path.join(this.#opts.rootDir, this.#opts.pathToWrite!);
    await this.load();

    await fs.writeFile(pathToWrite!, await this.generateFile());
  }
}
