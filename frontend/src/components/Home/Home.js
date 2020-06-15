import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./Home.css";

class Home extends Component {

    render() {
        return (
            <div className="home_body">
                <div className="friends_div">
                    <div className="hamburger"></div>
                    <h1>FRIENDS</h1>
                    <div className="friendList"></div>
                </div>
                <div className="chat_div"></div>
                <div className="addFriends_div"></div>
            </div>
        );
    }
}

export default withRouter(Home);