import { observer } from 'mobx-react-lite';
import * as MonacoEditor from 'monaco-editor/esm/vs/editor/editor.api';

import React, { useContext } from 'react';
import { useMount } from 'react-use';
import { CodeEditor } from './components/Editor';
import { Files } from './components/Files';
import { Tabs } from './components/Tabs';
import { context } from './store';

const App: React.FC = observer(() => {
  const store = useContext(context);

  useMount(() => {
    const tmpUri = MonacoEditor.Uri.parse('/index.ts');
    store.current = tmpUri;
  });

  return (
    <div className="App">
      <div className="gridFiles">
        <div className="sidebarHeader">Explorer</div>
        <Files files={store.files} path="/" />
      </div>
      <div className="gridTabs">
        <Tabs current={store.current} opened={store.opened} />
      </div>
      <div className="gridEditor">
        <CodeEditor uri={store.current} />
      </div>
    </div>
  );
});

export default App;
