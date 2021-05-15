import * as MonacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { autorun } from 'mobx';
import { FileType } from '../fs';

interface Props {
  onPick: (uri: MonacoEditor.Uri) => void;
  files: Map<string, FileType>;
}

export const Files: React.FC<Props> = observer(({ onPick, files }) => {
  const [list, setList] = useState<string[]>([]);

  useEffect(() => {
    autorun(() => {
      setList(Array.from(files.keys()));
    });
  }, []);

  return (
    <ul className="fileTree">
      {list.map((file) => (
        <li key={file}>
          <button
            type="button"
            onClick={() => {
              onPick(MonacoEditor.Uri.parse(file));
            }}
          >
            {file.replace('file:///', '')}
          </button>
        </li>
      ))}
    </ul>
  );
});
