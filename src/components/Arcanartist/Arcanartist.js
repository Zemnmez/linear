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
import PropTypes from 'prop-types';

const ChildIdentity = ({ children }) => {
  log({ children });
  if (children) return children({});
  return null;
};

const mustChild = child => {
  assert(child !== undefined)
  return child;
}

const FuncPropPasser = ({ children, props }) =>
  children(props);

const VisibleFragment = ({ children }) => <React.Fragment {...{
  children
}}/>

const ArrayPipeline = ({ args = [], children: [next, ...pipeline] }) => {
  if (!next) return null;
  next = next(...args);
  log({ next, pipeline });
  assert(next !== undefined);
  if (pipeline.length == 0) return next;
  return React.cloneElement(
    next, {
      children: (...args) => <ArrayPipeline {...{
        args,
        children: pipeline
      }}/>
    }
  )
}

ArrayPipeline.propTypes = {
  args: PropTypes.array,
  children: PropTypes.arrayOf(PropTypes.func.isRequired)
}

const Pipeline = ({ children = [] }) => {
  const arrayChildren = [].concat(children);
  log(arrayChildren);
  return <ArrayPipeline {...{
    children: arrayChildren
  }}/>;
}

Pipeline.propTypes = {
  children: PropTypes.arrayOf(
    PropTypes.func.isRequired
  )
}

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

    this.state = { code: "", image: undefined }

    this.setCode = this.setCode.bind(this);
    this.imageRender = this.imageRender.bind(this);
  }

  static getDerivedStateFromError(error) {
    log({error});
    return { error }
  }

  setCode(code) { this.setState({code}) }

  imageRender({ image }) { this.setState({ image }) }

  render() {
    const { setCode, imageRender } = this;
    const { code, image } = this.state;
    return <ContentArea {...{
      className: style.UI
    }}>

      <Pipeline {...{
        children: [
          () => <CodeEditor/>,

          ({ code }) => <Vaporiser {...{
            code
          }}/>,

          ({ code }) => <ImageSelector {...{
            code
          }}/>,

          ({ code, imageData }) => <CodeEditor {...{
            disabled: true,
            fake: log({ code, imageData }),
            text: ShapeTextToImage({ text: code, imageData })
          }}/>
        ]
      }}/>

    </ContentArea>
  }
}

class FileLoader extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      fileData: undefined,
      fileReader: undefined
    };
  }

  fileUrlDidChange() {
    this.setState(() => {
      let { fileReader } = this.state;
      fileReader && fileReader.abort();

      fileReader = new FileReader();

      fileReader.onload = event => this.setState({
        fileData: event.result
      });

      return {
        fileReader
      }
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.url != this.props.url) this.fileUrlDidChange();
  }

  render() {
    const { render } = this.props;
    const { fileData } = this.state;
    return render({ fileData });
  }
}

FileLoader.propTypes = {
  render: PropTypes.func.isRequired,
  url: PropTypes.string
}

export const ShapeTextToImage = ({ threshold = .5, text = '',
  imageData: { data: imageData, height, width} = {
    data: [], height: 0, width: 0
  }}) => {

  let inputCells = [ ...text ];
  let cells = [ ...Array(width * height) ];
  return cells.map((_, idx) => {
    const [r, g, b, a] = Array.prototype.slice.call(imageData, idx * 4, idx * 4 + 4);
    const lightness = // aka, 'whiteness'
      Math.min(
        [r, g, b].reduce((a, c) => a + c) /3,
        255 - a // 255 alpha is opaque, but [255,255,255] rgb is white
      ) / 255;

    return (lightness < threshold? inputCells.shift() || ";": " ")
      + ( (idx + 1) % width  === 0? "\n": "");
  }).join('').slice(0, -1);
}

ShapeTextToImage.propTypes = {
  theshold: PropTypes.number,
  text: PropTypes.string,
  imageData: PropTypes.shape({
    data: PropTypes.instanceOf(Uint8ClampedArray).isRequired,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired
  })
}

const RandIdent = () => Math.floor(Math.random() * 1E16)

class ImagePanel extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      inputFile: undefined,
      imageData: undefined,
      processedImage: undefined
    }

    this.ident = RandIdent();
    this.canvas = React.createRef();
    this.fileInput = React.createRef();
    this.fileWasInput = this.fileWasInput.bind(this);
    this.renderImageProcessor = this.renderImageProcessor.bind(this);
  }

  fileWasInput(event) {
    const { fileInput: { current: fileInput } } = this;
    const [ file ] = fileInput.files;
    this.setState(() => {
      if (this.state.inputFile)
        URL.revokeObjectURL(this.state.inputFile);
      return { inputFile: URL.createObjectURL(file) }
    });
  }

  /* this might seem like a super weird construction
   * but the ImageHandle has to know if the props change
   * in order to prevent a loop.
   * because we are using a render function, previously
   * every time the component rendered it would create a new function
   * instance, causing PureComponent to assume the component had changed.
   * We could, of course rebind every function that we use here, but, that's not any fun.
   */
  renderImageProcessor({ image }) {
    return <ImageProcessor {...{
      image
    }}>{

        ({ blob, imageData }) => (this.setState({
          imageBlob: blob, imageData
        }), null)

      }</ImageProcessor>
  }

  render() {
    const { ident, fileInput, canvas,
      fileWasInput, renderImageProcessor } = this;

    const { inputFile, imageData, imageBlob } = this.state;
    const { children } = this.props;

    console.log({ inputFile, imageData, imageBlob });

    return <React.Fragment><label {...{
      className: style.ImagePanel,
      htmlFor: ident,
      style: {
        backgroundImage: `url(${inputFile})`
      }
    }}>


      {!inputFile?<div {...{
        className: style.Message
      }}>click to add file</div>: ""}

      <input {...{
        type: "file",
        id: ident,
        name: ident,
        ref: fileInput,
        multiple: false,
        onChange: fileWasInput,
        accept: "image/png, image/jpeg"
      }}/>

      <ImageHandle {...{
        url: inputFile
      }}>
        {renderImageProcessor}
      </ImageHandle>

    </label>

    {mustChild(children({
      imageData
    }))}

    </React.Fragment>
  }
}

ImagePanel.propTypes = {
  children: PropTypes.func.isRequired
}

const Vaporiser = ({ children, code }) => {
  const vapor = vaporiseCode(code).toString();
  const child = mustChild(children({ code: vapor }));
  log({ vapor, child, children, code });
  return <React.Fragment>
    <CodeEditor {...{
      disabled: true,
      text: vapor
    }}/>
    {child}
    </React.Fragment>
}

const ImageSelector = ({ code, children }) => <ImagePanel {...{
  children: ({ imageData }) =>
    mustChild(children({ code, imageData }))
}}/>

// Image() is the only type which a canvas will consume, but it
// cannot be generated synchronously in render() and also
// is not immutable (i.e. PureComponent assumes all images,
// even with identical Blobs are the same).
//
// This helper allows components to be defined as regular
// PureComponents by only calling a re-render of its child
// when the blob prop changes and the Image().onload callback
// is fired.
class ImageHandle extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { image: undefined };
  }

  componentDidUpdate({ url: oldUrl }) {
    const { url: newUrl } = this.props;

    if (newUrl != oldUrl) {
      const image = new Image();
      image.onload = () => this.setState({ image });
      image.src = newUrl;
    }
  }

  render() {
    const { image } = this.state;
    const { children } = this.props;

    return mustChild(children({image}))
  }
}

ImageHandle.propTypes = {
  children: PropTypes.func.isRequired,
  url: PropTypes.string
}

// To render a Blob into an image, URL.createObjectURL must be used.
// however, URL.createObjectURL creates identifiers which are never GC'd
// until URL.revokeObjectURL is called.
//
// This component revokes any URLs passed as props if they change.
class BlobURLRevoker extends React.PureComponent {
  componentDidUpdate({ url: oldUrl }) {
    const { url: newUrl } = this.props;
    if (!oldUrl) return;
    log("revoking", oldUrl, {oldUrl, newUrl});
    URL.revokeObjectURL(oldUrl);
  }

  render() {
    return null;
  }
}

class ObjectUrl extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { url: undefined };
  }

  static getDerivedStateFromProps(props, state) {
    const { url: oldUrl } = state;
    const { object } = props;
    oldUrl && URL.revokeObjectURL(oldUrl);

    log({ object });

    return {
      url: object? URL.createObjectURL(object): undefined
    }
  }

  render() {
    const { children } = this.props;
    const { url } = this.state;
    log({children});
    return mustChild(children({
      url
    }))
  }
}

ObjectUrl.propTypes = {
  children: PropTypes.func.isRequired,
  object: PropTypes.oneOfType([
    PropTypes.instanceOf(Blob),
    PropTypes.instanceOf(File)
  ])
}

class ImageProcessor extends React.PureComponent {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    this.state = { imageData: undefined, blob: undefined }
  }

  componentDidMount() {
    this.componentDidUpdate();
  }

  componentDidUpdate(prevProps) {
    const { image: newImage } = this.props;
    const { image: oldImage } = prevProps || {};
    const { canvas } = this;
    log({
      canvas: canvas.current,
      hasCanvas: !canvas.current,
      image,
      hasImage: !image,
      imageChanged: oldImage != newImage,
      oldImage, newImage
    });

    if (!newImage) return;
    if (oldImage == newImage) return;

    log("handling new image");

    const image = newImage;

    const el = canvas.current;
    [el.width, el.height] = [image.width, image.height];
    const ctx = el.getContext('2d');
    ctx.drawImage(image, 0, 0);

    el.toBlob(blob => this.setState({
      blob,
      imageData: ctx.getImageData(0, 0, image.width, image.height)
    }));

  }

  render() {
    const { canvas } = this;
    const { children } = this.props;
    const { blob, imageData } = this.state;
    log({ blob, imageData });
    return <React.Fragment>
      <canvas {...{
        ref: canvas
      }}/>

      {mustChild(children({
        blob, imageData
      }))}
    </React.Fragment>
  }
}

ImageProcessor.propTypes = {
  children: PropTypes.func,
  image: PropTypes.instanceOf(Image)
}


const prismPlugin = createPrismPlugin({
  prism: Prism
});

class CodeEditor extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { editorState: undefined };
    this.editorStateChanged = this.editorStateChanged.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    let { text = "function(){}" } = props;
    if (!state.editorState || props.disabled)
    return {
      editorState: EditorState.createWithContent(
        ContentState.createFromBlockArray([
          new ContentBlock({
            key: genKey(),
            type: 'code-block',
            text: text,
            data: new Map([ ["language", "javascript"] ])
          })
        ])
      )
    }

    return {};
  }

  editorStateChanged(editorState) { this.setState({ editorState }) }

  render() {
    const { disabled = false,
            children, className } = this.props;
    log({ children });
    const { editorState } = this.state;
    const { editorStateChanged } = this;
    return <React.Fragment>
      <div {...{
          className: classes(style.CodeEditor, className)
      }}>
      <Editor {...{
          editorState,
          onChange: editorStateChanged,
          readOnly: disabled,
          stripPastedStyles: true,
          plugins: [
            prismPlugin
          ]
        }}/>
      </div>
      {children && mustChild(children({
        code: editorState.getCurrentContent().getPlainText()
      }))}
    </React.Fragment>
  }
}

CodeEditor.propTypes = {
  children: PropTypes.func,
  disabled: PropTypes.bool,
  text: PropTypes.string
}


/*
const CodeEditor = ({ text = "function(){}", disabled = false, children }) => {

  /*(const [editorState, setEditorState] = React.useState(

  );

  const onChange = s => {
    setEditorState(s)
  }* /

  return <React.Fragment>
    <div {...{
      className: style.CodeEditor
    }}>
      <Editor {...{
        editorState: editorState,
        onChange: onChange,

        plugins: [
          prismPlugin
        ]
      }}/>

    </div>
    {children && children({ code:
      editorState.getCurrentContent().getPlainText() })}

  </React.Fragment>
}

*/

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
const newRules = math.simplify.rules.filter(({l, r}) =>
  ![l, r].some(v => v && v.indexOf('^') != -1));

const identifierGenerator = () => {
  let ctr = 0
  return () => {
    ctr++
    while (!js_ident_re.test(String.fromCharCode(ctr)))  ctr++;

    return String.fromCharCode(ctr++)
  }
}


const simplify = expr => math.simplify(expr, newRules);

export const vaporiseNumberExpr = memoize(n => {
  const self = vaporiseNumberExpr;
  if (n>=0&&n<=9) return new FakeSymbol(n);

  for (let div = 9; div > 1; div--) {
    if (n%div==0) {
      n/=div;
      return simplify(
        new math.expression.node.OperatorNode(
          "*",
          'multiply',
          [self(n), new FakeSymbol(div)]
        )
      );
    }
  }

  const addOne = simplify(new math.expression.node.OperatorNode(
    "+",
    'add',
    [self(n-1), new FakeSymbol(1)]
  ));


  const subOne = simplify(new math.expression.node.OperatorNode(
    "-",
    'subtract',
    [self(n+1), new FakeSymbol(1)]
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

export const vaporiseNumber = n => vaporiseNumberExpr(n).toString().replace(/ /g, "");

class VaporisedString {
  constructor({ pre, post, values }) {
    Object.assign(this, {pre, post, values});
  }

  toString() {
    const { pre, post, values } = this;
    return `${pre}${values}${post}`;
  }
}

export const arcanise = (imageSrc, code) => {
  const vapor = vaporiseCode(code);
}

export const vaporiseCode = ([ ...chrs ]) => {
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
    } catch (e) { return false }

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
  //
  // attempt to re-parse and simplify
  // values = values.split(",").map(stmt => simplify(freeze(math.parse(stmt))).toString()).join("");

  return new VaporisedString({ pre, values, post })
}

//* /




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
