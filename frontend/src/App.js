import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Home from "./components/Home/Home";

class App extends Component {
  render() {
    return (
      <Router>
        <Route exact strict path={["/", "/login"]} component={Login}></Route>
        <Route exact strict path="/register" component={Register} ></Route>

        <Route exact path="/home/:username" render={() => (
          localStorage.token ? <Home /> : <Redirect to="/" />
        )}></Route>

      </Router>
    )
  }
}

export default App;
