import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentProfile } from "../../actions/profileActions";

class Dashboard extends Component {
  // This is where we call an AJAX request even if we weren't using Redux
  componentDidMount() {
    this.props.getCurrentProfile();
  }
  render() {
    return <div>Dashboard</div>;
  }
}
export default connect(null, { getCurrentProfile })(Dashboard);
