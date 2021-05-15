import * as MonacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { autorun } from 'mobx';
import classnames from 'classnames';
import { File as FileIcon, Folder as FolderIcon } from 'react-feather';
import { basename } from 'path';
import { FileType, FSMap } from '../fs';
import { fs, store } from '../store';

interface Props {
  files: FSMap;
  path: string;
}

const File: React.FC<{
  selected: boolean;
  path: string;
}> = ({ selected, path }) => {
  const [displayName] = useState<string>(() => {
    return basename(path);
  });
  return (
    <li key={path}>
      <div className={classnames('fileRow', selected && 'selected')}>
        <button
          type="button"
          onClick={() => {
            store.current = MonacoEditor.Uri.parse(path);
          }}
        >
          <div className="fileRowIcon">
            <FileIcon size={10} />
          </div>
          <div className="fileRowName">{displayName}</div>
        </button>
      </div>
    </li>
  );
};

const Folder: React.FC<{ path: string }> = ({ path }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [displayName] = useState<string>(() => {
    return basename(path);
  });

  /* eslint-disable @typescript-eslint/no-use-before-define */
  return (
    <li>
      <div className={classnames('fileRow')}>
        <button type="button" onClick={() => setOpen(!open)}>
          <div className="fileRowIcon">
            <FolderIcon size={10} />
          </div>
          <div className="fileRowName">{displayName}</div>
        </button>
      </div>
      {open && <Files path={path} files={null as any} />}
    </li>
  );
  /* eslint-enable @typescript-eslint/no-use-before-define */
};

export const Files: React.FC<Props> = observer(({ files, path }) => {
  const [list, setList] = useState<FSMap>();
  const current = store.current?.toString().replace('file://', '');

  useEffect(() => {
    autorun(() => {
      const tmp = fs.readDirectoryWithType(path);
      console.log('reading', path, tmp);

      setList(tmp);
    });
  }, []);

  return (
    <ul className="fileTree" style={{ marginLeft: `6px` }}>
      {list &&
        Array.from(list.entries()).map(([file, type]) => {
          if (type === FileType.DIRECTORY) {
            return <Folder key={file} path={file} />;
          }
          return <File key={file} selected={current === file} path={file} />;
        })}
    </ul>
  );
});
