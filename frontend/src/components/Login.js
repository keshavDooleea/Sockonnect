import React, { Component } from "react";
import "../App.css"

class Login extends Component {
    render() {
        return (
            <div className="auth_body">
                <div className="login_h1">
                    <h1>Login</h1>
                </div>
                <div className="reg_h1">
                    <h1>Register</h1>
                </div>
                <div className="auth_div"></div>
            </div>
        );
    }
}

export default Login;