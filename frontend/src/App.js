import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect} from "react-router-dom";
import './App.css';
import MMHeader from './header';
import LoginClass from './login';
import SignUpComp from './signup';

class App extends Component {
  constructor(props)
  {
    super(props);
    this.state = {isLoggedIn: false, username: "", isStaff: ""};
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
      this.setState({isLoggedIn: false, username: "", isStaff: ""})
    else
    {
      const uname = this.readCookie("username");
      const staff = this.readCookie("isStaff");
      this.setState({isLoggedIn: true, username: uname, isStaff: staff})
    }
  }

  setLoginStatus = (newStatus, newUserName, newStaffStatus) => {
    this.setState({isLoggedIn: newStatus, username: newUserName, isStaff: newStaffStatus})
  }
  
  render() {
    return (
      <Router>
        <div className="App">
          <MMHeader title="MOVIEMAINA" isLoggedIn={this.state.isLoggedIn} username={this.state.username} setLoginStatus={this.setLoginStatus}/>
          <div className="jumbotron">    
            <Route exact path="/moviemania/login" component={args => <LoginClass isLoggedIn={this.state.isLoggedIn} setLoginStatus={this.setLoginStatus}{...args}/>} />
            <Route exact path="/moviemania/signup" component={args => <SignUpComp isLoggedIn={this.state.isLoggedIn} setLoginStatus={this.setLoginStatus}{...args}/>} />
            
            <Route exact path="/moviemania/account" component={args => <p>account</p>}/>
            
            <Route exact path="/moviemania/movies" component={args => <p>movies</p>} />
            <Route exact path="/moviemania/celebs" component={args => <p>celebs</p>} />
            <Route exact path="/moviemania/genres" component={args => <p>genres</p>} />
            <Route exact path="/moviemania/search" component={args => <p>search</p>} />
            <Route exact path="/moviemania" component={args => <Redirect to="/moviemania/movies"/>} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
