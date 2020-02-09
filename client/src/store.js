// How is store connected to the component Register?
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
// We don't have to put index.js because we called our root reducer index.js
import rootReducer from "./reducers";

const initialState = {};
const middleware = [thunk];
//const store = createStore(() => [], {}, applyMiddleware(...middleware));
// Notice the replacement of the first argument which is a function with the rootReducer
// TODO: How is this possible when what is exported inside index.js is not a function
const store = createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(...middleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
  //applyMiddleware(...middleware)
);
export default store;
