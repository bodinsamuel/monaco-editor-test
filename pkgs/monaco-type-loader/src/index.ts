import fs from 'fs/promises';
import prettier from 'prettier';

import { MainOptions } from './types';
import { fetchModules } from './utils/fetchModules';
import { generateTypeFile } from './utils/generateTypeFile';

export async function load(opts: MainOptions): Promise<string> {
  const modules = await fetchModules(opts);

  console.log('');
  console.log('');
  console.log('Found', modules.length, 'types');
  console.log(
    modules
      .map(({ filePath, dependencies, module }) => {
        return `- [${module}] ${filePath}
    => deps: [${dependencies.map(({ filePath: _fp }) => _fp).join(', ')}]`;
      })
      .join('\r\n'),
  );
  console.log('');

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