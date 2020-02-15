import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentProfile } from "../../actions/profileActions";

import Spinner from "../common/Spinner";
import { Link } from "react-router-dom";

class Dashboard extends Component {
  // This is where we call an AJAX request even if we weren't using Redux
  componentDidMount() {
    this.props.getCurrentProfile();
  }
  render() {
    const user = this.props.auth;
    const { profile, loading } = this.props.profile;

    let dashboardContent;

    // RR: In getCurrentProfile: dispatch(setProfileLoading()) so Loading gets set to true
    if (profile === null || loading) {
      dashboardContent = <Spinner>Loading...</Spinner>;
    } else {
      // Check if logged-in user has profile data
      // Check if profile state is an empty object
      if (Object.keys(profile).length > 0) {
        dashboardContent = <h4>TODO: DISPLAY PROFILE</h4>;
      } else {
        // User is logged-in but has no profile
        dashboardContent = (
          <div>
            <p className="lead text-muted"> Welcome {user.name}</p>
            <p> You have not set-up profile, please add some info!</p>
            <Link to="/create-profile" classname="btn btn-lg btn-info"></Link>
          </div>
        );
      }
    }
    return (
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4">Dashboard</h1>
              {dashboardContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profie: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
});
export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);
