import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import LoginClass from "./login";
class MMBody extends Component{
    render(){
        return(
            <div className="MMbody">
            <Router history={this.props.history}>
                <div>
                    <Route exact path="/moviemania/login" component={args => <LoginClass auth={this.props.auth}/>} />
                </div>
            </Router>
            </div>
        )
    }
}

export default MMBody