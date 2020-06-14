import React, { Component } from "react";
import { Link } from "react-router-dom";
import showPassword from "../../assets/show_pass.png";
import hidePassword from "../../assets/hide_pass.png";
import "./Register.css";

// https://dev.to/christiankastner/integrating-p5-js-with-react-i0d
// 1280 x 610 

class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isShowEye: false,
        };

        this.alternatePassword = this.alternatePassword.bind(this);
    }

    alternatePassword() {
        // shadow
        const span = document.querySelector("form div span");
        const img = document.querySelector("form div span img");
        const input = document.getElementsByName("password")[0];
        span.style.boxShadow = "inset 6px 6px 13px #21a48e, inset -6px -6px 13px #2ddec0";

        // toggle eye
        if (!this.state.isShowEye) {
            img.src = hidePassword;
            input.type = "text";
        } else {
            img.src = showPassword;
            input.type = "password";
        }
        this.setState({
            isShowEye: !this.state.isShowEye
        });

        // remove shadow
        setTimeout(() => {
            span.style.boxShadow = "none";
        }, 100);
    }

    render() {
        return (
            <div className="reg_auth_body">
                <div className="reg_login_h1">
                    <Link to="/" >Login</Link>
                </div>
                <div className="reg_reg_h1">
                    <h1>Register</h1>
                </div>
                <div className="reg_auth_big_div">
                    <div className="reg_auth_div">
                        <div className="reg_sockonnect">
                            <h1>Sockonnect</h1>
                            <p>A Messaging App</p>
                        </div>
                        <div className="reg_auth_path">
                            <h1>R</h1>
                            <h1>E</h1>
                            <h1>G</h1>
                            <h1>I</h1>
                            <h1>S</h1>
                            <h1>T</h1>
                            <h1>E</h1>
                            <h1>R</h1>
                        </div>
                        <form>
                            <div>
                                <label htmlFor="username">Username</label>
                                <input type="text" name="username" className="register_username_input" spellCheck="false" autoComplete="off" />
                            </div>
                            <div>
                                <label htmlFor="password">Password</label>
                                <input type="password" name="password" spellCheck="false" autoComplete="off" />
                                <span>
                                    <img src={showPassword} alt="showPass" onClick={this.alternatePassword} />
                                </span>
                            </div>
                            <div className="reg_acc">
                                <h1>Register Account</h1>
                            </div>
                            <div className="reg_msg">
                                <div></div>
                                <p></p>
                            </div>
                        </form>
                        <span className="RD_auth_round">
                            <div>
                                <h2>R D</h2>
                            </div>
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

export default Register;