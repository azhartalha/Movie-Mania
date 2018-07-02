import React, { Component } from 'react';
import { BrowserRouter as Router, Route} from "react-router-dom";
import './App.css';
import MMHeader from './header';
import LoginClass from './login';
import createBrowserHistory from 'history/createBrowserHistory'


class App extends Component {
  constructor(props)
  {
    super(props);
    this.state = {isLoggedIn: true, username: ""};
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
      this.setState({isLoggedIn: false, username: ""})
    else
      this.setState({isLoggedIn: true, username: this.readCookie("username")})
    console.log("will mount")
  }

  setLoginStatus = (newStatus, newUserName) => {
    this.setState({isLoggedIn: newStatus, username: newUserName})
  }
  
  render() {
    console.log(this.props)
    return (
      <Router>
        <div className="App">
          <MMHeader title="MOVIEMAINA" isLoggedIn={this.state.isLoggedIn} username={this.state.username} setLoginStatus={this.setLoginStatus}/>
          <div className="jumbotron">    
            <Route exact path="/moviemania/login" component={args => <LoginClass isLoggedIn={this.state.isLoggedIn} setLoginStatus={this.setLoginStatus}/>} />
            <Route exact path="/moviemania/signup" component={args => <p>signup</p>} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
