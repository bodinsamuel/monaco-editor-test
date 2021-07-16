import { MainOptions, Module } from '../types';
import { generatedTPL } from '../tpl/generated';

const loadEntriesFunction = '';

export function generateTypeFile(
  opts: MainOptions,
  { modules, tsVersion }: { modules: Module[]; tsVersion: string },
) {
  const entries = modules.map((l) => {
    const strRequire = JSON.stringify(`!!raw-loader!${l.filePath}`);
    return `{ pkg: "${l.pkg}", path: "${l.pathMonaco}", source: require(${strRequire}).default },`;
  });

  return generatedTPL({
    tsVersion,
    entries,
    loadEntriesFunction,
  });
}
