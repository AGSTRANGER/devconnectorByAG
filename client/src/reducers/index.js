// This is where we want to bring-in all of our other reducers and combine them that's it
import { combineReducers } from "redux";
import authReducer from "./authReducer";

export default combineReducers({
  // When we use anything in our Auth reducers in our components we will use this.props.auth
  // If we want to call an action or something like that
  auth: authReducer
});
