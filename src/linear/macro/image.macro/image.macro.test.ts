import pluginTester from 'babel-plugin-tester';
import plugin from 'babel-plugin-macros';

pluginTester({
    plugin,
    snapshot: true,
    babelOptions: { filename: __filename},
    tests: [
        `import macro from '../image.macro';
        const img = macro('test.png', {
            width: 1, height: 10
        });`
    ]
})