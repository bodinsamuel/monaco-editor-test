import React from 'react';
import { CodeEditor } from './Editor';

function App() {
  return (
    <div className="App">
      <CodeEditor file={{
        language: 'typescript',
        path: '/index.ts',
        sourceCode: ``
      }} />
    </div>
  );
}

export default App;
