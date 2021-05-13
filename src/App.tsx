import * as MonacoEditor from 'monaco-editor/esm/vs/editor/editor.api';

import React, { useState } from 'react';
import { useMount } from 'react-use';
import { CodeEditor } from './Editor';
import { fileToModel } from './helpers/fileToModel';
import { ListFiles } from './ListFiles';

const sourceCode =
`/// <reference types="node" />
import { CheerioAPI, load} from 'cheerio';
import { Config } from './tmp/config';
import parseJson from 'parse-json';

[1].map((value) => {
  return value;
});
parseJson(true);

// This work
const $a = load('test', { test: 'test' });
$a('.title').map((i, el) => {
  return $a(el);
});
const test: CheerioAPI = {};

new Crawler({
  actions: [{
    indexName: true,
    // The $ is any :(
    recordExtractor: ({ $ }) => {
      return [{
        title: $('.title').map((i, el) => {
          return $(el);
        }),
      }]
    }
  }]
});

const config: Config = {
  appId: '',
  apiKey: '',
  exclusionPatterns: [],
  rateLimit: 8,
  actions: [{
  }]
};`

function App() {
  const [uri, setUri] = useState<MonacoEditor.Uri>();

  useMount(() => {
    const tmpUri = MonacoEditor.Uri.parse('/index.ts');
    fileToModel(MonacoEditor, tmpUri, sourceCode, 'typescript');
    setUri(tmpUri);
  })

  return (
    <div className="App">
      {uri && <CodeEditor uri={uri} />}
      <ListFiles onPick={(val) => {
        setUri(val);
      }} />
    </div>
  );
}

export default App;
