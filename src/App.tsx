import { observer } from 'mobx-react-lite';
import * as MonacoEditor from 'monaco-editor/esm/vs/editor/editor.api';

import React, { useContext, useState } from 'react';
import { useMount } from 'react-use';
import { CodeEditor } from './components/Editor';
import { Files } from './components/Files';
import { context } from './store';

const App: React.FC = observer(() => {
  const store = useContext(context);
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
          files={store.files}
        />
      </div>
      <div className="grid-editor">{uri && <CodeEditor uri={uri} />}</div>
    </div>
  );
});

export default App;
