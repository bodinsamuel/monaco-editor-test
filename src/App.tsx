import * as MonacoEditor from 'monaco-editor/esm/vs/editor/editor.api';

import React, { useState } from 'react';
import { useMount } from 'react-use';
import { CodeEditor } from './components/Editor';
import { Files } from './components/Files';
import { store } from './editor/store';

function App() {
  const [uri, setUri] = useState<MonacoEditor.Uri>();

  useMount(() => {
    const tmpUri = MonacoEditor.Uri.parse('/index.ts');
    setUri(tmpUri);
  });

  return (
    <div className="App">
      <div className="grid-files">
        <Files
          onPick={(val) => {
            setUri(val);
          }}
          models={store.models}
        />
      </div>
      <div className="grid-editor">{uri && <CodeEditor uri={uri} />}</div>
    </div>
  );
}

export default App;
