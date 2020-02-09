import { GET_ERRORS } from "../actions/types";

const initialState = {
  isAuthenticated: false,
  user: {}
};
// RR: This function takes in action because we are going to dispatch actions to reducer
export default function(state = initialState, action) {
  switch (action.type) {
    /**
     *     case TEST_DISPATCH:
      // RR: We don't really change or mutate the state, we make a copy of it
      return {
        // If we want to take what's already in the state and add to it, we use the spread operator ...
        // TODO: But why are we adding to the state?
        ...state,
        // This will fill the user with the payload
        user: action.payload
      };
     */

    default:
      return state;
  }
}
