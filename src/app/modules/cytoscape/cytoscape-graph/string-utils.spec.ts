import { camelCaseToDash } from './string-utils';

fdescribe('camelCaseToDash', () => {
  const cases: { input: string; output: string }[] = [
    { input: 'foo', output: 'foo' },
    { input: 'fooFoo', output: 'foo-foo' },
    { input: 'fooFooFoo', output: 'foo-foo-foo' },
    { input: 'FooFoo', output: '-foo-foo' },
  ];

  cases.forEach(c => {
    describe(`with ${c.input}`, () => {
      it(`return ${c.output}`, () => {
        expect(camelCaseToDash(c.input)).toBe(c.output);
      });
    });
  });
});
