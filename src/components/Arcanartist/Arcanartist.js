import React from 'react';
import { Map } from 'immutable';
import style from "./style.module.css";
import KitchenSink, { TopBar, LeftBar, ContentArea } from './KitchenSink.js';
import Editor from 'draft-js-plugins-editor';
import { EditorState, genKey, ContentBlock, ContentState, Modifier } from 'draft-js';
import Prism from 'prismjs';
import createPrismPlugin from 'draft-js-prism-plugin';
import "prismjs/themes/prism.css"; // add prism.css to add highlights
import { classes } from "classes";
import math from "mathjs";
import memoize from 'memoizee';
import log from '@zemnmez/macros/log.macro';
import assert from '@zemnmez/macros/assert.macro';
import substrings from 'common-substrings';
import js_ident_re from './js_ident.js';

const Arcanartist = ({ className, ...etc }) => <KitchenSink {...{
  className
}}>
  <TopBar {...{
    title: "arcanartist"
  }}/>
  <LeftBar/>
  <UI {...{...etc}}/>
</KitchenSink>

class UI extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      code: ""
    }

    this.setCode = this.setCode.bind(this);
  }

  setCode(code) { this.setState({code}) }

  render() {
    const { setCode } = this;
    const { code } = this.state;
    return <ContentArea {...{
      className: style.UI
    }}>
      <CodeEditor {...{
        codeCallback: setCode
      }}/>

      <div {...{
        className: style.CodeView
      }}>
        {vaporiseCode(code).toString()}
      </div>
    </ContentArea>
  }
}


const prismPlugin = createPrismPlugin({
    prism: Prism
});

const CodeEditor = ({ codeCallback }) => {
  const [editorState, setEditorState] = React.useState(
    EditorState.createWithContent(
      ContentState.createFromBlockArray([
        new ContentBlock({
          key: genKey(),
          type: 'code-block',
          text: "",
          data: new Map([ ["language", "javascript"] ])
        })
      ])
    )
  );


  return <div {...{
    className: style.CodeEditor
  }}>
    <Editor {...{
      editorState: editorState,
      onChange: (s) => {
        setEditorState(s)
        const contentState = s.getCurrentContent();
        codeCallback(contentState.getPlainText());
      },

      plugins: [
        prismPlugin
      ]
    }}/>
  </div>
}

/*
class FrozenConstant extends FakeSymbol {
  constructor(n) {
    super(n);
    this.realValue = n;
  }
}
*/

class FakeSymbol extends math.expression.node.SymbolNode {
  constructor(n) {
    super(n.toString())
  }
}

// remove all rules containing caret (^), since
// we can't express it in a single character
const newRules = math.simplify.rules.filter(({l,r}) =>
  ![l,r].some(v => v && v.indexOf('^') != -1)
);

const identifierGenerator = () => {
  let ctr = 0
  return () => {
    ctr++
    while(!js_ident_re.test(String.fromCharCode(ctr)))  ctr++;

    return String.fromCharCode(ctr++)
  }
}


const simplify = (expr) => math.simplify(expr, newRules);

export const vaporiseNumberExpr = memoize((n) => {
  const self = vaporiseNumberExpr;
  if (n>=0&&n<=9) return new FakeSymbol(n);

  for(let div = 9; div > 1; div--) {
    if (n%div==0) {
      n/=div;
      return simplify(
        new math.expression.node.OperatorNode(
          "*",
          'multiply',
          [ self(n), new FakeSymbol(div) ]
        )
      );
    }
  }

  const addOne = simplify(new math.expression.node.OperatorNode(
    "+",
    'add',
    [ self(n-1), new FakeSymbol(1) ]
  ));


  const subOne = simplify(new math.expression.node.OperatorNode(
    "-",
    'subtract',
    [ self(n+1), new FakeSymbol(1) ]
  ));

  /*
  const invert = simplify(new math.expression.node.OperatorNode(
    "-",
    "subtract",
    [new math.expression.node.OperatorNode(
      "~",
      "not",
      [ self(-~n) ]
    )]
  ));
  */


  const best = [addOne, subOne].map(v => Object.assign(v,
    {length: v.length || v.toString().length}))
    .sort(({length: a}, {length: b}) => a-b);


  assert(best[0].length <= best[1].length, best[0].length, best[1].length) // just because i always get order confused

  return best[0];
})

export const vaporiseNumber = (n) => vaporiseNumberExpr(n).toString().replace(/ /g,"");

class VaporisedString {
  constructor({ pre, post, values }) {
    Object.assign(this, {pre, post, values});
  }

  toString() {
    const { pre, post, values } = this;
    return `${pre}${values}${post}`;
  }
}

export const vaporiseCode = ([...chrs]) => {
  const pre = "Function(String.fromCharCode(";
  let values = chrs.map(c => vaporiseNumber(c.charCodeAt(0))).map(sym => sym.toString())
  let post = "))()";

  // attempt to set some variables
  const mostCommon = substrings(values, {
    minOccurrence: 2,
    minLength: 1
  });

  // filter out expressions that are not
  // syntactically valid
  const mostCommonValid = mostCommon.filter(({name, weight}) => {
    if (!(weight > 4)) return false;

    try {
      math.parse(name)
    } catch(e) { return false}

    return true;
  })


  values = values.join(",");

  const identGen = identifierGenerator();

  const toReplace = mostCommonValid;

  const validVars = toReplace.map((_, i) => identGen());

  toReplace
    .forEach(({ name }, i) =>
      values = values.split(name).join(validVars[i]));

  toReplace
    .forEach(({ name }, i) =>
      values = values.replace(
        validVars[i],
        `(${validVars[i]}=${name})`
      ));

  // lastly, make some attempt
  // to remove superflous brackets

  return new VaporisedString({ pre, values, post })
}
//*/




export default Arcanartist;

/*
export default class Arcanartist extends React.Component {
  static splitNo(no) {
    const indicies = [9,8,7,6,5,4,3,2];
    let mul = [];

   outer:
    while (no > 1) {
      for(var i = 0; i < indicies.length; i++) {
        if (no % indicies[i] == 0) {
          no /= indicies[i];
          mul.push(indicies[i]);
          continue outer;
        }
      }

      mul.push(`(${this.splitNo(no-1)}+1)`);
      break;
    }

    return mul? mul.join('*') : "1";
  }

  static vaporise(js) {
    let codes = [];
    for(var i = 0 ;; i++) {
      var charCode = js.charCodeAt(i);
      if (!charCode) break;
      codes.push(this.splitNo(charCode));
    }

    return codes;
  }

  static transpile(js, imageData) {
    let chars = this.vaporise(js).join(",").split('');

    let d = imageData.data;
    let out = "";
    for(let i = 0; i < d.length ; i += 4) {
      var chr = null;
      if (d[i] + d[i+1] + d[i+2] != 255 * 3) {
        let chr = chars.shift();
        out += chr?chr:' ';
      } else out += ' ';

      if ( ((i/4) +1) % imageData.width == 0) out += "\n";
    }

    if(chars) {
      out += '\n';
      out += chars.join('');
    }

    return `eval(String.fromCharCode(
${out}))`;
  }

  constructor(props) {
    super(props);

    this.state = {
      imageData: null,
      incode: exampleCode,
      outcode: ''
    }

    this.defaultImage = logoURI;
    this.imageSelected = this.imageSelected.bind(this);
    this.codeChanged = this.codeChanged.bind(this);
  }


  codeChanged(code) {
    log('code changed')
    this.setState({
      incode: code,
    })
  }

  imageSelected(imageData) {
    this.setState({
      imageData: imageData,
    })
  }

  render() {
    return (
      <div className="arcanartist">
        {log('redraw root')}
        <CodeContainer value={this.state.incode}
          onChange={this.codeChanged} className="input"/>
        <ImageInput onChange={this.imageSelected} id="image"
          default={this.defaultImage} />
        <CodeContainer
          value={(this.state.imageData?Arcanartist.transpile(this.state.incode, this.state.imageData):'no image data')}
          className="output"/>
      </div>
    );
  }
}
*/
