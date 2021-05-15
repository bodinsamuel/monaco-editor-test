/* eslint-disable class-methods-use-this */
import { dirname } from 'path';
import type { System } from 'typescript';

export enum FileType {
  FILE = 0x8000,
  DIRECTORY = 0x4000,
  SYMLINK = 0xa000,
}

export type FSMap = Map<string, FileType>;

export class FileSystem implements System {
  #files;

  #content;

  public readonly args = [];

  public readonly newLine = '\n';

  public readonly useCaseSensitiveFileNames = true;

  constructor(files: FSMap, content: Map<string, string>) {
    this.#files = files;
    this.#content = content;
  }

  createDirectory(path: string) {
    return this.#files.set(path, FileType.DIRECTORY);
  }

  directoryExists(directory: string) {
    return Array.from(this.#files.entries()).some(([path, type]) => {
      return type === FileType.DIRECTORY && path.startsWith(directory);
    });
  }

  getCurrentDirectory() {
    return '/';
  }

  getDirectories() {
    const dirs = [];
    const entries = this.#files.entries();
    for (const [path, type] of entries) {
      if (type === FileType.DIRECTORY) {
        dirs.push(path);
      }
    }
    return dirs;
  }

  getExecutingFilePath() {
    return '/';
  }

  readDirectory(path: string) {
    const files = [];
    const entries = this.#files.entries();

    for (const [filePath] of entries) {
      if (dirname(filePath) === path) {
        files.push(filePath);
      }
    }

    return files;
  }

  readDirectoryWithType(path: string): FSMap {
    const files = new Map<string, FileType>();
    const entries = this.#files.entries();
    if (path !== '/' && path.endsWith('/')) {
      // eslint-disable-next-line no-param-reassign
      path = path.substr(0, path.length - 1);
    }

    for (const [filePath, type] of entries) {
      if (dirname(filePath) === path) {
        files.set(filePath, type);
      }
    }

    return files;
  }

  exit() {}

  readFile(path: string) {
    return this.#content.get(path);
  }

  fileExists(path: string) {
    return this.#files.has(path);
  }

  resolvePath(path: string) {
    return path;
  }

  write() {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  writeFile(path: string, content: string) {
    this.#files.set(path, FileType.FILE);
    this.#content.set(path, content);
  }
}
