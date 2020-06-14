import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import showPassword from "../../assets/show_pass.png";
import hidePassword from "../../assets/hide_pass.png";
import errorCross from "../../assets/error.png";
import check from "../../assets/check.png";
import loading from "../../assets/loading.gif";
import "./Register.css";

// https://dev.to/christiankastner/integrating-p5-js-with-react-i0d
// 1280 x 610 

function alertUser(text, isSuccess) {
    const div = document.querySelector(".reg_msg");
    const symbolDiv = document.querySelector(".reg_msg div");
    const img = document.querySelector(".reg_msg div img");
    const msg = document.querySelector(".reg_msg p");

    div.style.opacity = "1";
    img.style.opacity = "1";
    msg.style.opacity = "1";
    symbolDiv.style.opacity = "1";

    msg.textContent = text;

    if (isSuccess) {
        img.src = check;
        symbolDiv.style.backgroundColor = "white";
        msg.style.color = "#fff";
    } else {
        img.src = errorCross;
        symbolDiv.style.backgroundColor = "#b25757";
        msg.style.color = "#b25757";
    }

    setTimeout(() => {
        symbolDiv.style.opacity = "0";
        msg.style.opacity = "0";
        img.style.opacity = "0";
        div.style.opacity = "0.4";
    }, 2500);
}

class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isShowEye: false,
            url: "http://localhost:5000"
        };

        this.alternatePassword = this.alternatePassword.bind(this);
    }

    validateRegistration(e) {
        e.preventDefault();
        const username = document.getElementsByName("register_username")[0].value;
        const password = document.getElementsByName("register_password")[0].value;
        const fullname = document.getElementsByName("register_fullname")[0].value;

        if (username.length < 6) {
            alertUser("Username must be longer than 5 letters", false);
            return;
        } else if (password.length < 6) {
            alertUser("Password must be longer than 5 letters", false);
            return;
        } else if (fullname.length < 6) {
            alertUser("Enter a valid name", false);
            return;
        }

        const user = {
            username,
            fullname,
            password
        };

        // show gif
        document.querySelector(".reg_acc button").style.display = "none";
        document.querySelector(".reg_acc img").style.display = "block";


        fetch(`${this.state.url}/register`, {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
                "content-type": "application/json",
            }
        })
            .then(response => response.json())
            .then(data => {
                // show gif
                document.querySelector(".reg_acc button").style.display = "block";
                document.querySelector(".reg_acc img").style.display = "none";

                console.log(data);

                if (data === "EXISTS") {
                    alertUser("Username unavailable", false);
                } else if (data === "OK") {
                    alertUser("Account successfully created", true);
                }
            })

    }

    alternatePassword() {
        // shadow
        const span = document.querySelector("form div span");
        const img = document.querySelector("form div span img");
        const input = document.getElementsByName("register_password")[0];
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
                                <label htmlFor="register_username">Username</label>
                                <input type="text" name="register_username" className="register_username_input" spellCheck="false" autoComplete="off" />
                            </div>
                            <div>
                                <label htmlFor="register_fullname">Full Name</label>
                                <input type="text" name="register_fullname" className="register_fullname_input" spellCheck="false" autoComplete="off" />
                            </div>
                            <div>
                                <label htmlFor="register_password">Password</label>
                                <input type="password" name="register_password" spellCheck="false" autoComplete="off" />
                                <span>
                                    <img src={showPassword} alt="showPass" onClick={this.alternatePassword} />
                                </span>
                            </div>
                            <div className="reg_acc">
                                <button type="submit" onClick={(e) => this.validateRegistration(e)}>Register Account</button>
                                <img src={loading} alt="loading" />
                            </div>
                            <div className="reg_msg">
                                <div>
                                    <img src={errorCross} alt="error" />
                                </div>
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

export default withRouter(Register);