import * as MonacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import classnames from 'classnames';
import { File as FileIcon, X } from 'react-feather';
import { basename } from 'path';
import { autorun } from 'mobx';
import { store, Store } from '../store';

const Tab: React.FC<{
  selected: boolean;
  uri: string;
}> = ({ selected, uri }) => {
  const [displayName] = useState<string>(() => {
    return basename(uri);
  });

  return (
    <li className={classnames('tab', selected && 'selected')}>
      <button
        type="button"
        onClick={() => {
          store.current = Store.toUri(uri);
        }}
        className="tabInner"
      >
        <div className="fileRowIcon">
          <FileIcon size={10} />
        </div>
        <div className="fileRowName">{displayName}</div>
      </button>
      <button
        type="button"
        className="close"
        onClick={(evt) => {
          evt.preventDefault();
          evt.stopPropagation();
          store.closeTab(uri);
        }}
      >
        <X size={12} />
      </button>
    </li>
  );
};

interface Props {
  opened: Set<string>;
  current?: MonacoEditor.Uri;
}

export const Tabs: React.FC<Props> = observer(({ opened, current }) => {
  const [list, setList] = useState<string[]>();

  useEffect(() => {
    autorun(() => {
      setList(Array.from(opened));
    });
  }, []);

  return (
    <ul className="tabs">
      {list &&
        list.map((uri) => {
          return <Tab key={uri} selected={current?.path === uri} uri={uri} />;
        })}
    </ul>
  );
});
