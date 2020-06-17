import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import socketIOClient from "socket.io-client";
import "./Home.css";
const ENDPOINT = "http://localhost:5000";
const socket = socketIOClient(`${ENDPOINT}`);

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            myData: [],
            allData: [],
            isDataFetched: false,
            isHamburgerOpen: false,
        };
    }

    componentDidMount() {
        this.handleSocket();
    }

    // inform server through socket
    handleSocket() {
        socket.emit("newUserConnected", {
            username: this.props.location.state.username
        });

        socket.on("message", data => {
            console.log(data);
        });

        socket.on("allUsers", data => {
            // get current users position
            let index = data.findIndex((user) => {
                return user === this.props.location.state.username
            });

            // show number of requests
            // document.querySelector(".request_number_div p").textContent = data[index].requests_received.length;

            // remove actual user
            data.splice(index, 1);

            this.setState({
                allData: data,
                isDataFetched: true
            });
        });
    }

    sendFriendRequest(e) {
        const data = {
            from: this.props.location.state.username,
            to: e.target.parentElement.parentElement.querySelector(".people_name_div h1").textContent
        };

        socket.emit("newFriendRequest", data);
    }

    // displays the name of all users
    showPeople() {
        let data = this.state.allData;

        return <div>
            {data.map(item => (
                <div key={item._id} className="people_list_item">
                    <div key={item.username} className="people_name_div">
                        <h1 key={item}>{item}</h1>
                        <h4 key={item.fullname}>{item.fullname}</h4>
                    </div>
                    <div className="people_add_div">
                        <button onClick={(e) => this.sendFriendRequest(e)}>+</button>
                    </div>
                </div>
            ))}
        </div>;
    }

    // filter the names of people
    filterPeople() {
        let searchWord = document.querySelector(".addFriends_div input").value.toUpperCase();
        let div = document.querySelectorAll(".people_list_item");
        let data = this.state.allData;
        let text;

        for (let i = 0; i < data.length; i++) {
            text = data[i].username || data[i].fullname;
            if (text.toUpperCase().indexOf(searchWord) > -1) {
                div[i].style.display = "flex";
            } else {
                div[i].style.display = "none";
            }
        }
    }

    toggleHamburger() {
        this.setState({
            isHamburgerOpen: !this.state.isHamburgerOpen
        });

        if (!this.state.isHamburgerOpen) {
            document.querySelector(".hamburger div").classList.remove("rotateHamDown");
            document.querySelector(".hamburger div").classList.add("rotateHamUp");

            setTimeout(() => {
                document.querySelector(".hamburger_div").classList.remove("closeHam");
                document.querySelector(".hamburger_div").classList.add("openHam");
            }, 250);
        } else {
            document.querySelector(".hamburger div").classList.remove("rotateHamUp");
            document.querySelector(".hamburger div").classList.add("rotateHamDown");
            setTimeout(() => {
                document.querySelector(".hamburger_div").classList.remove("openHam");
                document.querySelector(".hamburger_div").classList.add("closeHam");
            }, 250);
        }
    }

    render() {
        return (
            <div className="home_body">

                <div className="friends_div">
                    <div className="hamburger">
                        <div onClick={() => this.toggleHamburger()}>
                            <span></span>
                            <span></span>
                            <span></span>
                            <div className="request_number_div">
                                {/* {this.state.isDataFetched ? <p>{this.state.allData[0].requests_received.length}</p> : null} */}
                                <p></p>
                            </div>
                        </div>
                    </div>
                    <div className="userDiv">
                        <h1>{this.props.location.state.username}'s </h1>
                        <h3>FRIENDS</h3>
                    </div>
                    <div className="friendList">
                    </div>

                    <div className="hamburger_div">
                        <div className="account_div">
                            <button>Account</button>
                        </div>
                        <div className="req_div">re</div>
                    </div>
                </div>
                <div className="chat_div"></div>
                <div className="addFriends_div">
                    <h1>SEARCH</h1>

                    <input type="text" onChange={() => this.filterPeople()} spellCheck="false" autoComplete="off" placeholder="Username or Full Name" />

                    <div className="usersList">
                        {this.state.isDataFetched ? this.showPeople() : null}
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Home);