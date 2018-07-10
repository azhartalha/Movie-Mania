import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Redirect} from "react-router-dom";
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
        fetch(this.props.server_url+'/api-token-auth/', {
            method: 'post',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: `username=${name}&password=${pass}`
        }).then(res => {
            if(res.status==400)
            {
                alert("Invalid details")   
            }
            else
            {
                res.json()
                .then(response => {
                    this.createCookie("JWT", response.token, 1);
                    this.createCookie("username", name, 1);
                    fetch(this.props.server_url+"/MM_apis/user_permissions", {headers: {
                        'Authorization': "JWT "+response.token
                      }
                    })
                .then(res =>{
                    if(res.status==403)
                    {
                        this.createCookie("isStaff", "0", 1);
                        this.props.setLoginStatus(true, name, "0");
                    }
                    else
                    {
                        this.createCookie("isStaff", "1", 1);
                        this.props.setLoginStatus(true, name, "1");
                    }
                })
                })
            }
        });
    }

    render(){
        return(
        this.props.isLoggedIn?<Redirect to="/moviemania/movies"/>:
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
