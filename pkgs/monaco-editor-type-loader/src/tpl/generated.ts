export function generatedTPL({
  tsVersion,
  entries,
}: {
  tsVersion: string;
  entries: string[];
}): string {
  return `
/* eslint-disable @typescript-eslint/no-var-requires, import/order, global-require */
// This is a generated file, do not edit.
// Built with @h1fra/monaco-type-loader; ts version v${tsVersion}

interface Entry { path: string; source: any; pkg: string | false };

// prettier-ignore
export const entries: Entry[] = [
  ${entries.join('\r\n')}
];
`;
}