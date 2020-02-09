// This is where we want to bring-in all of our other reducers and combine them that's it
import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
// This is improted inside store
export default combineReducers({
  // When we use anything in our Auth reducers in our components we will use this.props.auth
  // If we want to call an action or something like that
  auth: authReducer,
  errors: errorReducer
});
/**
 * In Register.js
 * const mapStateToProps = state => ({
  //It's putting the auth state inside a property called auth
  // So that we can access it with this.props.auth.AnythingInTheState like user,isAuthenticated
  // It's important to understand that state.auth comes from the rootReducer
  /**export default combineReducers({
  // When we use anything in our Auth reducers in our components we will use this.props.auth
  // If we want to call an action or something like that
  auth: authReducer
});

  auth: state.auth,
  errors: state.errors
});
 */
