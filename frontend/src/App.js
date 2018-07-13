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
import SearchComp from './search';
import ReviewListComp, {CreateReviewComp, EditReviewComp} from './review';
import HomeComp from './home';
class App extends Component {
  constructor(props)
  {
    super(props);
    this.state = {isLoggedIn: false, username: "", isStaff: "", server_url: "http://ec2-13-58-202-148.us-east-2.compute.amazonaws.com:8000"};
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
          <MMHeader title="MOVIEMANIA" server_url={this.state.server_url} isLoggedIn={this.state.isLoggedIn} username={this.state.username} setLoginStatus={this.setLoginStatus}/>
          <div className="jumbotron">    
            <Route exact path="/moviemania"  component={args => <HomeComp server_url={this.state.server_url}/>} />
            <Route exact path="/moviemania/login" component={args => <LoginClass server_url={this.state.server_url} isLoggedIn={this.state.isLoggedIn} setLoginStatus={this.setLoginStatus}{...args}/>} />
            <Route exact path="/moviemania/signup" component={args => <SignUpComp server_url={this.state.server_url} isLoggedIn={this.state.isLoggedIn} setLoginStatus={this.setLoginStatus}{...args}/>} />
            
            <Route exact path="/moviemania/account" component={args => <UserComp server_url={this.state.server_url} username={this.state.username} isLoggedIn={this.state.isLoggedIn}{...args}/>}/>
            <Route exact path="/moviemania/account/update" component={args => <UserUpdateComp server_url={this.state.server_url} username={this.state.username} isLoggedIn={this.state.isLoggedIn}{...args}/>}/>

            <Route exact path="/moviemania/movies" component={args => <MoviesListComp server_url={this.state.server_url} isStaff={this.state.isStaff}{...args}/>} />
            <Route exact path="/moviemania/movies/create" component={args => <AddMovieComp server_url={this.state.server_url} isStaff={this.state.isStaff}{...args}/>} />
            <Route exact path="/moviemania/movies_detailed/:id" component={args => <MovieDetailedComp server_url={this.state.server_url} isStaff={this.state.isStaff}{...args}/>} />
            <Route exact path="/moviemania/movies_detailed/:id/update" component={args => <UpdateMovieComp server_url={this.state.server_url} isStaff={this.state.isStaff}{...args}/>} />

            <Route exact path="/moviemania/reviews/:movie_id" component={args => <ReviewListComp server_url={this.state.server_url} isLoggedIn={this.state.isLoggedIn} username={this.state.username}{...args}/>} />
            <Route exact path="/moviemania/add_review/:movie_id" component={args => <CreateReviewComp server_url={this.state.server_url} isLoggedIn={this.state.isLoggedIn}{...args}/>} />
            <Route exact path="/moviemania/update_review/:movie_id" component={args => <EditReviewComp server_url={this.state.server_url} isLoggedIn={this.state.isLoggedIn}{...args}/>} />

            <Route exact path="/moviemania/celebs" component={args => <CelebListComp server_url={this.state.server_url} isStaff={this.state.isStaff}{...args}/>} />
            <Route exact path="/moviemania/celebs/create" component={args => <AddCelebComp server_url={this.state.server_url} isStaff={this.state.isStaff}{...args}/>} />
            <Route exact path="/moviemania/celebs_detailed/:id" component={args => <CelebDetailedComp server_url={this.state.server_url} isStaff={this.state.isStaff}{...args}/>} />
            <Route exact path="/moviemania/celebs_detailed/:id/update" component={args => <UpdateCelebComp server_url={this.state.server_url} isStaff={this.state.isStaff}{...args}/>} />

            <Route exact path="/moviemania/genres" component={args => <GenreListComp server_url={this.state.server_url} {...args}/>} />
            <Route exact path="/moviemania/genres/:id" component={args => <GenreDetailedComp server_url={this.state.server_url} {...args}/>} />

            <Route exact path="/moviemania/search" component={args => <SearchComp server_url={this.state.server_url} {...args}/>} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
