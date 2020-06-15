import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./Home.css";

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            url: "http://localhost:5000",
            myData: [],
            allData: []
        };
    }

    componentDidMount() {
        this.getMyData();
        this.getAllData();
    }

    // fetches only the data of my proile
    getMyData() {
        fetch(`${this.state.url}/home/mydata`, {
            method: "GET",
            headers: {
                'content-type': 'application/json',
                authorization: `Bearer ${localStorage.token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
            });
    }

    // fetches all users data
    getAllData() {
        fetch(`${this.state.url}/home/alldata`, {
            method: "GET",
            headers: {
                'content-type': 'application/json',
                authorization: `Bearer ${localStorage.token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
            });
    }

    render() {
        return (
            <div className="home_body">

                <div className="friends_div">
                    <div className="hamburger">
                        <div>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                    <h1>FRIENDS</h1>
                    <div className="friendList"></div>
                </div>
                <div className="chat_div"></div>
                <div className="addFriends_div">
                    <h1>SEARCH</h1>

                    <div className="usersList"></div>
                </div>
            </div>
        );
    }
}

export default withRouter(Home);