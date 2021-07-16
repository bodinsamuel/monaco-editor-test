import { ES6_PATTERN, REQUIRE_PATTERN, ES6_IMPORT } from "../constants";
import { ModuleEntry } from "../types";
import { processModuleRef } from "./processModule";


export async function getDependenciesInModule(
  sourceCode: string,
  folderPath: string
): Promise<ModuleEntry[]> {
  const deps = getTripleSlashes(sourceCode, folderPath);

  deps.push(
    ...(await processModuleRef(
      extractFromRegex(sourceCode),
      folderPath
    ))
  );

  return deps;
}


/**
 * Find new module to load in file.
 * Https://github.com/microsoft/TypeScript-Website/blob/d71fb1a497c77e71279075b9aca05e80f143aeee/packages/sandbox/src/typeAcquisition.ts#L354.
 **/
export function extractFromRegex(sourceCode: string): Set<string> {
  const foundModules = new Set<string>();
  let match: RegExpExecArray | undefined;

  while ((match = ES6_PATTERN.exec(sourceCode)) !== null) {
    if (match[6]) foundModules.add(match[6]);
  }

  while ((match = REQUIRE_PATTERN.exec(sourceCode)) !== null) {
    if (match[5]) foundModules.add(match[5]);
  }

  while ((match = ES6_IMPORT.exec(sourceCode)) !== null) {
    if (match[2]) foundModules.add(match[2]);
  }

  return foundModules;
}


/**
 * Find triple slashes in a file.
 */
 export function getTripleSlashes(sourceCode: string, folderPath: string): ModuleEntry[] {
  return sourceCode
    .split(/[\r]?\n/)
    .filter((l) => l.match(DEPENDENCY_REGEXP))
    .map((l) => {
      return {
        folderPath,
        name: `lib.${l.match(DEPENDENCY_REGEXP)![1]}.d.ts`,
      };
    });
}
