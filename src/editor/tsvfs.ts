import type MonacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import { createSystem, createDefaultMapFromNodeModules, createVirtualCompilerHost } from "@typescript/vfs";
import ts from "typescript";

export function setupTSVFS(compilerOptions: MonacoEditor.languages.typescript.CompilerOptions) {
  const fsMap = createDefaultMapFromNodeModules({ target: ts.ScriptTarget.ES2015 });
  const system = createSystem(fsMap);

  const host = createVirtualCompilerHost(system, compilerOptions, ts);

  const program = ts.createProgram({
    rootNames: [...fsMap.keys()],
    options: compilerOptions,
    host: host.compilerHost,
  });

  return {
    program,
    system,
    fsMap,
  }
}
