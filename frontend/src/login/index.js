import React, {Component} from 'react';

class LoginClass extends Component{
    
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

    login(){
        const name = document.getElementById("usernameField").value;
        const pass = document.getElementById("passwordField").value;
        fetch('http://127.0.0.1:8000/api-token-auth/', {
            method: 'post',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: `username=${name}&password=${pass}`
        }).then(res => res.status==400?alert("Invalid details"):res.json().then(response => {
            console.log(this)
            this.createCookie("JWT", response.token, 1);
            this.createCookie("username", name, 1);
            this.props.setLoginStatus(true, name);
        }).then(() => this.setState({name:"", pass:""})));
    }

    render(){
        return(
        <div>
            <div className="MMlogin-form">
                <input className="form-control mr-sm-2" type="text" id="usernameField" placeholder="username"/>
                <input className="form-control mr-sm-2" type="password" id="passwordField" placeholder="password"/>
                <button type="button" className="btn btn-info" onClick={() => this.login()}>Login</button>
            </div>
        </div>
        )
    }
}

export default LoginClass;