import { SET_CURRENT_USER } from "../actions/types";
import isEmpty from "../validation/isEmpty";
const initialState = {
  profile: null,
  profiles: null,
  loading: false
};
export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {};
    default:
      return state;
  }
}
