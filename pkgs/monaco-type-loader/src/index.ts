import fs from 'fs/promises';
import prettier from 'prettier';

import { MainOptions, ModuleEntry } from "./types";
import { fetchModules } from './utils/fetchModules';
import { generateTypeFile } from './utils/generateTypeFile';


export async function load(opts: MainOptions): Promise<void> {
  // resolve
  const modules = await fetchModules(opts);

  console.log('');
  console.log('');
  console.log('Found', modules.length, 'types');
  console.log(
    modules
      .map(({ filePath, dependencies, module }) => {
        return `- [${module}] ${filePath}
    => deps: ${dependencies.map(({ name }) => name).join(', ')}]`;
      })
      .join('\r\n')
  );
  console.log('');

  const toWrite = generateTypeFile(opts, modules);

  // format
  const prettierOptions = await prettier.resolveConfig(__dirname);
  const formatted = prettier.format(toWrite, {
    ...prettierOptions,
    filepath: 'esLibs.ts',
  });

  return formatted;
}

export async function loadAndWrite(opts: MainOptions): Promise<void> {
  const formatted = load(opts.modules);
  await fs.writeFile(opts.path, formatted);
}
