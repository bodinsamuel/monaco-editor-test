import * as MonacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import React, { useState } from "react";
import { useInterval } from "react-use";

interface Props {
  onPick: (uri: MonacoEditor.Uri) => void;
}
export const ListFiles: React.FC<Props> = ({onPick}) => {
  const [files, setFiles] = useState<string[]>([]);

  useInterval(() => {
    setFiles(
      MonacoEditor.editor.getModels().map((model) => model.uri.toString())
    );
  }, 1000);

  return (<ul>
    {files.map((file) => (<li key={file}>{file}<button type="button" onClick={() => {
      onPick(MonacoEditor.Uri.parse(file))
    }}>load</button></li>))}
    </ul>)
}
