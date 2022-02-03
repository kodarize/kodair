import React from 'react';

export default class Mnemonic extends React.Component {
  str_to_col(str){
    let hash = 0;
    for(let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for(let i = 0; i < 3; i++) {
      let value = (hash >> (i * 8)) & 0xFF;
      color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
  }
  computeStyle(inp){
    if(inp === '') return {};
    return {background: `linear-gradient(90deg, ${this.str_to_col(inp.substring(0, inp.length/2))}, ${this.str_to_col(inp.substring(inp.length/2, inp.length))})`};
  }
  render(){
    return (
      <div className="mnemonic" style={this.computeStyle(this.props.value)} />
    );
  }
}
