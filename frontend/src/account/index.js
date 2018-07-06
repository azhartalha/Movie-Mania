import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Redirect, Link} from "react-router-dom";

class UserComp extends Component{
    
    constructor(props)
    {
        super(props);
        this.state ={data_loaded: false, data: {}};
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

    componentDidMount()
    {
        fetch("http://127.0.0.1:8000/MM_apis/user_detailed", {
           method: "get",
           headers: {
            'Authorization': "JWT "+this.readCookie("JWT")
          } 
        })
        .then( res => {
        if(res.status == 200)
             res.json()
            .then(response => {
                this.setState({data_loaded: true, data: response})
            })
        })
    }

    render(){
        if(this.props.isLoggedIn)
        return(
            !this.state.data_loaded?
                <p>Loading...</p>:
                <table className="table table-hover">
                   <tbody>
                    <tr>
                        <td>
                        <Link to="/moviemania/account/update"> Edit details / Change password</Link>
                        </td>
                    </tr>
                    <tr className="table-primary">
                        <td>Username:</td>
                        <td>{this.props.username}</td>
                    </tr>
                    <tr className="table-secondary">
                        <td>First Name:</td>
                        <td>{this.state.data.first_name === ""? "Not provided": this.state.data.first_name}</td>
                    </tr>
                    <tr className="table-primary">
                        <td>Last Name:</td>
                        <td>{this.state.data.last_name === ""? "Not provided": this.state.data.last_name}</td>
                    </tr>
                    <tr className="table-secondary">
                        <td>Email:</td>
                        <td>{this.state.data.emal === ""? "Not provided": this.state.data.email}</td>
                    </tr>
                    </tbody>
                </table>
        )
        else
            return <Redirect to="/moviemania/login" />
    }
}

class UserUpdateComp extends Component{
    
    constructor(props)
    {
        super(props);
        this.state ={data_loaded: false, data: {}, updated: false};
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

    componentDidMount()
    {
        fetch("http://127.0.0.1:8000/MM_apis/user_detailed", {
           method: "get",
           headers: {
            'Authorization': "JWT "+this.readCookie("JWT")
          } 
        })
        .then( res => {
        if(res.status == 200)
             res.json()
            .then(response => {
                this.setState({data_loaded: true, data: response})
            })
        })
    }

    update(){
        const pass = document.getElementById("passwordField").value;
        const repass = document.getElementById("re-passwordField").value;
        const email = document.getElementById("EmailField").value;
        const first = document.getElementById("FirstNameField").value;
        const last = document.getElementById("LastNameField").value;
        
        if(pass =="")
        {
            alert("password cannot be empty")
            return;
        }
        if(pass!=repass)
        {
            alert("passwords donot match")
            return;
        }
        const reg = /^([A-Za-z0-9_\-\-.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if(email != "" && !reg.test(email))
        {
            alert("Invalid email address")
            return;
        }
        const data = {password: pass, email: email, first_name: first, last_name: last}
        fetch("http://127.0.0.1:8000/MM_apis/user_detailed", {
                    method: 'put',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',  
                        'Authorization': "JWT "+this.readCookie("JWT")
                    },
                      body: JSON.stringify(data)
            })
        .then((res) => {
            if(res.status==201)
            {
                alert("Account updated");
                this.setState({updated: true});
            }
            else
                console.log(res.status);
        })  
    }

    render(){
        if(this.props.isLoggedIn)
            if(this.state.updated === false)
        return(
            !this.state.data_loaded?
                <p>Loading...</p>:
                <div>
                <table className="table table-hover">
                    <tbody>
                    <tr className="table-primary">
                        <td>password:</td>
                        <td><input className="form-control mr-sm-2" type="password" id="passwordField" placeholder="New password"/></td>
                    </tr>
                    <tr className="table-secondary">
                        <td>Re-enter password:</td>
                        <td><input className="form-control mr-sm-2" type="password" id="re-passwordField" placeholder="Confirm password"/></td>
                    </tr>
                    <tr className="table-primary">
                        <td>First Name:</td>
                        <td><input className="form-control mr-sm-2" type="text" id="FirstNameField" defaultValue={this.state.data.first_name}/></td>
                    </tr>
                    <tr className="table-secondary">
                        <td>Last Name</td>
                        <td><input className="form-control mr-sm-2" type="text" id="LastNameField" defaultValue={this.state.data.last_name}/></td>
                    </tr>
                    <tr className="table-primary">
                        <td>Email:</td>
                        <td><input className="form-control mr-sm-2" type="text" id="EmailField" defaultValue={this.state.data.email}/></td>
                    </tr>
                    </tbody>
                </table>
                <button type="button" className="btn btn-info" onClick={() => this.update()}>Update</button>
                </div>
        )
            else
                return <Redirect to="/moviemania/account" />
        else
            return <Redirect to="/moviemania/login" />
    }
}

export default UserComp;
export {UserUpdateComp};