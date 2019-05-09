import { vaporiseNumber, vaporiseCode, ShapeTextToImage } from './Arcanartist';
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

describe('shapeTextToImage', () => {
  it('should wrap text as expected', () => {
    const matrix = [
      0, 1, 0, 1,
      0, 1, 1, 0,
      1, 1, 1, 1
    ];

    const rgba = matrix.map(v =>
      v?[0,0,0,0]:[252,253,254,0]
    ).reduce((a, c) => a.concat(...c), []);

    const text = "abcdefghijlkmnop";

    const expected =
      " a b\n" +
      " cd \n" +
      "efgh";

    const output = ShapeTextToImage({
      imageData: {
        data: rgba,
        width: 4,
        height: 3
      },
      text
    });

    expect(output).toEqual(expected);
  });
});
