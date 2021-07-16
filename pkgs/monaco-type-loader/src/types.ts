export interface ModuleLight {
  filePath: string;
}

export interface Module {
  filePath: string;
  text: string;
  dependencies: ModuleLight[];
  pkg: string;
  pathInsidePkg: string;
  pathMonaco: string;
}

export type MapModule = Map<string, Module>;

interface Logger {
  error(...message: any): void;
  warn(...message: any): void;
  info(...message: any): void;
  log(...message: any): void;
  debug(...message: any): void;
}

export interface MainOptions {
  rootDir: string;
  entries: string[];
  pathToWrite: string;
  pathNodeModules: string;
  logger?: Logger | null;
}
