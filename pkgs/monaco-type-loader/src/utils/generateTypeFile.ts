import { MainOptions, Module } from "../types";
import path from 'path';
import { generatedTPL } from "../tpl/generated";

const loadEntriesFunction = '';

export function generateTypeFile(opts: MainOptions, { modules, tsVersion }: { modules: Module[]; tsVersion: string }) {

  const entries = modules.map((l) => {
    const fpFromFinal = l.filePath.replace(
      path.join(opts.pathNodeModules, '/'),
      ''
    );
    const strRequire = JSON.stringify(`!!raw-loader!${fpFromFinal}`);
    return `{ path: "/node_modules/${l.module}/${l.pathInsideModule}", source: require(${strRequire}).default },`;
  });

  return generatedTPL({
    tsVersion,
    entries,
    loadEntriesFunction,
  });
}

