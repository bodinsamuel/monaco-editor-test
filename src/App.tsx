import * as MonacoEditor from 'monaco-editor/esm/vs/editor/editor.api';

import React, { useState } from 'react';
import { useMount } from 'react-use';
import { CodeEditor } from './Editor';
import { fileToModel } from './helpers/fileToModel';
import { ListFiles } from './ListFiles';

const sourceCode =
`import cheerio from 'cheerio';
import parseJson from 'parse-json';

[1].map((value) => {
  return value;
});

const t: cheerio.Cheerio = parseJson(true);`

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
