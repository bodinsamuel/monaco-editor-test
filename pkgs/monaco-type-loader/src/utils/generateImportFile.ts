import { MainOptions, Module } from '../types';
import { generatedTPL } from '../tpl/generated';

export function generateImportFile(
  opts: MainOptions,
  { modules, tsVersion }: { modules: Module[]; tsVersion: string },
) {
  const entries = modules.map((l) => {
    const strRequire = JSON.stringify(`!!raw-loader!${l.pathMonaco}`);
    return `{ pkg: ${l.pkg ? `"${l.pkg}"` : false}, path: "${
      l.pathMonaco
    }", source: require(${strRequire}).default },`;
  });

  return generatedTPL({
    tsVersion,
    entries,
  });
}
