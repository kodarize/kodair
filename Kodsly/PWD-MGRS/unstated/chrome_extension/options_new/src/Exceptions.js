/*global chrome*/

import React from 'react';

class Checkbox extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      id: (Math.random()*1000).toString(16)
    };
  }
  render(){
    return (
      <div style={{display:"inline-block"}}>
        <input type="checkbox" id={this.state.id} defaultChecked={this.props.checked} disabled={this.props.disabled} onChange={this.props.onChange} />
        <label htmlFor={this.state.id}>{this.props.children}</label>
      </div>
    );
  }
}

class ExceptionCard extends React.Component {
  typeText(e, prop){
    this.props.onChange(this.props.index, prop, e.target.value);
  }
  changeCheckbox(e, prop){
    this.props.onChange(this.props.index, prop, e.target.checked);
  }
  render(){
    return (
      <div className="exception-card">
        <button onClick={()=>{this.props.removeException(this.props.index)}} className="exception-del" >x</button>
        <input type="text" placeholder="Site name" value={this.props.exception.name} onChange={(e)=>{this.typeText(e, 'name')}} />
        <br />
        <input type="text" placeholder="Site" style={{width:"calc(100% - 1.5em - 2px)"}} value={this.props.exception.site} onChange={(e)=>{this.typeText(e, 'site')}}/>
        <br />
        <input type="text" placeholder="Username" style={{width:"calc(100% - 1.5em - 2px)"}} value={this.props.exception.username} onChange={(e)=>{this.typeText(e, 'username')}} />
        <br />
        <br />
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-around"}}>
          <Checkbox checked={this.props.exception.disable} onChange={(e)=>{this.changeCheckbox(e, 'disable')}}>Off?</Checkbox>
          <Checkbox checked={this.props.exception.lowercase} disabled={this.props.exception.disable} onChange={(e)=>{this.changeCheckbox(e, 'lowercase')}}>a-z</Checkbox>
          <Checkbox checked={this.props.exception.uppercase} disabled={this.props.exception.disable} onChange={(e)=>{this.changeCheckbox(e, 'uppercase')}}>A-Z</Checkbox>
          <Checkbox checked={this.props.exception.numbers}   disabled={this.props.exception.disable} onChange={(e)=>{this.changeCheckbox(e, 'numbers')}}>0-9</Checkbox>
          <Checkbox checked={this.props.exception.specials}  disabled={this.props.exception.disable} onChange={(e)=>{this.changeCheckbox(e, 'specials')}}>!/_</Checkbox>
        </div>
        <br />
        <input type="number" value={this.props.exception.length} onChange={(e)=>{this.typeText(e, 'length')}} />
      </div>
    );
  }
}

export default class Exceptions extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      exceptions: []
    };
    this.addException = this.addException.bind(this);
    this.removeException = this.removeException.bind(this);
    this.changeException = this.changeException.bind(this);

    let arr = [];
    chrome.storage.local.get({
      exceptions: {}
    }, (items)=>{
      for(let key in items.exceptions){
        arr.push({
          name: key,
          ...items.exceptions[key]
        });
      }
      this.setState({exceptions:arr});
    });
  }
  saveExceptions(){
    let out = {};
    this.state.exceptions.forEach((el)=>{
      if(el.name.trim() !== ''){
        out[el.name.trim().toLowerCase()] = {...el};
        if(el.site === undefined || el.site.trim() === '') out[el.name.trim().toLowerCase()].site = undefined;
        if(el.username === undefined || el.username.trim() === '') out[el.name.trim().toLowerCase()].username = undefined;
      }
    });
    chrome.storage.local.set({
      exceptions: out
    }, ()=>{});
  }
  addException(){
    this.state.exceptions.push({
      name: '',
      site: '',
      username: '',
      disable: false,
      lowercase: true,
      uppercase: true,
      numbers: true,
      specials: true,
      length: 32
    });
    this.setState({
      exceptions: this.state.exceptions,
      shouldScroll: true
    });
  }
  removeException(index){
    this.state.exceptions.splice(index, 1);
    this.setState({
      exceptions: this.state.exceptions
    });
    this.saveExceptions();
  }
  changeException(index, prop, val){
    this.state.exceptions[index][prop] = val;
    this.setState({
      exceptions: this.state.exceptions
    });
    this.saveExceptions();
  }
  showHelpText(){
    if(this.state.exceptions.length === 0){
      return (
        <div style={{fontWeight:"lighter",display:"flex",alignItems:"center",justifyContent:"center",height:"150px"}}>No exceptions added yet.</div>
      );
    }
  }
  render(){
    return (
      <div>
        <div className="exceptions" id="exceptions-container">
          {this.state.exceptions.map((item, index) => {
            return (
              <ExceptionCard key={index} index={index} removeException={this.removeException} onChange={this.changeException} exception={item} />
            )
          })}
          {this.showHelpText()}
        </div>
        <br />
        <button className="exception-add" onClick={this.addException}>+</button>
      </div>
    );
  }
  componentDidUpdate(){
    if(this.state.shouldScroll){
      document.getElementById('exceptions-container').scrollTo(9999, 0);
      this.setState({
        shouldScroll: false
      });
    }
  }
}
