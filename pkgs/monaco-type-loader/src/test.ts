import path from 'path';
import { load } from '.';

const res = load({
  entries: [
    path.join(__dirname, '../../../node_modules/@types/eslint/index.d.ts'),
  ],
  pathNodeModules: path.join(__dirname, '../../../node_modules'),
  pathToWrite: 'here.ts',
});
