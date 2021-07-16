export interface ModuleLight {
  filePath: string;
}

export interface Module {
  filePath: string;
  text: string;
  dependencies: ModuleLight[];
  module: string;
  pathInsideModule: string;
}

export type MapModule = Map<string, Module>;

export interface MainOptions {
  entries: string[];
  pathToWrite: string;
  pathNodeModules: string;
}
