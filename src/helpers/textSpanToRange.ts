import type MonacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import { TextSpan } from 'typescript';

export function textSpanToRange(
  model: MonacoEditor.editor.ITextModel,
  span: TextSpan,
): MonacoEditor.IRange {
  const p1 = model.getPositionAt(span.start);
  const p2 = model.getPositionAt(span.start + span.length);

  const { lineNumber: startLineNumber, column: startColumn } = p1;
  const { lineNumber: endLineNumber, column: endColumn } = p2;

  return { startLineNumber, startColumn, endLineNumber, endColumn };
}
