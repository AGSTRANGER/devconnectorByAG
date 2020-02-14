import { GET_PROFILE, PROFILE_LOADING, CLEAR_CURRENT_PROFILE } from "./types";
import axios from "axios";
//TODO: Must understand how you can use use dispatch here
export const getCurrentProfile = history => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get("/api/profile")
    .then(res => {
      // if status is 200 this will run
      console.log("/api/profile response received");
      console.log(res);
      //TODO: Must understand when to dispatch an action and when not
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      });
    })
    .catch(err => {
      console.log("/api/profile error received");
      console.log(err);
      dispatch({
        // We don't want to turn an error
        // because if there'snt one, we just wanna return an empty object
        // The reason for this is that you can register as a user and NOT HAVE A PROFILE
        // So it's not technically an error
        // And we'll just tell the user that he has to create a profile
        type: GET_PROFILE,
        payload: {}
      });
    });
};

// Set logged in user
export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  };
};

// Set logged in user
export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE
  };
};
