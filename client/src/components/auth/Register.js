import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
// This is used to connect redux to this component
// A container is a redux component that works with redux

import { connect } from "react-redux";
import { registeruser } from "../../actions/authActions";

import { withRouter } from "react-router-dom";

import TextFieldGroup from "../common/TextFieldGroup";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      errors: ""
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }
  //This runs when the component receives new properties
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  onSubmit(e) {
    // Since it's a form, we don't want it to have its default behavior
    // TODO: What is the default behavior of form
    e.preventDefault();
    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };
    // Any action that we bring-in is going to be stored inside props
    // The 2nd param will allow us to redirect from inside the action registerUser
    this.props.registeruser(newUser, this.props.history);
  }
  render() {
    // Using DECONSTRUCTING here: Using the braces will allow me to pull errors from the state instead
    // of asssigning it directly like this:
    // const errors = this.state.errors
    const { errors } = this.state;
    return (
      <div>
        <div className="register">
          <div className="container">
            <div className="row">
              <div className="col-md-8 m-auto">
                <h1 className="display-4 text-center">Sign Up</h1>
                <p className="lead text-center">
                  Create your DevConnector account
                </p>
                <form noValidate onSubmit={this.onSubmit}>
                  <TextFieldGroup
                    placeholder="Name"
                    name="name"
                    //if the type is text we don't actually need to pass it
                    //type="text"
                    value={this.state.name}
                    onChange={this.onChange}
                    error={errors.name}
                  />
                  <TextFieldGroup
                    placeholder="Email Address"
                    name="email"
                    type="email"
                    value={this.state.email}
                    onChange={this.onChange}
                    error={errors.email}
                    info="This site uses Gravatar so if you want a profile image,
                    use a Gravatar email"
                  />
                  <TextFieldGroup
                    placeholder="Password"
                    name="password"
                    type="password"
                    value={this.state.password}
                    onChange={this.onChange}
                    error={errors.password}
                  />
                  <TextFieldGroup
                    placeholder="Confirm password"
                    name="password2"
                    type="password"
                    value={this.state.password2}
                    onChange={this.onChange}
                    error={errors.password2}
                  />
                  <input
                    type="submit"
                    className="btn btn-info btn-block mt-4"
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
//TODO: Why do I have to use propTypes
Register.propTypes = {
  // Remember that registerUser is an action but it's also a property
  //this.props.registeruser(newUser);
  registeruser: PropTypes.func.isRequired,
  // auth is also a property; inside mapStateToProps
  // TODO: What does isRequired mean
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};
/**This function should take state as an argument, then return an object which maps that state to specific property names.
 * These properties will become accessible to your component via props.
 */
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});
export default connect(mapStateToProps, { registeruser })(withRouter(Register));
