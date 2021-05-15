import * as MonacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { autorun } from 'mobx';
import classnames from 'classnames';
import { File, Folder } from 'react-feather';
import { FileType, FSMap } from '../fs';
import { fs, store } from '../store';

interface Props {
  onPick: (uri: MonacoEditor.Uri) => void;
  files: FSMap;
  path: string;
}

export const Files: React.FC<Props> = observer(({ onPick, files, path }) => {
  const [list, setList] = useState<FSMap>();
  const current = store.current?.toString().replace('file://', '');

  useEffect(() => {
    autorun(() => {
      const tmp = fs.readDirectoryWithType(path);
      setList(tmp);
    });
  }, []);

  return (
    <ul className="fileTree">
      {list &&
        Array.from(list.entries()).map(([file, type]) => {
          return (
            <li key={file}>
              <div
                className={classnames(
                  'fileRow',
                  current === file && 'selected'
                )}
              >
                <button
                  type="button"
                  onClick={() => {
                    onPick(MonacoEditor.Uri.parse(file));
                  }}
                >
                  <div className="fileRowIcon">
                    {type === FileType.FILE && <File size={10} />}
                    {type === FileType.DIRECTORY && <Folder size={10} />}
                  </div>
                  <div className="fileRowName">{file.replace('/', '')}</div>
                </button>
              </div>
            </li>
          );
        })}
    </ul>
  );
});
