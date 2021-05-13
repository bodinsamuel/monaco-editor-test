export type Languages = 'javascript' | 'json' | 'html' | 'typescript';

export type File = {
  path: string;
  sourceCode: string;
  language: Languages;
};
