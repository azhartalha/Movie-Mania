import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor()
  {
    this.state = {isLoggedIn: False}
  }
  
  readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1,c.length);
        }
        if (c.indexOf(nameEQ) == 0) {
            return c.substring(nameEQ.length,c.length);
        }
    }
    return null;
  }

  componentWillMount()
  {
    if(this.readCookie("JWT")==null)
      this.setState({isLoggedIn: false})
    else
      this.setState({isLoggedIn: true})
  }

  changeLogin()
  {
    this.setState(prev => {isLoggedIn: !prev.isLoggedIn})
  }
  
  render() {
    return (
      <div className="jumbotron">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          I am chaing this to test
        </p>
      </div>
    );
  }
}

export default App;
