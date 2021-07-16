export enum FileTypes {
  'html' = 'html',
  'xml' = 'xml',
  'pdf' = 'pdf',
  'doc' = 'doc',
  'xls' = 'xls',
  'ppt' = 'ppt',
}

export type FileType = keyof typeof FileTypes;
