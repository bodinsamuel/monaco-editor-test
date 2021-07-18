export function isPackage(name: string): boolean {
  const startWithAt = name.startsWith('@');
  const slashes = name.split('/');
  const modIsScopedPackageOnly = startWithAt && slashes.length === 2;
  const modIsPackageOnly = !startWithAt && slashes.length === 1;
  return modIsPackageOnly || modIsScopedPackageOnly;
}
