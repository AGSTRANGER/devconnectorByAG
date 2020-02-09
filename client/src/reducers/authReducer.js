const initialState = {
  isAuthenticated: false,
  user: {}
};
// RR: This function takes in action because we are going to dispatch actions to reducer
export default function(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
