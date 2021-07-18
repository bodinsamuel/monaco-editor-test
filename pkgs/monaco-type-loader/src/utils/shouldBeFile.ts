import fs from 'fs/promises';

export async function shouldBeFile(path: string, name: string) {
  try {
    const stat = await fs.stat(path);
    if (!stat.isFile()) {
      throw new Error(`not a file`);
    }
  } catch (e) {
    throw new Error(`Can not read "${name}": "${path}". ${e.message}`);
  }
}
