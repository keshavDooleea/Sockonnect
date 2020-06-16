import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import showPassword from "../../assets/show_pass.png";
import hidePassword from "../../assets/hide_pass.png";
import loading from "../../assets/loading.gif";
import errorCross from "../../assets/error.png";
import check from "../../assets/check.png";
import socketIOClient from "socket.io-client";
import "./Login.css";

// https://dev.to/christiankastner/integrating-p5-js-with-react-i0d
// https://www.pinterest.ca/pin/590534569872873352/visual-search/?x=16&y=12&w=530&h=397
// https://medium.com/@noufel.gouirhate/build-a-simple-chat-app-with-node-js-and-socket-io-ea716c093088
// https://www.valentinog.com/blog/socket-react/
// laptop size: 1280 x 610 

// msg shown to user
function alertUser(text, isSuccess) {
    const div = document.querySelector(".login_msg");
    const symbolDiv = document.querySelector(".login_msg div");
    const img = document.querySelector(".login_msg div img");
    const msg = document.querySelector(".login_msg p");

    div.style.opacity = "1";
    img.style.opacity = "1";
    msg.style.opacity = "1";
    symbolDiv.style.opacity = "1";
    msg.textContent = text;

    if (isSuccess) {
        img.src = check;
        symbolDiv.style.backgroundColor = "white";
        msg.style.color = "white";
        msg.style.backgroundColor = "#27c1a7";
    } else {
        img.src = errorCross;
        symbolDiv.style.backgroundColor = "#b25757";
        msg.style.backgroundColor = "white";
        msg.style.color = "#b25757";
    }

    setTimeout(() => {
        symbolDiv.style.opacity = "0";
        msg.style.opacity = "0";
        img.style.opacity = "0";
        div.style.opacity = "0.4";
    }, 2500);
}

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isShowEye: false,
            endpoint: "http://localhost:5000"
        };

        this.alternatePassword = this.alternatePassword.bind(this);
    }

    validateRegistration(e) {
        e.preventDefault();
        const username = document.getElementsByName("username")[0].value.toLowerCase();
        const password = document.getElementsByName("password")[0].value;

        if (username.length < 6) {
            alertUser("Username must be longer than 5 letters", false);
            return;
        } else if (password.length < 6) {
            alertUser("Password must be longer than 5 letters", false);
            return;
        }

        const user = {
            username,
            password
        };

        // show gif
        document.querySelector(".sign_in button").style.display = "none";
        document.querySelector(".sign_in img").style.display = "block";


        fetch(`${this.state.endpoint}/login`, {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
                "content-type": "application/json",
            }
        })
            .then(response => response.json())
            .then(data => {
                // show gif
                document.querySelector(".sign_in button").style.display = "block";
                document.querySelector(".sign_in img").style.display = "none";

                console.log(data);

                if (data === "USERNAME") {
                    alertUser("Username incorrect", false);
                } else if (data === "PASSWORD") {
                    alertUser("Password incorrect", false);
                } else if (data.status === "OK") {
                    alertUser("Login successful", true);
                    localStorage.setItem("token", data.token);

                    // inform server through socket
                    const socket = socketIOClient(this.state.endpoint);
                    socket.on("FromAPI", data => {
                        console.log("CLIENT SIDE");
                    });


                    setTimeout(() => {
                        this.props.history.push("/home");
                    }, 2500);
                }
            })

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
            <div className="auth_body">
                <div className="login_h1">
                    <h1>Login</h1>
                </div>
                <div className="reg_h1">
                    <Link to="/register" >Register</Link>
                </div>
                <div className="auth_big_div">
                    <div className="auth_div">
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
                        <form>
                            <div>
                                <label htmlFor="username">Username</label>
                                <input type="text" name="username" className="login_username_input" spellCheck="false" autoComplete="off" />
                            </div>
                            <div>
                                <label htmlFor="password">Password</label>
                                <input type="password" name="password" spellCheck="false" autoComplete="off" />
                                <span>
                                    <img src={showPassword} alt="showPass" onClick={this.alternatePassword} />
                                </span>
                            </div>
                            <div className="sign_in">
                                <button type="submit" onClick={(e) => this.validateRegistration(e)}>Sign In</button>
                                <img src={loading} alt="loading" />
                            </div>
                            <div className="login_msg">
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

export default withRouter(Login);