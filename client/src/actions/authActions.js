import { GET_ERRORS, SET_CURRENT_USER } from "./types";
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
// REGISTER
// TODO: What is this syntax about?
// The double arrow is instead of putting the dispatch function inside the userData function
// Notice how it's called inside Register.js
export const registeruser = (userData, history) => dispatch => {
  axios
    //package.json: "proxy": "http://localhost:5000",
    .post("/api/users/register", userData)
    .then(res => {
      // if status is 200 this will run
      console.log(res.data);
      // We will want to redirect
      /**Redirecting from inside a component is easy
       * this.props.history.push('/dashboard')
       * But, we can't do that by default from within an action
       */
      // Redirecting from inside a function requires a couple of steps
      history.push("/login");
    })
    .catch(err => {
      // if status is 400 for example this will run
      //this.setState({ errors: err.response.data });
      console.log(err);
      // This is where thunk comes into play
      // Instead of returning we will be using dispatch
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
  // Deleted this, because now we will be performing an asynchronous action
  // We are fetching from the backend, we have to wait for the response
  // And then we are going to dispatch
  // This is where the thunk middleware is going to come in
  // We can't just return
  // TODO: Why can't we just return though?

  /**   //RR: We are going to dispatch this to the reducer
  return {
    type: TEST_DISPATCH,
    payload: userData
  };*/
};

// REGISTER
export const loginUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
      console.log(res.data);
      const { token } = res.data;
      // set token to ls
      // localStorage only stores strings
      localStorage.setItem("jwtToken", token);
      // set token to Auth header
      setAuthToken(token);
      // decode token to get user data
      const decoded = jwt_decode(token);
      // set current user
      dispatch(setCurrentUser(decoded));
      history.push("/");
    })
    .catch(err => {
      console.log(err);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// Set logged-in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};
