import { SET_CURRENT_USER } from "../actions/types";
import isEmpty from "../validation/isEmpty";
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
    case SET_CURRENT_USER:
      return {
        ...state,
        // Because, if the payload which is the decoded token is filled that means that the user is authenticated
        // If it's an empty object then we shouldn't be authenticated
        // This way when we want to log-out  we can simply pass an empty object in the payload :)
        // And the user will go back to being an empty object
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };
    default:
      return state;
  }
}
