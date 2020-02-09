import { GET_ERRORS } from "../actions/types";

const initialState = {};
// RR: This function takes in action because we are going to dispatch actions to reducer
export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ERRORS:
      // RR: The payload will include the error object in authActions.js
      /** dispatch({
        type: GET_ERRORS,
        payload: error.response.data
      }); */
      return action.payload;
    default:
      return state;
  }
}
