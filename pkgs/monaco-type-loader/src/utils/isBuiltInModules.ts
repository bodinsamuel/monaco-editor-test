import { builtinModules } from 'module';

export function isBuiltinModules(name: string): boolean {
  return builtinModules.includes(name);
}
