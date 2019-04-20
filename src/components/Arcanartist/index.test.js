import { vaporiseNumber, vaporiseCode } from './Arcanartist';
import log from '@zemnmez/macros/log.macro';

describe('vaporise', () => {
  it('should correctly factor numbers', () => {
    for(let i = 0; i < 1000; i++) {
      const output = vaporiseNumber(i);
      expect(eval(vaporiseNumber(i).toString()))
        .toEqual(i)
    }
  });

  /*
   have to work out how to disable
   strict mode to make this work
  it('should correctly vaporise and reassemble code', () => {
    const code = `return "hello world!"`;
    const generated = vaporiseCode(code).toString();
    console.log(generated);
    expect(eval(generated)).toEqual("hello world!")
  });

  */
})
