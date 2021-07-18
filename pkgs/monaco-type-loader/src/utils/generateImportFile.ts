import { MainOptions, Module } from '../types';
import { generatedTPL } from '../tpl/generated';

export function generateImportFile(
  opts: MainOptions,
  { modules, tsVersion }: { modules: Module[]; tsVersion: string },
) {
  const entries = modules.map((mod) => {
    const strRequire = JSON.stringify(`!!raw-loader!${mod.pathMonaco}`);
    const req = `require(${strRequire})${
      mod.type === 'typescript' ? '.default' : ''
    }`;
    return `{ pkg: ${mod.pkg ? `"${mod.pkg}"` : false}, path: "${
      mod.pathMonaco
    }", source: ${req} },`;
  });

  return generatedTPL({
    tsVersion,
    entries,
  });
}
