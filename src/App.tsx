import { observer } from 'mobx-react-lite';
import * as MonacoEditor from 'monaco-editor/esm/vs/editor/editor.api';

import React, { useContext } from 'react';
import { useMount } from 'react-use';
import { CodeEditor } from './components/Editor';
import { Files } from './components/Files';
import { context } from './store';

const App: React.FC = observer(() => {
  const store = useContext(context);

  useMount(() => {
    const tmpUri = MonacoEditor.Uri.parse('/index.ts');
    store.current = tmpUri;
  });

  return (
    <div className="App">
      <div className="grid-files">
        <Files
          onPick={(val) => {
            store.current = val;
          }}
          files={store.files}
          path="/"
        />
      </div>
      <div className="grid-editor">
        {store.current && <CodeEditor uri={store.current} />}
      </div>
    </div>
  );
});

export default App;
