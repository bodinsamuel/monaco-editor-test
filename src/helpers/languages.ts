import type MonacoEditor from 'monaco-editor/esm/vs/editor/editor.api';


export function initJS(monaco: typeof MonacoEditor) {
  // Languages diagnostics
monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
    noSuggestionDiagnostics: true,
  });
  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
  });
  monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ES2016,
    allowNonTsExtensions: true,
    allowJs: true,
    checkJs: true,
    strict: false,
    noImplicitAny: false,
    noImplicitThis: false,
    noErrorTruncation: true,
    noEmit: true,
    moduleResolution:
    monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.System,
    lib: ['es2020'], // update `libs.ts` when changing this,
    esModuleInterop: false,
    typeRoots: ['node_modules/@types'],
  });
  monaco.languages.html.htmlDefaults.setOptions({
    format: {
      contentUnformatted: 'pre, script, style',
      endWithNewline: true,
      extraLiners: 'head, body, /html',
      indentHandlebars: false,
      indentInnerHtml: false,
      insertSpaces: false,
      maxPreserveNewLines: 100,
      preserveNewLines: true,
      tabSize: 2,
      unformatted:
        'default": "a, abbr, acronym, b, bdo, big, br, button, cite, code, dfn, em, i, img, input, kbd, label, map, object, q, samp, select, small, span, strong, sub, sup, textarea, tt, var',
      wrapAttributes: 'force-aligned',
      wrapLineLength: 100,
    },
  });

  /**
   * Sync all the models to the worker eagerly.
   * This enables intelliSense for all files without needing an `addExtraLib` call.
   */
  monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
  monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
}
