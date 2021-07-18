export interface ModuleLight {
  type: 'package' | 'typescript';
  filePath: string;
}

export interface Module extends ModuleLight {
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
  entries: Set<string>;
  pathToWrite?: string;
  logger?: Logger | null;
}
