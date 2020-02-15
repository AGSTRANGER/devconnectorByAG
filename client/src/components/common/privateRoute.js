import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";

import PropTypes from "prop-types";
import { connect } from "react-redux";
const PrivateRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      auth.isAuthenticated === true ? (
        // If user is authenticated render Component
        <Component {...props} />
      ) : (
        // Else redirect to login
        <Redirect to="/login" />
      )
    }
  ></Route>
);
PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps)(PrivateRoute);
