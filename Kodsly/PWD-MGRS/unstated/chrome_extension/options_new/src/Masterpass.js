/*global chrome*/

import React from 'react';
import Mnemonic from './Mnemonic.js';

export default class Masterpass extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      value: ''
    };
    this.handleChange = this.handleChange.bind(this);
    chrome.storage.local.get({
      masterpass: ''
    }, (items)=>{
      this.setState({value: items.masterpass});
    });
  }
  handleChange(event){
    this.setState({value: event.target.value});
    chrome.storage.local.set({
      masterpass: event.target.value
    }, ()=>{});
  }
  render(){
    return (
      <div className="masterpass">
        <input type="password" placeholder="Master Password" value={this.state.value} onChange={this.handleChange} />
        <Mnemonic value={this.state.value} />
      </div>
    );
  }
}
