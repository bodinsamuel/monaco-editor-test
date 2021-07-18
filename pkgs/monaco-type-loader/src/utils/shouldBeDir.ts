import fs from 'fs/promises';

export async function shouldBeDir(path: string, name: string) {
  try {
    const stat = await fs.stat(path);
    if (!stat.isDirectory()) {
      throw new Error(`not a directory`);
    }
  } catch (e) {
    throw new Error(`Can not read "${name}": "${path}". ${e.message}`);
  }
}
