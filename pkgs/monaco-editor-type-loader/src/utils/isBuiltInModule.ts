import { builtinModules } from 'module';

export function isBuiltinModule(name: string): boolean {
  return builtinModules.includes(name);
}
