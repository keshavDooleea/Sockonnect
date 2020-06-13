import React, { Component } from "react";
import "../App.css"

// https://dev.to/christiankastner/integrating-p5-js-with-react-i0d
// 1280 x 610 

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
                <div className="auth_big_div">
                    <div className="auth_div">
                        <div className="RD_auth_round">R D</div>
                        <div className="sockonnect">
                            <h1>Sockonnect</h1>
                            <p>A Messaging App</p>
                        </div>
                        <div className="auth_path">
                            <h1>L</h1>
                            <h1>O</h1>
                            <h1>G</h1>
                            <h1>I</h1>
                            <h1>N</h1>
                        </div>
                        <form></form>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;