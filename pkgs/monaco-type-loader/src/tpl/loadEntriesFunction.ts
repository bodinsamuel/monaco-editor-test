// start
const MonacoEditor: any = {};
// end

export interface Entry {
  path: string;
  source: any;
  pkg: string | false;
}

export type Loaded = Omit<Entry, 'source'> & {
  type: 'package' | 'module';
  uri: typeof MonacoEditor.Uri;
  disposable?: typeof MonacoEditor.IDisposable;
};

export function loadEntriesFunction(
  monaco: typeof MonacoEditor,
  entries: Entry[],
  getOrCreateModel: (monaco: any, uri: any, src: string, lang: string) => void,
): Loaded[] {
  const loaded: Loaded[] = [];

  for (const file of entries) {
    const uri = monaco.Uri.parse(file.path);

    // package.json
    if (file.path.endsWith('/package.json')) {
      if (typeof file.source !== 'string') {
        // First load is good but webpack HMR transform json -> string
        file.source = JSON.stringify(file.source, null, '  ');
      }

      loaded.push({
        type: 'package',
        pkg: file.pkg,
        path: file.path,
        uri,
      });
      continue;
    }

    getOrCreateModel(monaco, uri, file.source, 'typescript');
    const disposable =
      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        file.source,
        file.path,
      );

    // d.ts
    loaded.push({
      type: 'module',
      pkg: file.pkg,
      path: file.path,
      uri,
      disposable,
    });
  }

  return loaded;
}
