import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./Home.css";

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            url: "http://localhost:5000",
            myData: [],
            allData: [],
            isDataFetched: false
        };
    }

    componentDidMount() {
        // this.getMyData();
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
                this.setState({
                    allData: data,
                    isDataFetched: true
                });
            });
    }

    showPeople() {
        // let searchWord = document.querySelector(".addFriends_div input").value.toUpperCase();
        let data = this.state.allData;
        // let text;

        // for (let i = 0; i < data.length; i++) {
        //     text = data[i].username || data[i].fullname;
        //     if (text.toUpperCase().indexOf(searchWord) > -1) {
        //         console.log(data[i]);
        //     } else {
        //         // li[i].style.display = "none";
        //     }
        // }

        return <div>
            {data.map(item => (
                <div key={item.username} className="people_list_item">
                    <div key={item.username} className="people_name_div">
                        <h1 key={item.username}>{item.username}</h1>
                        <h4 key={item.fullname}>{item.fullname}</h4>
                    </div>
                    <div className="people_add_div">
                        <span>Add Friend</span>
                    </div>
                </div>
            ))}
        </div>;
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

                    <input type="text" onChange={() => { this.setState({ isSearching: true }) }} spellCheck="false" autoComplete="off" placeholder="Username or Full Name" />

                    <div className="usersList">
                        {this.state.isDataFetched ? this.showPeople() : null}
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Home);