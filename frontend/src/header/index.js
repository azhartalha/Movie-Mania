import React, {Component} from 'react';
import { BrowserRouter as Router, Link} from "react-router-dom";
class MMHeader extends Component{
    constructor(props)
    {
        super(props);
        console.log("header", props)  
        this.state = {
            isLoggedIn: this.props.isLoggedIn,
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
        this.props.setLoginStatus(false);
    }

    setSearchType(){
        var selectBox = document.getElementById("search-select");
        var selectedValue = selectBox.options[selectBox.selectedIndex].value;
        this.setState({sreachType: selectedValue});
    }
    
    render(){
        const {title} = this.props;
        const isLoggedIn = this.props.isLoggedIn;
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <div className="header">
                <h1 className="Title" href="#">{title}</h1>
                <div className="header-center">
                    <div className="form-inline my-2 my-lg-0">
                        <input className="form-control mr-sm-2" type="text" id="seach-bar" placeholder="Search"/>
                        <select multiple="" className="form-control" id="search-select">
                            <option value={1}>movie</option>
                            <option value={2}>celeb</option>
                        </select> &nbsp;&nbsp;
                        <Link className="btn btn-secondary my-2 my-sm-0" to="/moviemania/search">Search</Link>
                    </div>
                    <div className="header-center-bottom">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <a className="nav-link" href="javascript:void(0);">Movies</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="javascript:void(0);">Celebs</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="javascript:void(0);">Genres</a>
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
                                        <a href="javascript:void(0);">Account</a>
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
            </nav>
        );
    }
}

export default MMHeader;