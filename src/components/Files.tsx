import * as MonacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import React, { useEffect, useState } from 'react';

interface Props {
  onPick: (uri: MonacoEditor.Uri) => void;
  models: Map<string, MonacoEditor.editor.ITextModel>;
}

export const Files: React.FC<Props> = ({ onPick, models }) => {
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    setFiles(
      MonacoEditor.editor.getModels().map((model) => model.uri.toString())
    );
  }, [models]);

  return (
    <ul>
      {files.map((file) => (
        <li key={file}>
          {file}
          <button
            type="button"
            onClick={() => {
              onPick(MonacoEditor.Uri.parse(file));
            }}
          >
            load
          </button>
        </li>
      ))}
    </ul>
  );
};
