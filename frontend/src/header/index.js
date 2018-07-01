import React, {Component} from 'react';
import { spawn } from 'child_process';
import { Redirect } from 'react-router-dom';

class MyHeader extends Component{
    constructor(props)
    {
        super(props);
        console.log("header", props)  
        this.state = {
            isLoggedIn: this.props.isLoggedIn,
        }
        console.log("header", this.state.isLoggedIn)
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
    
    eraseCookie(name) {
        this.createCookie(name,"",-1);
    }

    toggleLoggedIn = () => {
        if(this.props.isLoggedIn)
        {
            this.eraseCookie("JWT");
            this.setState(prev => {isLoggedIn: !prev.isLoggedIn});
            this.props.toggler(this.state.isLoggedIn);    
        }
    }

    render(){
        const {title} = this.props;
        const isLoggedIn = this.props.isLoggedIn;
        console.log(isLoggedIn, "In Header")
        return (
            <div className="header">
                <h1 className = "title">{title}</h1>
                <div className = "Menu" onClick = {this.toggleLoggedIn}>
                    {
                        isLoggedIn?
                        <span>Logout</span>:
                        <span>Login</span>
                    }
                </div>
            </div>
        );
    }
}

export default MyHeader;