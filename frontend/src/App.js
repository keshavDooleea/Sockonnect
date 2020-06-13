import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import './App.css';

import Login from "./components/Login";

class App extends Component {
  render() {
    return (
      <Router>
        <Route exact strict path={["/", "/login"]} component={Login}></Route>
      </Router>
    )
  }
}

export default App;
