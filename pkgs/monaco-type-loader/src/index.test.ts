import { load } from ".";

it('should load', () => {
  const res = load({
    entries: [],
    pathNodeModules: '../../',
    pathToWrite: 'here.ts',
  });
  expect(res).toEqual('te')
})
