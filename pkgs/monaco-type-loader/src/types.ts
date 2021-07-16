
// -------- Types
export interface ModuleEntry { path: string; name: string };

export interface Module {
  name: string;
  filePath: string;
  text: string;
  dependencies: ModuleEntry[];
  module: string;
  pathInsideModule: string;
};

export type MapModule = Map<string, Module>;

export interface MainOptions {
  modules: ModuleEntry[];
  pathToWrite: string;
  pathNodeModules: string;
}
