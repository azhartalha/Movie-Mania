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
                <div>
                    <div className="MM_lable">
                        <Link to="/moviemania/account/update"> Edit details / Change password</Link>
                    </div>
                    <div className="MM_lable">
                        <label>Username:</label>
                        <label>{this.props.username}</label>
                    </div>
                    <div className="MM_lable">
                        <label>First Name:</label>
                        <label>{this.state.data.first_name === ""? "Not provided": this.state.data.first_name}</label>
                    </div>
                    <div className="MM_lable">
                        <label>Last Name:</label>
                        <label>{this.state.data.last_name === ""? "Not provided": this.state.data.last_name}</label>
                    </div>
                    <div className="MM_lable">
                        <label>Email:</label>
                        <label>{this.state.data.emal === ""? "Not provided": this.state.data.email}</label>
                    </div>
                </div>
        )
        else
            return <Redirect to="/moviemania/login" />
    }
}

export default UserComp;