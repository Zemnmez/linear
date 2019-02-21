import React from 'react';

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
    console.log('code changed')
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
        {console.log('redraw root')}
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
