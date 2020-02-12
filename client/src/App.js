// TODO: Why is component imported inside of brackets
import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import "./App.css";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";

import Register from "./components/auth/Register";
import Login from "./components/auth/Login";

// RR: Provider is a React component which provides our app with store which holds the state
// It has to wrap around everything
import { Provider } from "react-redux";
import store from "./store";

// This is to keep the user logged-in once he has logged-in
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";

// Check for token
// We will basically do the same thing we did in the login action
// But, this will be done every time the user requests a page to make sure if he's logged in or not
if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and expiration
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set User and is Authenticated
  store.dispatch(setCurrentUser(decoded));
  // Now if you reload a page, if the user has already logged-in you will still have his info in he state

  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Logout User
    store.dispatch(logoutUser());
    // TODO: Clear current profile
    // Redirect to login
    window.location.href = "/login";
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path="/" component={Landing}></Route>
            <div className="container">
              {/*  We will create a container that wraps everything except the landing page
               *  because we want the landing page to span across the whole screen*/}
              <Route exact path="/register" component={Register}></Route>
              <Route exact path="/login" component={Login}></Route>
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
