import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Redirect, Link} from "react-router-dom";
class MMHeader extends Component{
    
    constructor(props)
    {
        super(props);
        this.state = {
            isLoggedIn: this.props.isLoggedIn,
            searchURL: "/moviemania/search?type=",
            searchType: "movie",
            searchValue: ""
        }
    }
    createCookie(name,value,days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 *1000));
            var expires = "; expires=" + date.toGMTString();
        }
        else {
            var expires = "";
        }
        document.cookie = name + "=" + value + expires + "; path=/";
    }
    
    eraseCookie(name) {
        this.createCookie(name,"",-1);
    }

    logout = () => {
        this.eraseCookie("JWT");
        this.eraseCookie("username");
        this.eraseCookie("isStaff");
        this.props.setLoginStatus(false, "", "");
    }
    
    updateSearchType()
    {
        const type = document.getElementById("search-select").value;
        this.setState({searchType: type});
    }

    updateSearchValue()
    {
        const value = document.getElementById("search-bar").value;
        this.setState({searchValue: value});
    }

    render(){
        const {title} = this.props;
        const isLoggedIn = this.props.isLoggedIn;
        var link_style = {
            margin: "8px",
            color: "white"
        }
        var search_div = {
            width: "1000px"
        }
        
        var search_bar = {
            width: "200px",
            marginRight: "10px"
        }

        var search_type = {
            width: "90px",
            marginRight: "10px"
        }
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <div className="header">
                <Link to="/moviemania/"><h1 className="Title">{title}</h1></Link>
                <div className="header-center" style={search_div}>
                    <div className="form-inline">
                        <input style={search_bar} className="form-control" type="text" id="search-bar" onChange={()=> this.updateSearchValue()} placeholder="Search"/>
                        <select style={search_type} multiple="" className="form-control" onChange={() => this.updateSearchType()} id="search-select">
                            <option value="movie">movie</option>
                            <option value="celeb">celeb</option>
                        </select>
                        <Link className="btn btn-secondary my-2 my-sm-0" to={
                            this.state.searchURL + this.state.searchType +"&value=" + this.state.searchValue
                            }>
                            Search
                        </Link>
                    </div>
                    <div className="header-center-bottom">
                        <span>
                                <Link style={link_style} to="/moviemania/">Home</Link>
                        </span>
                        <span>
                                <Link style={link_style} to="/moviemania/movies">Movies</Link>
                        </span>
                        <span>
                                <Link style={link_style} to="/moviemania/celebs">Celebs</Link>
                        </span>
                        <span>
                                <Link style={link_style} to="/moviemania/genres">Genres</Link>
                        </span>
                    </div>
                </div>
                <div className="header-right">
                    {
                        isLoggedIn?
                        <ul className="nav nav-pills">
                            <li className="nav-item dropdown show" id="MMdropdown">
                                <a className="nav-link dropdown-toggle" data-toggle="dropdown" href="javascript:void(0);" role="button" aria-haspopup="true" aria-expanded="false" id="MMdropbtn">{this.props.username}</a>
                                    <div x-placement="bottom-start" id="MMdropdown-content">
                                        <Link to="/moviemania/account">Account</Link>
                                        <a href="javascript:void(0);" onClick={this.logout}>Logout</a>
                                    </div>
                            </li>
                        </ul>:
                        <div>
                            <span>
                                <Link style={link_style} to ='/moviemania/login'>Login</Link>
                            </span>
                            <span>
                                <Link style={link_style} to ='/moviemania/signup'>SignUp</Link>
                            </span>
                        </div>
                    }
                </div>
                </div>
            </nav>
        );
    }
}

export default MMHeader;


/*<nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <div className="header">
                <Link to="/moviemania/"><h1 className="Title">{title}</h1></Link>
                <div className="header-center">
                    <div className="form-inline">
                        <input className="form-control mr-sm-2" type="text" id="search-bar" onChange={()=> this.updateSearchValue()} placeholder="Search"/>
                        <select multiple="" className="form-control" onChange={() => this.updateSearchType()} id="search-select">
                            <option value="movie">movie</option>
                            <option value="celeb">celeb</option>
                        </select> &nbsp;&nbsp;
                        <Link className="btn btn-secondary my-2 my-sm-0" to={
                            this.state.searchURL + this.state.searchType +"&value=" + this.state.searchValue
                            }>
                            Search
                        </Link>
                    </div>
                    <div className="header-center-bottom">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/moviemania/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/moviemania/movies">Movies</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/moviemania/celebs">Celebs</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/moviemania/genres">Genres</Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="header-right">
                    {
                        isLoggedIn?
                        <ul className="nav nav-pills">
                            <li className="nav-item dropdown show" id="MMdropdown">
                                <a className="nav-link dropdown-toggle" data-toggle="dropdown" href="javascript:void(0);" role="button" aria-haspopup="true" aria-expanded="false" id="MMdropbtn">{this.props.username}</a>
                                    <div x-placement="bottom-start" id="MMdropdown-content">
                                        <Link to="/moviemania/account">Account</Link>
                                        <a href="javascript:void(0);" onClick={this.logout}>Logout</a>
                                    </div>
                            </li>
                        </ul>:
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to ='/moviemania/login'>Login</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to ='/moviemania/signup'>SignUp</Link>
                            </li>
                        </ul>
                    }
                </div>
                </div>
            </nav>*/