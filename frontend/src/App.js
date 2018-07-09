import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect} from "react-router-dom";
import './App.css';
import MMHeader from './header';
import LoginClass from './login';
import SignUpComp from './signup';
import UserComp, {UserUpdateComp} from './account';
import MoviesListComp, {MovieDetailedComp, AddMovieComp, UpdateMovieComp} from './movie';
import CelebListComp, {AddCelebComp, UpdateCelebComp, CelebDetailedComp} from './celebs';
import GenreListComp, {GenreDetailedComp} from './genre';
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
            <Route exact path="/moviemania" component={args => <p>Home page</p>} />
            <Route exact path="/moviemania/login" component={args => <LoginClass isLoggedIn={this.state.isLoggedIn} setLoginStatus={this.setLoginStatus}{...args}/>} />
            <Route exact path="/moviemania/signup" component={args => <SignUpComp isLoggedIn={this.state.isLoggedIn} setLoginStatus={this.setLoginStatus}{...args}/>} />
            
            <Route exact path="/moviemania/account" component={args => <UserComp username={this.state.username} isLoggedIn={this.state.isLoggedIn}{...args}/>}/>
            <Route exact path="/moviemania/account/update" component={args => <UserUpdateComp username={this.state.username} isLoggedIn={this.state.isLoggedIn}{...args}/>}/>

            <Route exact path="/moviemania/movies" component={args => <MoviesListComp isStaff={this.state.isStaff}{...args}/>} />
            <Route exact path="/moviemania/movies/create" component={args => <AddMovieComp isStaff={this.state.isStaff}{...args}/>} />
            <Route exact path="/moviemania/movies_detailed/:id" component={args => <MovieDetailedComp isStaff={this.state.isStaff}{...args}/>} />
            <Route exact path="/moviemania/movies_detailed/:id/update" component={args => <UpdateMovieComp isStaff={this.state.isStaff}{...args}/>} />

            <Route exact path="/moviemania/celebs" component={args => <CelebListComp isStaff={this.state.isStaff}{...args}/>} />
            <Route exact path="/moviemania/celebs/create" component={args => <AddCelebComp isStaff={this.state.isStaff}{...args}/>} />
            <Route exact path="/moviemania/celebs_detailed/:id" component={args => <CelebDetailedComp isStaff={this.state.isStaff}{...args}/>} />
            <Route exact path="/moviemania/celebs_detailed/:id/update" component={args => <UpdateCelebComp isStaff={this.state.isStaff}{...args}/>} />

            <Route exact path="/moviemania/genres" component={args => <GenreListComp {...args}/>} />
            <Route exact path="/moviemania/genres/:id" component={args => <GenreDetailedComp {...args}/>} />

            <Route exact path="/moviemania/search" component={args => <p>search</p>} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
